
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '@/contexts/TranslationContext';
import { MaterialType } from '@/types';

interface MaterialCategoryTabsProps {
  currentCategory: MaterialType | string;
  onCategoryChange: (category: string) => void;
}

export const MaterialCategoryTabs: React.FC<MaterialCategoryTabsProps> = ({
  currentCategory,
  onCategoryChange
}) => {
  const { t } = useTranslation();

  return (
    <Tabs 
      value={currentCategory} 
      onValueChange={onCategoryChange}
      className="w-full"
    >
      <TabsList className="mb-6 bg-gray-800 border-b border-gray-700">
        <TabsTrigger value="PAL">PAL</TabsTrigger>
        <TabsTrigger value="MDF">MDF</TabsTrigger>
        <TabsTrigger value="MDF-AGT">MDF-AGT</TabsTrigger>
        <TabsTrigger value="PFL">PFL</TabsTrigger>
        <TabsTrigger value="GLASS">{t('materials.glass')}</TabsTrigger>
        <TabsTrigger value="COUNTERTOP">{t('materials.countertops')}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
