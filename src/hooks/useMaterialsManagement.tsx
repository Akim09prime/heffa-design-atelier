
import { useState, useEffect, useCallback } from 'react';
import { Material, MaterialType } from '@/types';
import { MaterialService } from '@/services/materialService';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';

export const useMaterialsManagement = (initialType: MaterialType = 'PAL') => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [materialType, setMaterialType] = useState<MaterialType>(initialType);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  
  // Filter options
  const [filterAvailability, setFilterAvailability] = useState<boolean | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Load materials based on type
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const fetchedMaterials = await MaterialService.getMaterialsByType(materialType);
        setMaterials(fetchedMaterials);
        applyFilters(fetchedMaterials, searchQuery, filterAvailability, showOnlyFavorites);
      } catch (error) {
        console.error('Error fetching materials:', error);
        toast({
          title: t('common.error'),
          description: t('materials.failedToLoad'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterials();
  }, [materialType, toast, t]);

  // Apply filters to materials
  const applyFilters = useCallback((
    materialsToFilter: Material[],
    query: string,
    availability: boolean | null,
    favorites: boolean
  ) => {
    let filtered = materialsToFilter;
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(material => 
        material.name.toLowerCase().includes(query.toLowerCase()) ||
        material.code.toLowerCase().includes(query.toLowerCase()) ||
        material.manufacturer.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply availability filter
    if (availability !== null) {
      filtered = filtered.filter(material => material.availability === availability);
    }
    
    // Apply favorites filter
    if (favorites) {
      filtered = filtered.filter(material => material.isFavorite === true);
    }
    
    setFilteredMaterials(filtered);
  }, []);

  // Update filters when any filter option changes
  useEffect(() => {
    applyFilters(materials, searchQuery, filterAvailability, showOnlyFavorites);
  }, [materials, searchQuery, filterAvailability, showOnlyFavorites, applyFilters]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setMaterialType(value.toUpperCase() as MaterialType);
  };

  // Toggle favorites filter
  const handleToggleFavoritesFilter = () => {
    setShowOnlyFavorites(prev => !prev);
  };

  // Set availability filter
  const handleFilterAvailability = (value: boolean | null) => {
    setFilterAvailability(value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterAvailability(null);
    setShowOnlyFavorites(false);
  };

  // Add material
  const handleAddMaterial = async (formData: Partial<Material>) => {
    setIsLoading(true);
    try {
      const newMaterial = {
        ...formData,
        compatibleOperations: formData.compatibleOperations || [],
        type: materialType
      } as Omit<Material, 'id'>;
      
      const addedMaterial = await MaterialService.addMaterial(newMaterial);
      setMaterials(prev => [...prev, addedMaterial]);
      
      toast({
        title: t('materials.materialAdded'),
        description: `${formData.name} ${t('materials.hasBeenAdded')}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        title: t('common.error'),
        description: t('materials.failedToAdd'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update material
  const handleUpdateMaterial = async (material: Material, formData: Partial<Material>) => {
    setIsLoading(true);
    try {
      const updatedMaterial = await MaterialService.updateMaterial(material.id, {
        ...formData,
        type: material.type,
        isFavorite: material.isFavorite
      });
      
      setMaterials(prev => 
        prev.map(m => m.id === material.id ? updatedMaterial : m)
      );
      
      if (selectedMaterial?.id === material.id) {
        setSelectedMaterial(updatedMaterial);
      }
      
      toast({
        title: t('materials.materialUpdated'),
        description: `${formData.name} ${t('materials.hasBeenUpdated')}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating material:', error);
      toast({
        title: t('common.error'),
        description: t('materials.failedToUpdate'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete material
  const handleDeleteMaterial = async (material: Material) => {
    setIsLoading(true);
    try {
      await MaterialService.deleteMaterial(material.id);
      setMaterials(prev => prev.filter(m => m.id !== material.id));
      
      if (selectedMaterial?.id === material.id) {
        setSelectedMaterial(null);
      }
      
      toast({
        title: t('materials.materialDeleted'),
        description: `${material.name} ${t('materials.hasBeenDeleted')}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: t('common.error'),
        description: t('materials.failedToDelete'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (material: Material) => {
    try {
      const updatedMaterial = await MaterialService.toggleFavorite(material.id);
      
      setMaterials(prev => 
        prev.map(m => m.id === material.id ? updatedMaterial : m)
      );
      
      if (selectedMaterial?.id === material.id) {
        setSelectedMaterial(updatedMaterial);
      }
      
      const toastMessage = updatedMaterial.isFavorite ? 
        t('materials.addedToFavorites') : 
        t('materials.removedFromFavorites');
      
      toast({
        title: toastMessage,
        description: material.name,
      });
      
      return updatedMaterial;
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      toast({
        title: t('common.error'),
        description: t('materials.failedToUpdate'),
        variant: 'destructive',
      });
      return material;
    }
  };

  return {
    materialType,
    materials,
    filteredMaterials,
    searchQuery,
    isLoading,
    selectedMaterial,
    filterAvailability,
    showOnlyFavorites,
    setSelectedMaterial,
    setSearchQuery,
    handleTabChange,
    handleToggleFavoritesFilter,
    handleFilterAvailability,
    handleClearFilters,
    handleAddMaterial,
    handleUpdateMaterial,
    handleDeleteMaterial,
    handleToggleFavorite,
    hasActiveFilters: searchQuery !== '' || filterAvailability !== null || showOnlyFavorites
  };
};
