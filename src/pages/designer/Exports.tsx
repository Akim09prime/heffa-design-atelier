
import React from 'react';
import { DesignerLayout } from '@/components/layout/DesignerLayout';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { ExportsPageContent } from './exports/ExportsPageContent';

// Main component that wraps the content in TranslationProvider
const ExportsPage = () => {
  return (
    <TranslationProvider>
      <DesignerLayout>
        <ExportsPageContent />
      </DesignerLayout>
    </TranslationProvider>
  );
};

export default ExportsPage;
