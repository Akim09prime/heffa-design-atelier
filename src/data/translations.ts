import { Translations } from '@/types/translations';

// Define translations for all pages
export const translations: Translations = {
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
    client: {
      en: 'Client',
      ro: 'Client'
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
    filter: {
      en: 'Filter',
      ro: 'Filtrează'
    },
    actions: {
      en: 'Actions',
      ro: 'Acțiuni'
    },
    preview: {
      en: 'Preview',
      ro: 'Previzualizare'
    },
    projects: {
      en: 'Projects',
      ro: 'Proiecte'
    },
    modules: {
      en: 'Modules',
      ro: 'Module'
    },
    loading: {
      en: 'Loading...',
      ro: 'Se încarcă...'
    },
    apply: {
      en: 'Apply',
      ro: 'Aplică'
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
    approved: {
      en: 'Approved',
      ro: 'Aprobat'
    },
    status: {
      en: 'Status',
      ro: 'Status'
    },
  },
  
  // Materials page
  materials: {
    title: {
      en: 'Materials Database',
      ro: 'Baza de date Materiale'
    },
    description: {
      en: 'Manage all materials in the system',
      ro: 'Gestionează toate materialele din sistem'
    },
    searchPlaceholder: {
      en: 'Search materials...',
      ro: 'Caută materiale...'
    },
    addMaterial: {
      en: 'Add Material',
      ro: 'Adaugă Material'
    },
    addNewMaterial: {
      en: 'Add New Material',
      ro: 'Adaugă Material Nou'
    },
    editMaterial: {
      en: 'Edit Material',
      ro: 'Editează Material'
    },
    materials: {
      en: 'Materials',
      ro: 'Materiale'
    },
    materialsFrom: {
      en: 'materials from Egger and other suppliers. Total:',
      ro: 'materiale de la Egger și alți furnizori. Total:'
    },
    materialsAndSupplies: {
      en: 'materials and supplies. Total:',
      ro: 'materiale și consumabile. Total:'
    },
    entries: {
      en: 'entries',
      ro: 'intrări'
    },
    loading: {
      en: 'Loading materials...',
      ro: 'Se încarcă materialele...'
    },
    noMaterialsFound: {
      en: 'No materials found. Add some materials to get started.',
      ro: 'Nu s-au găsit materiale. Adaugă materiale pentru a începe.'
    },
    materialAdded: {
      en: 'Material Added',
      ro: 'Material Adăugat'
    },
    materialUpdated: {
      en: 'Material Updated',
      ro: 'Material Actualizat'
    },
    materialDeleted: {
      en: 'Material Deleted',
      ro: 'Material Șters'
    },
    hasBeenAdded: {
      en: 'has been added successfully',
      ro: 'a fost adăugat cu succes'
    },
    hasBeenUpdated: {
      en: 'has been updated successfully',
      ro: 'a fost actualizat cu succes'
    },
    hasBeenDeleted: {
      en: 'has been deleted successfully',
      ro: 'a fost șters cu succes'
    },
    addedToProject: {
      en: 'has been added to your project',
      ro: 'a fost adăugat la proiectul tău'
    },
    failedToLoad: {
      en: 'Failed to load materials data',
      ro: 'Nu s-au putut încărca datele materialelor'
    },
    failedToAdd: {
      en: 'Failed to add material',
      ro: 'Nu s-a putut adăuga materialul'
    },
    failedToUpdate: {
      en: 'Failed to update material',
      ro: 'Nu s-a putut actualiza materialul'
    },
    failedToDelete: {
      en: 'Failed to delete material',
      ro: 'Nu s-a putut șterge materialul'
    },
    importFunctionality: {
      en: 'Material import functionality would be implemented here',
      ro: 'Funcționalitatea de import materiale ar fi implementată aici'
    },
    exportFunctionality: {
      en: 'Material export functionality would be implemented here',
      ro: 'Funcționalitatea de export materiale ar fi implementată aici'
    },
    glass: {
      en: 'Glass',
      ro: 'Sticlă'
    },
    countertops: {
      en: 'Countertops',
      ro: 'Blaturi'
    },
    paintable: {
      en: 'Paintable',
      ro: 'Vopsibil'
    },
    cantable: {
      en: 'Cantable',
      ro: 'Aplicare Cant'
    },
    outOfStock: {
      en: 'Out of Stock',
      ro: 'Indisponibil'
    },
    form: {
      code: {
        en: 'Material Code',
        ro: 'Cod Material'
      },
      name: {
        en: 'Name',
        ro: 'Nume'
      },
      type: {
        en: 'Type',
        ro: 'Tip'
      },
      selectType: {
        en: 'Select material type',
        ro: 'Selectează tipul materialului'
      },
      thickness: {
        en: 'Thickness (mm)',
        ro: 'Grosime (mm)'
      },
      manufacturer: {
        en: 'Manufacturer',
        ro: 'Producător'
      },
      supplier: {
        en: 'Supplier',
        ro: 'Furnizor'
      },
      selectSupplier: {
        en: 'Select supplier',
        ro: 'Selectează furnizorul'
      },
      pricePerSqm: {
        en: 'Price per m²',
        ro: 'Preț pe m²'
      },
      paintable: {
        en: 'Paintable',
        ro: 'Vopsibil'
      },
      paintableDesc: {
        en: 'Can this material be painted?',
        ro: 'Poate fi vopsit acest material?'
      },
      cantable: {
        en: 'Cantable',
        ro: 'Aplicare Cant'
      },
      cantableDesc: {
        en: 'Can this material have edge banding?',
        ro: 'Se poate aplica cant pe acest material?'
      },
      inStock: {
        en: 'In Stock',
        ro: 'În Stoc'
      },
      inStockDesc: {
        en: 'Is this material currently available?',
        ro: 'Este acest material disponibil în prezent?'
      },
      updateMaterial: {
        en: 'Update Material',
        ro: 'Actualizează Material'
      },
      createMaterial: {
        en: 'Create Material',
        ro: 'Creează Material'
      },
      other: {
        en: 'Other',
        ro: 'Altele'
      },
    }
  },
  
  // Settings page translations for different user types
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
      en: {
        en: 'Language set to English',
        ro: 'Limba a fost setată la Engleză'
      },
      ro: {
        en: 'Language set to Romanian',
        ro: 'Limba a fost setată la Română'
      }
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
    designer: {
      profile: {
        en: 'Profile',
        ro: 'Profil'
      },
      profileDesc: {
        en: 'Update your personal information',
        ro: 'Actualizează informațiile personale'
      },
      preferences: {
        en: 'Preferences',
        ro: 'Preferințe'
      },
      preferencesDesc: {
        en: 'Configure designer preferences',
        ro: 'Configurează preferințele pentru designeri'
      }
    },
    client: {
      description: {
        en: 'Manage your account settings and preferences',
        ro: 'Gestionează setările și preferințele contului tău'
      },
      account: {
        en: 'Account',
        ro: 'Cont'
      },
      accountDesc: {
        en: 'Update your personal information',
        ro: 'Actualizează informațiile personale'
      },
      billing: {
        en: 'Billing',
        ro: 'Facturare'
      },
      billingDesc: {
        en: 'Manage billing information and payment methods',
        ro: 'Gestionează informațiile de facturare și metodele de plată'
      }
    }
  },
  
  // Designer pages
  designer: {
    materials: {
      subtitle: {
        en: 'Browse and select materials for your projects',
        ro: 'Răsfoiește și selectează materiale pentru proiectele tale'
      }
    }
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
    noImage: {
      en: 'No image available',
      ro: 'Nicio imagine disponibilă'
    },
    loading: {
      en: 'Loading accessories...',
      ro: 'Se încarcă accesoriile...'
    },
    accessoryAdded: {
      en: 'Accessory Added',
      ro: 'Accesoriu adăugat'
    },
    accessoryUpdated: {
      en: 'Accessory Updated',
      ro: 'Accesoriu actualizat'
    },
    accessoryDeleted: {
      en: 'Accessory Deleted',
      ro: 'Accesoriu șters'
    },
    hasBeenAdded: {
      en: 'has been added successfully',
      ro: 'a fost adăugat cu succes'
    },
    hasBeenUpdated: {
      en: 'has been updated successfully',
      ro: 'a fost actualizat cu succes'
    },
    accessoryDeletedSuccess: {
      en: 'Accessory has been deleted successfully',
      ro: 'Accesoriul a fost șters cu succes'
    },
    hasBeenAddedToProject: {
      en: 'has been added to your project.',
      ro: 'a fost adăugat la proiectul tău.'
    },
    importStarted: {
      en: 'Import Started',
      ro: 'Import început'
    },
    importFunctionality: {
      en: 'Accessory import functionality would be implemented here',
      ro: 'Funcționalitatea de import accesorii ar fi implementată aici'
    },
    exportStarted: {
      en: 'Export Started',
      ro: 'Export început'
    },
    exportFunctionality: {
      en: 'Accessory export functionality would be implemented here',
      ro: 'Funcționalitatea de export accesorii ar fi implementată aici'
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
    addAccessory: {
      en: 'Add Accessory',
      ro: 'Adaugă Accesoriu'
    },
    addNewAccessory: {
      en: 'Add New Accessory',
      ro: 'Adaugă Accesoriu Nou'
    },
    editAccessory: {
      en: 'Edit Accessory',
      ro: 'Editează Accesoriu'
    },
    fillDetails: {
      en: 'Fill in the details for the new accessory',
      ro: 'Completează detaliile pentru noul accesoriu'
    },
    updateDetails: {
      en: 'Update the accessory details',
      ro: 'Actualizează detaliile accesoriului'
    },
    form: {
      code: {
        en: 'Code',
        ro: 'Cod'
      },
      name: {
        en: 'Name',
        ro: 'Nume'
      },
      manufacturer: {
        en: 'Manufacturer',
        ro: 'Producător'
      },
      selectManufacturer: {
        en: 'Select manufacturer',
        ro: 'Selectează producătorul'
      },
      price: {
        en: 'Price (€)',
        ro: 'Preț (€)'
      },
      stockQty: {
        en: 'Stock Quantity',
        ro: 'Cantitate în stoc'
      },
      compatibility: {
        en: 'Compatible With',
        ro: 'Compatibil cu'
      },
      image: {
        en: 'Image',
        ro: 'Imagine'
      },
      preview: {
        en: 'Preview',
        ro: 'Previzualizare'
      },
      uploadImage: {
        en: 'Upload Image',
        ro: 'Încarcă imagine'
      },
      imageNote: {
        en: 'Optional. Maximum size: 2MB',
        ro: 'Opțional. Dimensiune maximă: 2MB'
      },
      update: {
        en: 'Update Accessory',
        ro: 'Actualizează Accesoriu'
      },
      add: {
        en: 'Add Accessory',
        ro: 'Adaugă Accesoriu'
      },
      other: {
        en: 'Other',
        ro: 'Alta'
      }
    },
    moduleTypes: {
      baseUnit: {
        en: 'Base Unit',
        ro: 'Corp bază'
      },
      wallUnit: {
        en: 'Wall Unit',
        ro: 'Corp suspendat'
      },
      tallUnit: {
        en: 'Tall Unit',
        ro: 'Corp înalt'
      },
      drawerUnit: {
        en: 'Drawer Unit',
        ro: 'Corp sertare'
      },
      cornerUnit: {
        en: 'Corner Unit',
        ro: 'Corp colț'
      },
      shelfUnit: {
        en: 'Shelf Unit',
        ro: 'Raft'
      },
      island: {
        en: 'Island',
        ro: 'Insulă'
      },
      other: {
        en: 'Other',
        ro: 'Altele'
      }
    }
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
    failedToLoad: {
      en: 'Failed to load report data',
      ro: 'Nu s-au putut încărca datele raportului'
    },
    noProjectFound: {
      en: 'Project not found',
      ro: 'Proiectul nu a fost găsit'
    },
    lastModified: {
      en: 'Last Modified',
      ro: 'Ultima modificare'
    },
    count: {
      en: 'Count',
      ro: 'Număr'
    },
    size: {
      en: 'Size',
      ro: 'Dimensiune'
    },
    dateGenerated: {
      en: 'Date Generated',
      ro: 'Data generării'
    },
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
      en: 'Recent Exports',
      ro: 'Exporturi recente'
    },
    exportDataDesc: {
      en: 'Export by Project',
      ro: 'Export după proiect'
    },
    templates: {
      en: 'Templates',
      ro: 'Șabloane'
    },
    templatesDesc: {
      en: 'Download templates for data import',
      ro: 'Descarcă șabloane pentru import de date'
    },
    materialsTemplateDesc: {
      en: 'Template for importing materials data',
      ro: 'Șablon pentru importul datelor despre materiale'
    },
    accessoriesTemplateDesc: {
      en: 'Template for importing accessories data',
      ro: 'Șablon pentru importul datelor despre accesorii'
    },
    usersTemplateDesc: {
      en: 'Template for importing user accounts',
      ro: 'Șablon pentru importul conturilor de utilizator'
    },
    modulesTemplateDesc: {
      en: 'Template for importing furniture modules',
      ro: 'Șablon pentru importul modulelor de mobilier'
    },
    clientsTemplateDesc: {
      en: 'Template for importing client information',
      ro: 'Șablon pentru importul informațiilor despre clienți'
    },
    uploadCsvOrExcel: {
      en: 'Upload a CSV or Excel file to import data',
      ro: 'Încarcă un fișier CSV sau Excel pentru a importa datele'
    },
    dataType: {
      en: 'Data Type',
      ro: 'Tip de date'
    },
    selectDataType: {
      en: 'Select data type',
      ro: 'Selectează tipul de date'
    },
    dragAndDrop: {
      en: 'Drag and drop your file here, or click to select',
      ro: 'Trage și plasează fișierul aici, sau apasă pentru a selecta'
    },
    csvOrExcel: {
      en: 'CSV or Excel files only (.csv, .xlsx, .xls)',
      ro: 'Doar fișiere CSV sau Excel (.csv, .xlsx, .xls)'
    },
    selectFile: {
      en: 'Select File',
      ro: 'Selectează Fișier'
    },
    dataPreview: {
      en: 'Data Preview',
      ro: 'Previzualizare date'
    },
    columnMapping: {
      en: 'Column Mapping',
      ro: 'Mapare coloane'
    },
    selectTargetColumn: {
      en: 'Select target column',
      ro: 'Selectează coloana țintă'
    },
    ignoreColumn: {
      en: 'Ignore this column',
      ro: 'Ignoră această coloană'
    },
    validationIssues: {
      en: 'Validation Issues',
      ro: 'Probleme de validare'
    },
    importing: {
      en: 'Importing...',
      ro: 'Se importă...'
    },
    importSuccessful: {
      en: 'Import Successful',
      ro: 'Import realizat cu succes'
    },
    dataImportedSuccessfully: {
      en: 'Your data has been imported successfully',
      ro: 'Datele tale au fost importate cu succes'
    },
    importFailed: {
      en: 'Import Failed',
      ro: 'Import eșuat'
    },
    errorOccurredDuringImport: {
      en: 'An error occurred during import. Please try again.',
      ro: 'A apărut o eroare în timpul importului. Te rugăm să încerci din nou.'
    },
    importCompletedWithWarnings: {
      en: 'Import Completed with Warnings',
      ro: 'Import finalizat cu avertismente'
    },
    checkValidationIssues: {
      en: 'Some items may not have been imported correctly. Please check the validation issues.',
      ro: 'Este posibil ca unele elemente să nu fi fost importate corect. Te rugăm să verifici problemele de validare.'
    },
    invalidFileType: {
      en: 'Invalid File Type',
      ro: 'Tip de fișier invalid'
    },
    pleaseSelectCsvOrExcel: {
      en: 'Please select a CSV or Excel file (.csv, .xlsx, .xls)',
      ro: 'Te rugăm să selectezi un fișier CSV sau Excel (.csv, .xlsx, .xls)'
    },
    cuttingList: {
      en: 'Cutting List',
      ro: 'Listă de debitare'
    },
    supplierOrder: {
      en: 'Supplier Orders',
      ro: 'Comenzi furnizori'
    },
    projectDetails: {
      en: 'Project Details',
      ro: 'Detalii proiect'
    },
    noDescription: {
      en: 'No description provided',
      ro: 'Nu există descriere'
    },
    roomType: {
      en: 'Room Type',
      ro: 'Tip cameră'
    },
    dimensions: {
      en: 'Dimensions',
      ro: 'Dimensiuni'
    },
    exportComplete: {
      en: 'Export Complete',
      ro: 'Export finalizat'
    },
    itemDescription: {
      en: 'Description',
      ro: 'Descriere'
    },
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
  }
};
