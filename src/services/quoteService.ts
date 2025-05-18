
import { FurnitureModule, Material, AccessoryItem, Project } from '@/types';
import { PricingService } from './pricingService';

export interface QuoteBreakdown {
  materialsCost: number;
  accessoriesCost: number;
  processingCost: number;
  laborCost: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalPrice: number;
}

export interface QuoteDetails {
  id: string;
  projectId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  createdAt: Date;
  validUntil: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  breakdown: QuoteBreakdown;
  notes?: string;
}

export const QuoteService = {
  // Calculate the complete quote breakdown for a project
  calculateQuoteBreakdown: (
    project: Project,
    materials: Material[],
    accessories: AccessoryItem[],
    discountPercentage: number = 0
  ): QuoteBreakdown => {
    // Initialize cost categories
    let materialsCost = 0;
    let accessoriesCost = 0;
    let processingCost = 0;
    let laborCost = 0;
    
    // Calculate costs for each module
    project.modules.forEach(module => {
      const modulePrice = PricingService.calculateModulePrice(module, materials, accessories);
      materialsCost += modulePrice.breakdown.materials;
      accessoriesCost += modulePrice.breakdown.accessories;
      processingCost += modulePrice.breakdown.processing;
      laborCost += modulePrice.breakdown.labor;
    });
    
    // Calculate subtotal before tax and discount
    const subtotal = materialsCost + accessoriesCost + processingCost + laborCost;
    
    // Apply discount
    const discount = (subtotal * discountPercentage) / 100;
    
    // Apply tax (standard 19% VAT for Romania)
    const taxRate = 19;
    const taxAmount = ((subtotal - discount) * taxRate) / 100;
    
    // Calculate final price
    const totalPrice = subtotal - discount + taxAmount;
    
    return {
      materialsCost,
      accessoriesCost,
      processingCost,
      laborCost,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      totalPrice
    };
  },
  
  // Generate a new quote for a project
  generateQuote: (
    project: Project,
    materials: Material[],
    accessories: AccessoryItem[],
    clientDetails: { name: string; email?: string; phone?: string },
    discountPercentage: number = 0,
    notes?: string
  ): QuoteDetails => {
    // Calculate the quote breakdown
    const breakdown = QuoteService.calculateQuoteBreakdown(
      project,
      materials,
      accessories,
      discountPercentage
    );
    
    // Create valid until date (30 days from now)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    
    // Generate a unique ID
    const quoteId = `Q-${project.id.substring(0, 4)}-${Date.now().toString().substring(9)}`;
    
    // Return the complete quote details
    return {
      id: quoteId,
      projectId: project.id,
      clientName: clientDetails.name,
      clientEmail: clientDetails.email,
      clientPhone: clientDetails.phone,
      createdAt: new Date(),
      validUntil,
      status: 'draft',
      breakdown,
      notes
    };
  },
  
  // Format currency for display
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount);
  }
};
