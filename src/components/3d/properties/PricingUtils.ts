
import { FurnitureModule, Material, AccessoryItem } from '@/types';

export const calculatePrice = (
  moduleToPrice: FurnitureModule, 
  materials: Material[], 
  accessories: AccessoryItem[]
): FurnitureModule => {
  const calculatedModule = { ...moduleToPrice };
  
  // Calculate materials cost
  const materialsCost = calculatedModule.materials.reduce((total, mat) => {
    const materialData = materials.find(m => m.id === mat.materialId);
    if (materialData) {
      // A simple calculation based on dimensions, would be more complex in real app
      const area = (calculatedModule.width * calculatedModule.height) / 1000000; // Convert to m²
      return total + (materialData.pricePerSqm * mat.quantity * area);
    }
    return total;
  }, 0);
  
  // Calculate accessories cost
  const accessoriesCost = calculatedModule.accessories.reduce((total, acc) => {
    const accessoryData = accessories.find(a => a.id === acc.accessoryItemId);
    if (accessoryData) {
      return total + (accessoryData.price * acc.quantity);
    }
    return total;
  }, 0);
  
  // Add processing costs (would have more complex logic in a real app)
  const processingCost = calculatedModule.processingOptions.length * 50;
  
  // Set the calculated price
  calculatedModule.price = materialsCost + accessoriesCost + processingCost;
  
  return calculatedModule;
};
