
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Firebase configuration - you'll need to set this up in your project
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual Firebase config
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Props {
  className?: string;
  userId?: string;
}

export const ThreeDRoomCanvas: React.FC<Props> = ({ className, userId = 'demoUser' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const modules = useRef<THREE.Mesh[]>([]);
  const selectedModule = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f7f5f2');
    
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(4, 3, 6);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(hemiLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: '#e2dfd6' })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(10, 20, '#cccccc', '#cccccc');
    scene.add(grid);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function addCote(mesh: THREE.Mesh) {
      const bbox = new THREE.Box3().setFromObject(mesh);
      const size = new THREE.Vector3();
      bbox.getSize(size);
      
      const textCanvas = document.createElement('canvas');
      const ctx = textCanvas.getContext('2d');
      if (!ctx) return;
      
      textCanvas.width = 256; 
      textCanvas.height = 64;
      ctx.fillStyle = '#000'; 
      ctx.font = '24px Arial';
      ctx.fillText(`${Math.round(size.x * 1000)}mm`, 10, 50);
      
      const tex = new THREE.CanvasTexture(textCanvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1, 0.25, 1);
      sprite.position.set(mesh.position.x, mesh.position.y + size.y + 0.1, mesh.position.z);
      mesh.add(sprite);
    }

    async function saveScene() {
      try {
        const data = modules.current.map((mesh) => ({
          pos: mesh.position,
          scale: mesh.scale,
          color: (mesh.material as THREE.MeshStandardMaterial).color.getHexString()
        }));
        await setDoc(doc(db, 'scenes', userId), { data });
        alert('Scena a fost salvată.');
      } catch (error) {
        console.error("Error saving scene:", error);
        alert('Eroare la salvare.');
      }
    }

    async function loadScene() {
      try {
        const snapshot = await getDoc(doc(db, 'scenes', userId));
        if (!snapshot.exists()) return;
        
        snapshot.data().data.forEach(({ pos, scale, color }: any) => {
          const geo = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
          const mat = new THREE.MeshStandardMaterial({ 
            color: '#' + color, 
            wireframe: wireframeMode 
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(pos.x, pos.y, pos.z);
          scene.add(mesh);
          modules.current.push(mesh);
          if (wireframeMode) addCote(mesh);
        });
      } catch (error) {
        console.error("Error loading scene:", error);
      }
    }

    function onMouseClick(event: MouseEvent) {
      if (!mountRef.current) return;
      
      // Calculate mouse position relative to the container
      const rect = mountRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouse.x = x;
      mouse.y = y;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(modules.current);
      
      if (intersects.length > 0) {
        selectedModule.current = intersects[0].object as THREE.Mesh;
        setShowEditor(true);
      } else {
        // Clicking elsewhere deselects
        selectedModule.current = null;
        setShowEditor(false);
      }
    }

    function handleMessage(e: MessageEvent) {
      const { type, width, height, depth, color, x = 0, z = 0 } = e.data;
      if (type === 'addModule') {
        const geo = new THREE.BoxGeometry(width, height, depth);
        const mat = new THREE.MeshStandardMaterial({ 
          color: color || '#c1a57b', 
          wireframe: wireframeMode 
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, height / 2, z);
        scene.add(mesh);
        modules.current.push(mesh);
        if (wireframeMode) addCote(mesh);
      }
    }

    // Add event listeners
    window.addEventListener('click', onMouseClick);
    window.addEventListener('message', handleMessage);

    // Handle window resize
    function handleResize() {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Load existing scene data
    loadScene();

    // Set up methods that need to be called from outside this effect
    window.saveScene = saveScene;
    window.toggleWireframeMode = () => {
      modules.current.forEach((mesh) => {
        if (mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).wireframe = !wireframeMode;
          
          // Add or remove cotes when toggling modes
          if (!wireframeMode) {
            addCote(mesh);
          } else {
            // Remove cotes (sprites) when going back to realistic mode
            mesh.children.forEach(child => {
              if (child instanceof THREE.Sprite) {
                mesh.remove(child);
              }
            });
          }
        }
      });
    };

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('resize', handleResize);
      
      // Clean up the global functions
      delete window.saveScene;
      delete window.toggleWireframeMode;
    };
  }, [wireframeMode, userId]);

  const toggleMode = () => {
    setWireframeMode(!wireframeMode);
    if (window.toggleWireframeMode) {
      window.toggleWireframeMode();
    }
  };

  const handleEdit = (field: string, value: string) => {
    if (!selectedModule.current) return;
    
    const mesh = selectedModule.current;
    const val = parseFloat(value);
    
    if (isNaN(val)) return;
    
    if (field === 'width') mesh.scale.x = val;
    if (field === 'height') mesh.scale.y = val;
    if (field === 'depth') mesh.scale.z = val;
  };

  return (
    <div className={`flex w-full ${className}`}>
      <div className="w-4/5 h-[80vh]" ref={mountRef} />
      <div className="w-1/5 p-4">
        <button
          className="bg-amber-600 text-white px-4 py-2 rounded shadow hover:bg-amber-700 transition mb-2"
          onClick={toggleMode}
        >
          {wireframeMode ? 'Mod Realist' : 'Mod Linie + Cote'}
        </button>
        <button
          className="bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-green-800 transition mb-4 ml-2"
          onClick={() => window.saveScene?.()}
        >
          💾 Salvează
        </button>

        {showEditor && (
          <div className="bg-white p-3 rounded shadow border">
            <h2 className="font-bold mb-2">Editare Modul</h2>
            <label className="block text-sm mb-1">Lățime</label>
            <input 
              type="number" 
              className="w-full mb-2 border px-2" 
              onChange={(e) => handleEdit('width', e.target.value)} 
            />
            <label className="block text-sm mb-1">Înălțime</label>
            <input 
              type="number" 
              className="w-full mb-2 border px-2" 
              onChange={(e) => handleEdit('height', e.target.value)} 
            />
            <label className="block text-sm mb-1">Adâncime</label>
            <input 
              type="number" 
              className="w-full mb-2 border px-2" 
              onChange={(e) => handleEdit('depth', e.target.value)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Add global function types
declare global {
  interface Window {
    saveScene?: () => Promise<void>;
    toggleWireframeMode?: () => void;
  }
}
