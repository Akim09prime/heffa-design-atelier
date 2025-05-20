
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type BodySummaryStepProps = {
  bodyData: any;
};

// Mock materials for display
const materials = [
  { id: 'mat-1', name: 'Pal Alb W980', thickness: 18 },
  { id: 'mat-2', name: 'PFL Alb', thickness: 5 },
  { id: 'mat-3', name: 'MDF Lucios Alb', thickness: 18 },
  { id: 'mat-4', name: 'MDF Lucios Negru', thickness: 18 },
  { id: 'mat-5', name: 'Pal Stejar Natur', thickness: 18 },
];

// Part types
const partTypes = [
  { value: 'LatSt', label: 'Laterala Stanga' },
  { value: 'LatDr', label: 'Laterala Dreapta' },
  { value: 'Inf', label: 'Blat Inferior' },
  { value: 'Sup', label: 'Blat Superior' },
  { value: 'Fund', label: 'Panou Spate' },
  { value: 'Front', label: 'Front/Usa' },
  { value: 'Raft', label: 'Raft' },
  { value: 'Sertar', label: 'Sertar' },
];

const accessoryCategories = [
  { value: 'hinge', label: 'Balamale' },
  { value: 'slide', label: 'Glisiere' },
  { value: 'handle', label: 'Mânere' },
  { value: 'foot', label: 'Picioare' },
  { value: 'push', label: 'Sistem push' },
  { value: 'damper', label: 'Amortizoare' },
  { value: 'other', label: 'Alte accesorii' },
];

// Calculate square meters of material needed
const calculateMaterialArea = (width: number, height: number, depth: number) => {
  // Simple calculation: 2 sides + top + bottom + back
  const sides = 2 * (height * depth / 1000000); // 2 sides in m²
  const topBottom = 2 * (width * depth / 1000000); // top and bottom in m²
  const back = (width * height / 1000000); // back panel in m²
  const front = (width * height / 1000000); // front/door in m²
  
  return {
    sides,
    topBottom,
    back,
    front,
    total: sides + topBottom + back + front
  };
};

// Calculate edgeband meters needed
const calculateEdgebandLength = (width: number, height: number) => {
  return ((2 * height) + (2 * width)) / 1000; // Convert to meters
};

// Price calculations
const calculateMaterialPrice = (materialId: string, area: number) => {
  // Mock price per square meter
  const pricePerSqm = {
    'mat-1': 90, // Pal Alb
    'mat-2': 40, // PFL
    'mat-3': 180, // MDF Lucios Alb
    'mat-4': 180, // MDF Lucios Negru
    'mat-5': 120, // Pal Stejar
  };
  
  return area * (pricePerSqm as any)[materialId] || 0;
};

// Calculate edgeband price
const calculateEdgebandPrice = (meters: number) => {
  const pricePerMeter = 8; // RON per meter
  return meters * pricePerMeter;
};

export const BodySummaryStep: React.FC<BodySummaryStepProps> = ({ bodyData }) => {
  const material = materials.find(m => m.id === bodyData.materialId);
  const materialName = material ? material.name : bodyData.materialId;
  
  const materialAreas = calculateMaterialArea(bodyData.width, bodyData.height, bodyData.depth);
  const edgebandLength = calculateEdgebandLength(bodyData.width, bodyData.height);
  
  // Calculate material costs
  const materialCost = calculateMaterialPrice(bodyData.materialId, materialAreas.total);
  const edgebandCost = calculateEdgebandPrice(edgebandLength);
  
  // Calculate accessories total cost
  const accessoriesCost = bodyData.customAccessories?.reduce((sum: number, acc: any) => 
    sum + (acc.quantity * acc.pricePerUnit), 0) || 0;
  
  // Estimate labor cost (simple calculation for example)
  const laborCost = 200 + (bodyData.width * bodyData.height * bodyData.depth / 1000000) * 100;
  
  // Total cost
  const totalCost = materialCost + edgebandCost + accessoriesCost + laborCost;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium">Informații generale</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nume</p>
              <p className="font-medium">{bodyData.name || 'Corp nou'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Material principal</p>
              <p className="font-medium">{materialName}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Dimensiuni (L×Î×A)</p>
              <p className="font-medium">{bodyData.width} × {bodyData.height} × {bodyData.depth} mm</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Volum</p>
              <p className="font-medium">{(bodyData.width * bodyData.height * bodyData.depth / 1000000000).toFixed(3)} m³</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium">Configurație</h4>
            <ul className="mt-2 space-y-1 text-sm">
              {bodyData.includeShelf && (
                <li>• Include raft intermediar</li>
              )}
              {bodyData.includeDrawer && (
                <li>• Include sertar</li>
              )}
              <li>• Front standard</li>
              <li>• Spate din PFL {material?.thickness || 5}mm</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {bodyData.customParts?.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Componente personalizate</h3>
            <ul className="space-y-2">
              {bodyData.customParts.map((part: any, index: number) => {
                const partType = partTypes.find(t => t.value === part.type);
                const partMaterial = materials.find(m => m.id === part.materialId);
                return (
                  <li key={index} className="flex justify-between">
                    <span>{partType?.label || part.type}, {partMaterial?.name || part.materialId}</span>
                    <span>{part.thickness}mm</span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {bodyData.customAccessories?.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Accesorii</h3>
            <ul className="space-y-2">
              {bodyData.customAccessories.map((acc: any, index: number) => {
                const category = accessoryCategories.find(c => c.value === acc.category);
                return (
                  <li key={index} className="flex justify-between">
                    <span>
                      {category?.label || acc.category} {acc.brand} {acc.system}, {acc.sizeMm}mm
                    </span>
                    <span>
                      {acc.quantity} buc × {acc.pricePerUnit} RON = {(acc.quantity * acc.pricePerUnit).toFixed(2)} RON
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Estimare cost</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Material ({(materialAreas.total).toFixed(2)} m²)</span>
              <span>{materialCost.toFixed(2)} RON</span>
            </div>
            
            <div className="flex justify-between">
              <span>Cant ({edgebandLength.toFixed(2)} m)</span>
              <span>{edgebandCost.toFixed(2)} RON</span>
            </div>
            
            <div className="flex justify-between">
              <span>Accesorii</span>
              <span>{accessoriesCost.toFixed(2)} RON</span>
            </div>
            
            <div className="flex justify-between">
              <span>Manoperă</span>
              <span>{laborCost.toFixed(2)} RON</span>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-bold">
              <span>TOTAL</span>
              <span>{totalCost.toFixed(2)} RON</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
