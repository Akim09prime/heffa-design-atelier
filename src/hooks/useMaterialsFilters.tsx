
import { useState, useEffect, useMemo } from 'react';
import { Material, MaterialType } from '@/types';

interface MaterialsFiltersResult {
  searchQuery: string;
  categoryFilter: MaterialType | string;
  manufacturerFilter: string | null;
  thicknessFilter: number | null;
  priceRangeFilter: [number, number];
  showOnlyFavorites: boolean;
  availabilityFilter: boolean | null;
  manufacturers: string[];
  thicknesses: number[];
  minPrice: number;
  maxPrice: number;
  filteredMaterials: Material[];
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: MaterialType | string) => void;
  setManufacturerFilter: (manufacturer: string | null) => void;
  setThicknessFilter: (thickness: number | null) => void;
  setPriceRangeFilter: (range: [number, number]) => void;
  setShowOnlyFavorites: (show: boolean) => void;
  setAvailabilityFilter: (available: boolean | null) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export const useMaterialsFilters = (materials: Material[]): MaterialsFiltersResult => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MaterialType | string>('PAL');
  const [manufacturerFilter, setManufacturerFilter] = useState<string | null>(null);
  const [thicknessFilter, setThicknessFilter] = useState<number | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Calculate min and max price from all materials
  const { minPrice, maxPrice } = useMemo(() => {
    if (!materials.length) return { minPrice: 0, maxPrice: 100 };
    
    let min = Math.min(...materials.map(m => m.pricePerSqm));
    let max = Math.max(...materials.map(m => m.pricePerSqm));
    
    // Add some buffer to the max price for UI slider
    min = Math.floor(min);
    max = Math.ceil(max) + 5;
    
    return { minPrice: min, maxPrice: max };
  }, [materials]);
  
  const [priceRangeFilter, setPriceRangeFilter] = useState<[number, number]>([minPrice, maxPrice]);
  
  // Reset price range when min/max changes
  useEffect(() => {
    setPriceRangeFilter([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);
  
  // Extract unique manufacturers and thicknesses
  const manufacturers = useMemo(() => {
    return [...new Set(materials.map(m => m.manufacturer))].sort();
  }, [materials]);
  
  const thicknesses = useMemo(() => {
    return [...new Set(materials.map(m => m.thickness))].sort((a, b) => a - b);
  }, [materials]);
  
  // Filter materials based on all criteria
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      // Category filter
      const matchesCategory = material.type === categoryFilter;
      if (!matchesCategory) return false;
      
      // Search query
      const matchesSearch = 
        searchQuery === '' || 
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        material.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      
      // Manufacturer filter
      const matchesManufacturer = !manufacturerFilter || material.manufacturer === manufacturerFilter;
      if (!matchesManufacturer) return false;
      
      // Thickness filter
      const matchesThickness = !thicknessFilter || material.thickness === thicknessFilter;
      if (!matchesThickness) return false;
      
      // Price range filter
      const matchesPrice = 
        material.pricePerSqm >= priceRangeFilter[0] && 
        material.pricePerSqm <= priceRangeFilter[1];
      if (!matchesPrice) return false;
      
      // Favorites filter
      const matchesFavorites = !showOnlyFavorites || material.isFavorite;
      if (!matchesFavorites) return false;
      
      // Availability filter
      const matchesAvailability = availabilityFilter === null || material.availability === availabilityFilter;
      if (!matchesAvailability) return false;
      
      return true;
    });
  }, [
    materials, 
    searchQuery, 
    categoryFilter, 
    manufacturerFilter, 
    thicknessFilter, 
    priceRangeFilter, 
    showOnlyFavorites, 
    availabilityFilter
  ]);
  
  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || 
      manufacturerFilter !== null || 
      thicknessFilter !== null || 
      priceRangeFilter[0] > minPrice || 
      priceRangeFilter[1] < maxPrice || 
      showOnlyFavorites || 
      availabilityFilter !== null;
  }, [
    searchQuery, 
    manufacturerFilter, 
    thicknessFilter, 
    priceRangeFilter, 
    minPrice, 
    maxPrice, 
    showOnlyFavorites, 
    availabilityFilter
  ]);
  
  // Function to clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setManufacturerFilter(null);
    setThicknessFilter(null);
    setPriceRangeFilter([minPrice, maxPrice]);
    setShowOnlyFavorites(false);
    setAvailabilityFilter(null);
  };
  
  return {
    searchQuery,
    categoryFilter,
    manufacturerFilter,
    thicknessFilter,
    priceRangeFilter,
    showOnlyFavorites,
    availabilityFilter,
    manufacturers,
    thicknesses,
    minPrice,
    maxPrice,
    filteredMaterials,
    setSearchQuery,
    setCategoryFilter,
    setManufacturerFilter,
    setThicknessFilter,
    setPriceRangeFilter,
    setShowOnlyFavorites,
    setAvailabilityFilter,
    clearFilters,
    hasActiveFilters
  };
};
