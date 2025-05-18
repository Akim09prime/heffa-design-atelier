
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { db } from '../../firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface Props {
  className?: string;
  userId?: string;
}

// Make modules available globally for the ExportSidebar component
declare global {
  interface Window {
    modules?: React.MutableRefObject<THREE.Mesh[]>;
  }
}

export const ThreeDRoomCanvas: React.FC<Props> = ({ className, userId = 'demoUser' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const modules = useRef<THREE.Mesh[]>([]);
  const selectedModule = useRef<THREE.Mesh | null>(null);

  // Make modules ref available globally for ExportSidebar
  useEffect(() => {
    window.modules = modules;
    
    return () => {
      delete window.modules;
    };
  }, []);

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

    // Add directional light with shadows
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Enable shadow settings in renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ 
        color: '#e2dfd6',
        roughness: 0.8, 
        metalness: 0.2
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(10, 20, '#cccccc', '#cccccc');
    grid.visible = wireframeMode;
    scene.add(grid);

    // Create our own orbit controls without using the imported OrbitControls
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };
    let cameraTarget = new THREE.Vector3(0, 0.5, 0);
    let cameraDistance = camera.position.distanceTo(cameraTarget);
    
    // Initialize camera position
    camera.position.set(
      cameraTarget.x + cameraDistance * Math.sin(0) * Math.cos(0),
      cameraTarget.y + cameraDistance * Math.sin(Math.PI/4),
      cameraTarget.z + cameraDistance * Math.cos(0) * Math.cos(0)
    );
    camera.lookAt(cameraTarget);
    
    // Handle orbit controls manually
    container.addEventListener('mousedown', (event) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    });
    
    container.addEventListener('mousemove', (event) => {
      if (!isDragging) return;
      
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };
      
      // Convert to radians for rotation
      const deltaRotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
          deltaMove.y * 0.01,
          deltaMove.x * 0.01,
          0,
          'XYZ'
        ));
      
      // Apply rotation to camera position
      const position = new THREE.Vector3().subVectors(camera.position, cameraTarget);
      position.applyQuaternion(deltaRotationQuaternion);
      camera.position.copy(position.add(cameraTarget));
      camera.lookAt(cameraTarget);
      
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    });
    
    container.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    // Mouse wheel zoom
    container.addEventListener('wheel', (event) => {
      event.preventDefault();
      
      const zoomAmount = event.deltaY * 0.001;
      cameraDistance = Math.max(1, Math.min(10, cameraDistance + zoomAmount));
      
      const direction = new THREE.Vector3().subVectors(camera.position, cameraTarget).normalize();
      camera.position.copy(cameraTarget).addScaledVector(direction, cameraDistance);
    });
    
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
      ctx.font = '24px "Playfair Display", serif';
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
        const data = modules.current.map((mesh) => {
          const material = mesh.material as THREE.MeshStandardMaterial;
          return {
            pos: {
              x: mesh.position.x,
              y: mesh.position.y,
              z: mesh.position.z
            },
            scale: {
              x: mesh.scale.x,
              y: mesh.scale.y,
              z: mesh.scale.z
            },
            color: material.color.getHexString(),
            userData: mesh.userData || {}
          };
        });
        
        await setDoc(doc(db, 'scenes', userId), { data });
        toast.success('Scene saved successfully');
      } catch (error) {
        console.error("Error saving scene:", error);
        toast.error('Error saving scene');
      }
    }

    async function loadScene() {
      try {
        const snapshot = await getDoc(doc(db, 'scenes', userId));
        if (!snapshot.exists()) return;
        
        // Clear existing modules
        modules.current.forEach(mesh => scene.remove(mesh));
        modules.current = [];
        
        snapshot.data().data.forEach(({ pos, scale, color, userData }: any) => {
          const geo = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
          const mat = new THREE.MeshStandardMaterial({ 
            color: '#' + color, 
            wireframe: wireframeMode,
            roughness: 0.7,
            metalness: 0.2
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData = userData || {};
          scene.add(mesh);
          modules.current.push(mesh);
          if (wireframeMode) addCote(mesh);
        });
        
        toast.success('Scene loaded successfully');
      } catch (error) {
        console.error("Error loading scene:", error);
        toast.error('Error loading scene');
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
      const { type, width, height, depth, color, x = 0, z = 0, userData = {} } = e.data;
      if (type === 'addModule') {
        const geo = new THREE.BoxGeometry(width, height, depth);
        const mat = new THREE.MeshStandardMaterial({ 
          color: color || '#C1A57B', 
          wireframe: wireframeMode,
          roughness: 0.7,
          metalness: 0.2
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, height / 2, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = userData;
        scene.add(mesh);
        modules.current.push(mesh);
        if (wireframeMode) addCote(mesh);
        
        // Notify that module was added
        toast.info('Module added to scene');
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
      renderer.render(scene, camera);
    };
    animate();

    // Load existing scene data
    loadScene();

    // Set up methods that need to be called from outside this effect
    window.saveScene = saveScene;
    window.toggleWireframeMode = () => {
      const newMode = !wireframeMode;
      setWireframeMode(newMode);
      
      // Update grid visibility
      grid.visible = newMode;
      
      modules.current.forEach((mesh) => {
        if (mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).wireframe = newMode;
          
          // Add or remove cotes when toggling modes
          if (newMode) {
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

  const handleSave = () => {
    if (window.saveScene) {
      window.saveScene();
    }
  };

  return (
    <div className={`flex w-full ${className}`}>
      <div className="w-full h-[80vh] relative" ref={mountRef}>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            className="bg-amber-600 text-white px-4 py-2 rounded shadow hover:bg-amber-700 transition"
            onClick={toggleMode}
          >
            {wireframeMode ? 'Realistic Mode' : 'Wireframe Mode'}
          </button>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-green-800 transition"
            onClick={handleSave}
          >
            💾 Save Scene
          </button>
        </div>

        {showEditor && (
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded shadow border min-w-[250px]">
            <h2 className="font-bold mb-2 font-playfair text-[#6A4B31]">Edit Module</h2>
            <label className="block text-sm mb-1">Width (m)</label>
            <input 
              type="number" 
              step="0.1"
              className="w-full mb-2 border px-2 py-1 rounded" 
              onChange={(e) => handleEdit('width', e.target.value)} 
              defaultValue={selectedModule.current?.scale.x || 0}
            />
            <label className="block text-sm mb-1">Height (m)</label>
            <input 
              type="number"
              step="0.1" 
              className="w-full mb-2 border px-2 py-1 rounded" 
              onChange={(e) => handleEdit('height', e.target.value)} 
              defaultValue={selectedModule.current?.scale.y || 0}
            />
            <label className="block text-sm mb-1">Depth (m)</label>
            <input 
              type="number"
              step="0.1" 
              className="w-full mb-2 border px-2 py-1 rounded" 
              onChange={(e) => handleEdit('depth', e.target.value)} 
              defaultValue={selectedModule.current?.scale.z || 0}
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
