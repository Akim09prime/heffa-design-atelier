
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'ro';

// Translation content types
interface TranslationEntry {
  [language: string]: string;
}

export interface Translations {
  [key: string]: {
    [key: string]: TranslationEntry;
  };
}

// Create initial translation context
interface TranslationContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Define translations for all pages
const translations: Translations = {
  common: {
    // Navigation
    dashboard: {
      en: 'Dashboard',
      ro: 'Panou principal'
    },
    materials: {
      en: 'Materials',
      ro: 'Materiale'
    },
    accessories: {
      en: 'Accessories',
      ro: 'Accesorii'
    },
    processing: {
      en: 'Processing Rules',
      ro: 'Reguli de procesare'
    },
    users: {
      en: 'Users',
      ro: 'Utilizatori'
    },
    reports: {
      en: 'Reports',
      ro: 'Rapoarte'
    },
    importData: {
      en: 'Import Data',
      ro: 'Import date'
    },
    analytics: {
      en: 'Analytics',
      ro: 'Analize'
    },
    settings: {
      en: 'Settings',
      ro: 'Setări'
    },
    
    // Actions
    save: {
      en: 'Save',
      ro: 'Salvează'
    },
    cancel: {
      en: 'Cancel',
      ro: 'Anulează'
    },
    add: {
      en: 'Add',
      ro: 'Adaugă'
    },
    edit: {
      en: 'Edit',
      ro: 'Editează'
    },
    delete: {
      en: 'Delete',
      ro: 'Șterge'
    },
    search: {
      en: 'Search',
      ro: 'Caută'
    },
    import: {
      en: 'Import',
      ro: 'Importă'
    },
    export: {
      en: 'Export',
      ro: 'Exportă'
    },
    generate: {
      en: 'Generate',
      ro: 'Generează'
    },
    view: {
      en: 'View',
      ro: 'Vizualizează'
    },
    download: {
      en: 'Download',
      ro: 'Descarcă'
    },
    upload: {
      en: 'Upload',
      ro: 'Încarcă'
    },

    // Status
    success: {
      en: 'Success',
      ro: 'Succes'
    },
    error: {
      en: 'Error',
      ro: 'Eroare'
    },
    pending: {
      en: 'Pending',
      ro: 'În așteptare'
    },
    completed: {
      en: 'Completed',
      ro: 'Finalizat'
    },
    inStock: {
      en: 'In Stock',
      ro: 'În stoc'
    },
    lowStock: {
      en: 'Low Stock',
      ro: 'Stoc limitat'
    },
  },
  
  // Accessories page
  accessories: {
    title: {
      en: 'Accessories Catalog',
      ro: 'Catalog de accesorii'
    },
    description: {
      en: 'Browse and select accessories for your furniture projects',
      ro: 'Răsfoiește și selectează accesorii pentru proiectele tale de mobilier'
    },
    searchPlaceholder: {
      en: 'Search accessories...',
      ro: 'Caută accesorii...'
    },
    allManufacturers: {
      en: 'All Manufacturers',
      ro: 'Toți producătorii'
    },
    hinges: {
      en: 'Hinges',
      ro: 'Balamale'
    },
    hingesDesc: {
      en: 'Cabinet and door hinges from Blum, Hafele and GTV',
      ro: 'Balamale pentru dulapuri și uși de la Blum, Hafele și GTV'
    },
    slides: {
      en: 'Slides',
      ro: 'Glisiere'
    },
    slidesDesc: {
      en: 'Drawer slides and systems from premium manufacturers',
      ro: 'Glisiere și sisteme pentru sertare de la producători premium'
    },
    handles: {
      en: 'Handles',
      ro: 'Mânere'
    },
    handlesDesc: {
      en: 'Cabinet and drawer handles in various styles',
      ro: 'Mânere pentru dulapuri și sertare în diferite stiluri'
    },
    feet: {
      en: 'Feet',
      ro: 'Picioare'
    },
    feetDesc: {
      en: 'Adjustable cabinet feet and supports',
      ro: 'Picioare ajustabile pentru mobilier și suporturi'
    },
    profiles: {
      en: 'Profiles',
      ro: 'Profile'
    },
    profilesDesc: {
      en: 'Aluminum profiles for glass doors and panels',
      ro: 'Profile de aluminiu pentru uși și panouri din sticlă'
    },
    pushSystems: {
      en: 'Push Systems',
      ro: 'Sisteme Push'
    },
    pushSystemsDesc: {
      en: 'Push-to-open systems for handleless designs',
      ro: 'Sisteme push-to-open pentru designuri fără mânere'
    },
    shelfSupports: {
      en: 'Shelf Supports',
      ro: 'Suporturi rafturi'
    },
    shelfSupportsDesc: {
      en: 'Shelf pins and support systems',
      ro: 'Suporți și sisteme de susținere pentru rafturi'
    },
    other: {
      en: 'Other',
      ro: 'Altele'
    },
    otherDesc: {
      en: 'Other cabinet accessories and hardware',
      ro: 'Alte accesorii și feronerie pentru mobilier'
    },
    addToProject: {
      en: 'Add to Project',
      ro: 'Adaugă la proiect'
    },
    downloadSpec: {
      en: 'Download Specification',
      ro: 'Descarcă specificația'
    },
    compatibleWith: {
      en: 'Compatible With',
      ro: 'Compatibil cu'
    },
    properties: {
      en: 'Properties',
      ro: 'Proprietăți'
    },
    noAccessoriesFound: {
      en: 'No accessories found matching your criteria',
      ro: 'Nu s-au găsit accesorii care să corespundă criteriilor tale'
    },
    loading: {
      en: 'Loading accessories...',
      ro: 'Se încarcă accesoriile...'
    },
    accessoryAdded: {
      en: 'Accessory Added',
      ro: 'Accesoriu adăugat'
    },
    hasBeenAddedToProject: {
      en: 'has been added to your project.',
      ro: 'a fost adăugat la proiectul tău.'
    },
    exportStarted: {
      en: 'Export Started',
      ro: 'Export început'
    },
    exportingAccessories: {
      en: 'Exporting accessories catalog to Excel...',
      ro: 'Se exportă catalogul de accesorii în Excel...'
    },
    exportComplete: {
      en: 'Export Complete',
      ro: 'Export finalizat'
    },
    accessoriesExported: {
      en: 'Accessories catalog has been exported successfully.',
      ro: 'Catalogul de accesorii a fost exportat cu succes.'
    },
  },
  
  // Settings page
  settings: {
    title: {
      en: 'System Settings',
      ro: 'Setări sistem'
    },
    description: {
      en: 'Configure application settings and preferences',
      ro: 'Configurează setările și preferințele aplicației'
    },
    saveChanges: {
      en: 'Save Changes',
      ro: 'Salvează modificările'
    },
    changeLanguage: {
      en: 'Change Language',
      ro: 'Schimbă limba'
    },
    settingsSaved: {
      en: 'Settings Saved',
      ro: 'Setările au fost salvate'
    },
    changesSavedSuccess: {
      en: 'Your changes have been saved successfully.',
      ro: 'Modificările tale au fost salvate cu succes.'
    },
    languageChanged: {
      en: 'Language Changed',
      ro: 'Limba a fost schimbată'
    },
    languageSetTo: {
      en: 'Language set to English',
      ro: 'Limba a fost setată la Română'
    },
    general: {
      en: 'General Settings',
      ro: 'Setări generale'
    },
    generalDesc: {
      en: 'Basic system configuration',
      ro: 'Configurație de bază a sistemului'
    },
    pricing: {
      en: 'Pricing Settings',
      ro: 'Setări de preț'
    },
    pricingDesc: {
      en: 'Configure pricing rules and calculations',
      ro: 'Configurează regulile și calculele de preț'
    },
    appearance: {
      en: 'Appearance',
      ro: 'Aspect'
    },
    appearanceDesc: {
      en: 'Configure the appearance and branding of the application',
      ro: 'Configurează aspectul și branding-ul aplicației'
    },
    notifications: {
      en: 'Notifications',
      ro: 'Notificări'
    },
    notificationsDesc: {
      en: 'Configure system notifications and alerts',
      ro: 'Configurează notificările de sistem și alertele'
    },
    backups: {
      en: 'Backups & Restore',
      ro: 'Backup & Restaurare'
    },
    backupsDesc: {
      en: 'Backup your system data and restore from previous backups',
      ro: 'Fă backup la datele sistemului și restaurează din backup-uri anterioare'
    },
    languages: {
      en: 'Languages',
      ro: 'Limbi'
    },
    languagesDesc: {
      en: 'Configure language settings and translations',
      ro: 'Configurează setările de limbă și traducerile'
    },
    // More settings translations...
  },

  // Users page
  users: {
    title: {
      en: 'User Management',
      ro: 'Gestionare utilizatori'
    },
    description: {
      en: 'Manage system users and their permissions',
      ro: 'Gestionează utilizatorii sistemului și permisiunile lor'
    },
    searchPlaceholder: {
      en: 'Search users...',
      ro: 'Caută utilizatori...'
    },
    addUser: {
      en: 'Add User',
      ro: 'Adaugă utilizator'
    },
    filterByRole: {
      en: 'Filter by role',
      ro: 'Filtrează după rol'
    },
    allUsers: {
      en: 'All Users',
      ro: 'Toți utilizatorii'
    },
    admins: {
      en: 'Admins',
      ro: 'Administratori'
    },
    designers: {
      en: 'Designers',
      ro: 'Designeri'
    },
    clients: {
      en: 'Clients',
      ro: 'Clienți'
    },
    systemUsers: {
      en: 'System Users',
      ro: 'Utilizatori sistem'
    },
    systemUsersDesc: {
      en: 'Manage users and their permissions in the application',
      ro: 'Gestionează utilizatorii și permisiunile lor în aplicație'
    },
    noUsersFound: {
      en: 'No users found matching your criteria',
      ro: 'Nu s-au găsit utilizatori care să corespundă criteriilor tale'
    },
    userDeleted: {
      en: 'User Deleted',
      ro: 'Utilizator șters'
    },
    userDeletedSuccess: {
      en: 'The user has been successfully removed.',
      ro: 'Utilizatorul a fost eliminat cu succes.'
    },
    userUpdated: {
      en: 'User Updated',
      ro: 'Utilizator actualizat'
    },
    userInfoUpdated: {
      en: 'information has been updated.',
      ro: 'informațiile au fost actualizate.'
    },
    userAdded: {
      en: 'User Added',
      ro: 'Utilizator adăugat'
    },
    userAddedSuccess: {
      en: 'has been added successfully.',
      ro: 'a fost adăugat cu succes.'
    },
    invitationSent: {
      en: 'Invitation Sent',
      ro: 'Invitație trimisă'
    },
    invitationSentTo: {
      en: 'An invitation has been sent to',
      ro: 'O invitație a fost trimisă către'
    },
    addNewUser: {
      en: 'Add New User',
      ro: 'Adaugă utilizator nou'
    },
    editUser: {
      en: 'Edit User',
      ro: 'Editează utilizator'
    },
  },

  // Reports page
  reports: {
    title: {
      en: 'Reports',
      ro: 'Rapoarte'
    },
    description: {
      en: 'Generate and manage system reports',
      ro: 'Generează și gestionează rapoartele sistemului'
    },
    searchPlaceholder: {
      en: 'Search reports...',
      ro: 'Caută rapoarte...'
    },
    generateReport: {
      en: 'Generate Report',
      ro: 'Generează raport'
    },
    reportType: {
      en: 'Report type',
      ro: 'Tip raport'
    },
    salesReports: {
      en: 'Sales Reports',
      ro: 'Rapoarte vânzări'
    },
    revenueAnalysis: {
      en: 'Revenue analysis and orders',
      ro: 'Analiză venituri și comenzi'
    },
    inventoryReports: {
      en: 'Inventory Reports',
      ro: 'Rapoarte inventar'
    },
    materialsAndAccessories: {
      en: 'Materials and accessories',
      ro: 'Materiale și accesorii'
    },
    generatedThisMonth: {
      en: 'Generated This Month',
      ro: 'Generate în această lună'
    },
    averageGenerationTime: {
      en: 'Average Generation Time',
      ro: 'Timp mediu de generare'
    },
    processingDuration: {
      en: 'Processing duration',
      ro: 'Durată procesare'
    },
    recentReports: {
      en: 'Recent Reports',
      ro: 'Rapoarte recente'
    },
    listOfReports: {
      en: 'List of recently generated reports',
      ro: 'Lista rapoartelor generate recent'
    },
    noReportsFound: {
      en: 'No reports found matching your criteria',
      ro: 'Nu s-au găsit rapoarte care să corespundă criteriilor tale'
    },
    // More report translations...
  },
  
  // Import/Export page
  importExport: {
    title: {
      en: 'Data Import/Export',
      ro: 'Import/Export date'
    },
    description: {
      en: 'Import and export data to and from the system',
      ro: 'Importă și exportă date în și din sistem'
    },
    importData: {
      en: 'Import Data',
      ro: 'Import date'
    },
    importDataDesc: {
      en: 'Upload files to import data into the system',
      ro: 'Încarcă fișiere pentru a importa date în sistem'
    },
    exportData: {
      en: 'Export Data',
      ro: 'Export date'
    },
    exportDataDesc: {
      en: 'Export system data in various formats',
      ro: 'Exportă date din sistem în diverse formate'
    },
    templates: {
      en: 'Templates',
      ro: 'Șabloane'
    },
    templatesDesc: {
      en: 'Download templates for data import',
      ro: 'Descarcă șabloane pentru import de date'
    },
    // More import/export translations...
  },
  
  // Analytics page
  analytics: {
    title: {
      en: 'Analytics Dashboard',
      ro: 'Tablou de bord analize'
    },
    description: {
      en: 'Detailed analytics and performance metrics',
      ro: 'Analize detaliate și metrici de performanță'
    },
    selectTimeRange: {
      en: 'Select time range',
      ro: 'Selectează intervalul de timp'
    },
    lastWeek: {
      en: 'Last Week',
      ro: 'Ultima săptămână'
    },
    lastMonth: {
      en: 'Last Month',
      ro: 'Ultima lună'
    },
    lastQuarter: {
      en: 'Last Quarter',
      ro: 'Ultimul trimestru'
    },
    lastYear: {
      en: 'Last Year',
      ro: 'Ultimul an'
    },
    allTime: {
      en: 'All Time',
      ro: 'Tot timpul'
    },
    totalRevenue: {
      en: 'Total Revenue',
      ro: 'Venituri totale'
    },
    fromLastYear: {
      en: 'from last year',
      ro: 'față de anul trecut'
    },
    projectsCompleted: {
      en: 'Projects Completed',
      ro: 'Proiecte finalizate'
    },
    materialsUsed: {
      en: 'Materials Used (m²)',
      ro: 'Materiale utilizate (m²)'
    },
    clientRetention: {
      en: 'Client Retention',
      ro: 'Retenție clienți'
    },
    // More analytics translations...
  }
};

// Translation provider component
interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Load saved language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ro')) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  // Save language preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // Translation function
  const t = (key: string): string => {
    const [section, translationKey] = key.includes('.') ? key.split('.') : ['common', key];
    
    if (
      translations[section] && 
      translations[section][translationKey] && 
      translations[section][translationKey][language]
    ) {
      return translations[section][translationKey][language];
    }
    
    // Fallback to English if translation not found
    if (
      translations[section] && 
      translations[section][translationKey] && 
      translations[section][translationKey]['en']
    ) {
      return translations[section][translationKey]['en'];
    }
    
    // Return key if no translation found
    console.warn(`Missing translation: ${key}`);
    return key;
  };
  
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };
  
  return (
    <TranslationContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use the translation context
export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  return context;
};
