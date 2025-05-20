import { Language } from '@/types/translations';

// Definim tipul pentru structura traducerilor
type TranslationsStructure = {
  [section: string]: {
    [key: string]: {
      [lang in Language]: string;
    } | {
      [nestedKey: string]: {
        [lang in Language]: string;
      } | {
        [deepNestedKey: string]: {
          [lang in Language]: string;
        }
      }
    }
  };
};

// Traduceri default pentru română și engleză
export const defaultTranslations: TranslationsStructure = {
  common: {
    save: {
      ro: "Salvează",
      en: "Save"
    },
    cancel: {
      ro: "Anulează",
      en: "Cancel"
    },
    delete: {
      ro: "Șterge",
      en: "Delete"
    },
    edit: {
      ro: "Editează",
      en: "Edit"
    },
    add: {
      ro: "Adaugă",
      en: "Add"
    },
    search: {
      ro: "Caută",
      en: "Search"
    },
    filter: {
      ro: "Filtrează",
      en: "Filter"
    },
    details: {
      ro: "Detalii",
      en: "Details"
    },
    back: {
      ro: "Înapoi",
      en: "Back"
    },
    loading: {
      ro: "Se încarcă...",
      en: "Loading..."
    },
    noData: {
      ro: "Nu există date",
      en: "No data available"
    },
    all: {
      ro: "Toate",
      en: "All"
    },
    logout: {
      ro: "Deconectare",
      en: "Logout"
    },
    confirm: {
      ro: "Confirmă",
      en: "Confirm"
    },
    export: {
      ro: "Exportă",
      en: "Export"
    },
    import: {
      ro: "Importă",
      en: "Import"
    },
    upload: {
      ro: "Încarcă",
      en: "Upload"
    }
  },
  auth: {
    login: {
      ro: "Autentificare",
      en: "Login"
    },
    register: {
      ro: "Înregistrare",
      en: "Register"
    },
    email: {
      ro: "Email",
      en: "Email"
    },
    password: {
      ro: "Parolă",
      en: "Password"
    },
    forgotPassword: {
      ro: "Ai uitat parola?",
      en: "Forgot password?"
    },
    logoutConfirmTitle: {
      ro: "Sigur vrei să te deloghezi?",
      en: "Are you sure you want to log out?"
    },
    logoutConfirmMessage: {
      ro: "Sesiunea curentă va fi închisă și va trebui să te autentifici din nou.",
      en: "Your current session will be closed and you'll need to login again."
    }
  },
  admin: {
    menu: {
      dashboard: {
        ro: "Panou de control",
        en: "Dashboard"
      },
      materials: {
        ro: "Baza de date materiale",
        en: "Materials Database"
      },
      accessories: {
        ro: "Accesorii",
        en: "Accessories"
      },
      production: {
        ro: "Planificare producție",
        en: "Production Planning"
      },
      users: {
        ro: "Utilizatori",
        en: "Users"
      },
      reports: {
        ro: "Rapoarte",
        en: "Reports"
      },
      importData: {
        ro: "Import date",
        en: "Import Data"
      },
      analytics: {
        ro: "Analiză",
        en: "Analytics"
      },
      settings: {
        ro: "Setări",
        en: "Settings"
      }
    },
    dashboard: {
      activeProjects: {
        ro: "Proiecte active",
        en: "Active Projects"
      },
      completedProjects: {
        ro: "Proiecte finalizate",
        en: "Completed Projects"
      },
      clients: {
        ro: "Clienți",
        en: "Clients"
      },
      furniturePieces: {
        ro: "Corpuri produse",
        en: "Furniture Pieces"
      },
      status: {
        ro: "Status",
        en: "Status"
      },
      client: {
        ro: "Client",
        en: "Client"
      },
      designer: {
        ro: "Designer",
        en: "Designer"
      },
      allDesigners: {
        ro: "Toți designerii",
        en: "All Designers"
      },
      active: {
        ro: "În lucru",
        en: "Active"
      },
      completed: {
        ro: "Finalizat",
        en: "Completed"
      },
      searchClient: {
        ro: "Caută client...",
        en: "Search client..."
      },
      advancedFilters: {
        ro: "Filtre avansate",
        en: "Advanced Filters"
      },
      recentProjects: {
        ro: "Proiecte recente",
        en: "Recent Projects"
      },
      new: {
        ro: "Nou",
        en: "New"
      },
      lastUpdate: {
        ro: "Ultima actualizare",
        en: "Last Update"
      },
      progress: {
        ro: "Progres",
        en: "Progress"
      },
      viewDetails: {
        ro: "Vezi detalii",
        en: "View Details"
      },
      systemActivity: {
        ro: "Activitatea sistemului",
        en: "System Activity"
      },
      monthlyView: {
        ro: "Vizualizare lunară",
        en: "Monthly View"
      },
      systemAlerts: {
        ro: "Alerte sistem",
        en: "System Alerts"
      },
      importantNotifications: {
        ro: "Notificări importante",
        en: "Important Notifications"
      },
      error: {
        ro: "Eroare",
        en: "Error"
      },
      warning: {
        ro: "Atenție",
        en: "Warning"
      },
      viewAllAlerts: {
        ro: "Vezi toate alertele",
        en: "View all alerts"
      }
    },
    materials: {
      categories: {
        pal: {
          ro: "PAL",
          en: "PAL"
        },
        mdf: {
          ro: "MDF",
          en: "MDF"
        },
        mdf_agt: {
          ro: "MDF AGT",
          en: "MDF AGT"
        },
        pfl: {
          ro: "PFL",
          en: "PFL"
        },
        glass: {
          ro: "Sticlă",
          en: "Glass"
        }
      },
      addMaterial: {
        ro: "Adaugă material",
        en: "Add Material"
      },
      editMaterial: {
        ro: "Editează material",
        en: "Edit Material"
      },
      deleteMaterial: {
        ro: "Șterge material",
        en: "Delete Material"
      },
      importExport: {
        ro: "Import/Export",
        en: "Import/Export"
      },
      code: {
        ro: "Cod",
        en: "Code"
      },
      name: {
        ro: "Denumire",
        en: "Name"
      },
      thickness: {
        ro: "Grosime",
        en: "Thickness"
      },
      price: {
        ro: "Preț",
        en: "Price"
      },
      supplier: {
        ro: "Furnizor",
        en: "Supplier"
      },
      stock: {
        ro: "Stoc",
        en: "Stock"
      },
      technicalSheet: {
        ro: "Fișă tehnică",
        en: "Technical Sheet"
      }
    },
    accessories: {
      brand: {
        ro: "Brand",
        en: "Brand"
      },
      system: {
        ro: "Sistem",
        en: "System"
      },
      dimension: {
        ro: "Dimensiune",
        en: "Dimension"
      },
      options: {
        ro: "Opțiuni",
        en: "Options"
      },
      addAccessory: {
        ro: "Adaugă accesoriu",
        en: "Add Accessory"
      },
      editAccessory: {
        ro: "Editează accesoriu",
        en: "Edit Accessory"
      },
      deleteAccessory: {
        ro: "Șterge accesoriu",
        en: "Delete Accessory"
      },
      description: {
        ro: "Descriere",
        en: "Description"
      },
      toggleView: {
        ro: "Schimbă vizualizarea",
        en: "Toggle View"
      }
    },
    production: {
      sections: {
        cutting: {
          ro: "Tăiere",
          en: "Cutting"
        },
        edgeBanding: {
          ro: "Cant",
          en: "Edge Banding"
        },
        cnc: {
          ro: "CNC",
          en: "CNC"
        },
        painting: {
          ro: "Vopsitorie",
          en: "Painting"
        },
        glass: {
          ro: "Sticlă",
          en: "Glass"
        }
      },
      routingRules: {
        ro: "Reguli de rutare",
        en: "Routing Rules"
      },
      standardTime: {
        ro: "Timp standard",
        en: "Standard Time"
      },
      addRule: {
        ro: "Adaugă regulă",
        en: "Add Rule"
      },
      editRule: {
        ro: "Editează regulă",
        en: "Edit Rule"
      },
      deleteRule: {
        ro: "Șterge regulă",
        en: "Delete Rule"
      }
    },
    users: {
      addUser: {
        ro: "Adaugă utilizator",
        en: "Add User"
      },
      editUser: {
        ro: "Editează utilizator",
        en: "Edit User"
      },
      deleteUser: {
        ro: "Șterge utilizator",
        en: "Delete User"
      },
      name: {
        ro: "Nume",
        en: "Name"
      },
      email: {
        ro: "Email",
        en: "Email"
      },
      role: {
        ro: "Rol",
        en: "Role"
      },
      status: {
        ro: "Status",
        en: "Status"
      },
      password: {
        ro: "Parolă",
        en: "Password"
      },
      confirmPassword: {
        ro: "Confirmă parola",
        en: "Confirm Password"
      },
      permissions: {
        ro: "Permisiuni",
        en: "Permissions"
      },
      active: {
        ro: "Activ",
        en: "Active"
      },
      inactive: {
        ro: "Inactiv",
        en: "Inactive"
      },
      userManagement: {
        ro: "Gestionare utilizatori",
        en: "User Management"
      },
      manageSystemUsers: {
        ro: "Gestionează utilizatorii sistemului",
        en: "Manage system users"
      },
      systemUsers: {
        ro: "Utilizatori sistem",
        en: "System Users"
      },
      userDetails: {
        ro: "Detalii utilizator",
        en: "User Details"
      },
      searchUsers: {
        ro: "Caută utilizatori...",
        en: "Search users..."
      },
      filterByRole: {
        ro: "Filtrează după rol",
        en: "Filter by role"
      },
      allUsers: {
        ro: "Toți utilizatorii",
        en: "All Users"
      },
      admins: {
        ro: "Administratori",
        en: "Admins"
      },
      designers: {
        ro: "Designeri",
        en: "Designers"
      },
      clients: {
        ro: "Clienți",
        en: "Clients"
      },
      noUsersFound: {
        ro: "Nu au fost găsiți utilizatori",
        en: "No users found matching your criteria"
      },
      invitation: {
        ro: "Invitație",
        en: "Invitation"
      },
      invitationSent: {
        ro: "Invitația a fost trimisă",
        en: "Invitation has been sent"
      }
    },
    reports: {
      monthlySales: {
        ro: "Vânzări lunare",
        en: "Monthly Sales"
      },
      furnitureProduced: {
        ro: "Corpuri produse",
        en: "Furniture Produced"
      },
      materialsConsumed: {
        ro: "Materiale consumate",
        en: "Materials Consumed"
      },
      selectPeriod: {
        ro: "Selectează perioada",
        en: "Select Period"
      },
      exportReport: {
        ro: "Exportă raport",
        en: "Export Report"
      }
    },
    importData: {
      dragAndDrop: {
        ro: "Trage și plasează fișierele aici sau click pentru a selecta",
        en: "Drag and drop files here or click to select"
      },
      columnMapping: {
        ro: "Mapare coloane",
        en: "Column Mapping"
      },
      preview: {
        ro: "Previzualizare",
        en: "Preview"
      },
      validation: {
        ro: "Validare",
        en: "Validation"
      },
      importData: {
        ro: "Importă date",
        en: "Import Data"
      },
      selectType: {
        ro: "Selectează tipul de import",
        en: "Select Import Type"
      },
      materials: {
        ro: "Materiale",
        en: "Materials"
      },
      accessories: {
        ro: "Accesorii",
        en: "Accessories"
      },
      users: {
        ro: "Utilizatori",
        en: "Users"
      },
      clients: {
        ro: "Clienți",
        en: "Clients"
      }
    },
    analytics: {
      projectsPerDay: {
        ro: "Proiecte/zi",
        en: "Projects/day"
      },
      activeUsers: {
        ro: "Utilizatori activi",
        en: "Active Users"
      },
      apiErrors: {
        ro: "Erori API",
        en: "API Errors"
      },
      timeFilter: {
        ro: "Filtru timp",
        en: "Time Filter"
      },
      last24h: {
        ro: "Ultimele 24h",
        en: "Last 24h"
      },
      last7days: {
        ro: "Ultimele 7 zile",
        en: "Last 7 days"
      },
      last30days: {
        ro: "Ultimele 30 zile",
        en: "Last 30 days"
      },
      exportRaw: {
        ro: "Exportă date brute",
        en: "Export Raw Data"
      }
    },
    settings: {
      general: {
        ro: "General",
        en: "General"
      },
      furnitureRules: {
        ro: "Reguli corpuri",
        en: "Furniture Rules"
      },
      accessoryRules: {
        ro: "Reguli accesorii",
        en: "Accessory Rules"
      },
      furnitureTemplates: {
        ro: "Șabloane corpuri",
        en: "Furniture Templates"
      },
      operationPrices: {
        ro: "Prețuri operațiuni",
        en: "Operation Prices"
      },
      addRule: {
        ro: "Adaugă regulă",
        en: "Add Rule"
      },
      editRule: {
        ro: "Editează regulă",
        en: "Edit Rule"
      },
      deleteRule: {
        ro: "Șterge regulă",
        en: "Delete Rule"
      },
      importRules: {
        ro: "Importă reguli",
        en: "Import Rules"
      },
      exportRules: {
        ro: "Exportă reguli",
        en: "Export Rules"
      }
    }
  },
  materials: {
    form: {
      code: {
        ro: "Cod material",
        en: "Material Code"
      },
      name: {
        ro: "Denumire",
        en: "Name"
      },
      type: {
        ro: "Tip",
        en: "Type"
      },
      thickness: {
        ro: "Grosime (mm)",
        en: "Thickness (mm)"
      },
      manufacturer: {
        ro: "Producător",
        en: "Manufacturer"
      },
      supplier: {
        ro: "Furnizor",
        en: "Supplier"
      },
      selectSupplier: {
        ro: "Selectează furnizor",
        en: "Select supplier"
      },
      pricePerSqm: {
        ro: "Preț/mp",
        en: "Price/sqm"
      },
      paintable: {
        ro: "Vopsibil",
        en: "Paintable"
      },
      paintableDesc: {
        ro: "Materialul poate fi vopsit",
        en: "Material can be painted"
      },
      cantable: {
        ro: "Cantabil",
        en: "Cantable"
      },
      cantableDesc: {
        ro: "Se poate aplica cant pe marginile materialului",
        en: "Edge banding can be applied to the material"
      },
      inStock: {
        ro: "În stoc",
        en: "In Stock"
      },
      inStockDesc: {
        ro: "Materialul este disponibil în stoc",
        en: "Material is available in stock"
      },
      image: {
        ro: "Imagine",
        en: "Image"
      },
      imageDescription: {
        ro: "Încarcă o imagine pentru acest material",
        en: "Upload an image for this material"
      },
      selectType: {
        ro: "Selectează tip",
        en: "Select type"
      },
      other: {
        ro: "Altul",
        en: "Other"
      },
      createMaterial: {
        ro: "Creează material",
        en: "Create Material"
      },
      updateMaterial: {
        ro: "Actualizează material",
        en: "Update Material"
      }
    },
    glass: {
      ro: "Sticlă",
      en: "Glass"
    },
    countertops: {
      ro: "Blaturi",
      en: "Countertops"
    }
  },
  reports: {
    analytics: {
      ro: "Analiză",
      en: "Analytics"
    },
    sales: {
      ro: "Vânzări",
      en: "Sales"
    },
    materials: {
      ro: "Materiale",
      en: "Materials"
    },
    accessories: {
      ro: "Accesorii",
      en: "Accessories"
    },
    processing: {
      ro: "Procesare",
      en: "Processing"
    },
    custom: {
      ro: "Personalizat",
      en: "Custom"
    },
    generateReport: {
      ro: "Generează raport",
      en: "Generate Report"
    },
    generateNewReport: {
      ro: "Generează raport nou",
      en: "Generate New Report"
    },
    reportName: {
      ro: "Nume raport",
      en: "Report Name"
    },
    enterReportName: {
      ro: "Introduceți numele raportului",
      en: "Enter report name"
    },
    newReport: {
      ro: "Raport nou",
      en: "New Report"
    },
    type: {
      ro: "Tip",
      en: "Type"
    },
    selectType: {
      ro: "Selectează tip",
      en: "Select type"
    },
    dateRange: {
      ro: "Interval de date",
      en: "Date Range"
    },
    selectPeriod: {
      ro: "Selectează perioada",
      en: "Select Period"
    },
    lastWeek: {
      ro: "Ultima săptămână",
      en: "Last Week"
    },
    lastMonth: {
      ro: "Ultima lună",
      en: "Last Month"
    },
    lastQuarter: {
      ro: "Ultimul trimestru",
      en: "Last Quarter"
    },
    lastYear: {
      ro: "Ultimul an",
      en: "Last Year"
    },
    last30days: {
      ro: "Ultimele 30 zile",
      en: "Last 30 days"
    },
    format: {
      ro: "Format",
      en: "Format"
    },
    selectFormat: {
      ro: "Selectează format",
      en: "Select format"
    },
    excel: {
      ro: "Excel",
      en: "Excel"
    },
    pdf: {
      ro: "PDF",
      en: "PDF"
    },
    json: {
      ro: "JSON",
      en: "JSON"
    },
    recentReports: {
      ro: "Rapoarte recente",
      en: "Recent Reports"
    },
    recentReportsDescription: {
      ro: "Lista rapoartelor generate recent",
      en: "List of recently generated reports"
    },
    created: {
      ro: "Creat",
      en: "Created"
    },
    status: {
      ro: "Status",
      en: "Status"
    },
    actions: {
      ro: "Acțiuni",
      en: "Actions"
    },
    exportStarted: {
      ro: "Export început",
      en: "Export Started"
    },
    preparingExport: {
      ro: "Se pregătește exportul pentru {type}",
      en: "Preparing {type} export"
    },
    exportSuccess: {
      ro: "Export reușit",
      en: "Export Success"
    },
    exportCompleted: {
      ro: "Exportul pentru {type} a fost completat",
      en: "Export for {type} has been completed"
    },
    furniturePieces: {
      ro: "Corpuri mobilier",
      en: "Furniture Pieces"
    }
  },
  months: {
    january: {
      ro: "Ianuarie",
      en: "January"
    },
    february: {
      ro: "Februarie",
      en: "February"
    },
    march: {
      ro: "Martie",
      en: "March"
    },
    april: {
      ro: "Aprilie",
      en: "April"
    },
    may: {
      ro: "Mai",
      en: "May"
    },
    june: {
      ro: "Iunie",
      en: "June"
    },
    july: {
      ro: "Iulie",
      en: "July"
    },
    august: {
      ro: "August",
      en: "August"
    },
    september: {
      ro: "Septembrie",
      en: "September"
    },
    october: {
      ro: "Octombrie",
      en: "October"
    },
    november: {
      ro: "Noiembrie",
      en: "November"
    },
    december: {
      ro: "Decembrie",
      en: "December"
    }
  },
  settings: {
    title: {
      ro: "Setări",
      en: "Settings"
    },
    description: {
      ro: "Gestionează setările aplicației",
      en: "Manage application settings"
    },
    general: {
      ro: "General",
      en: "General"
    },
    generalDesc: {
      ro: "Setări generale ale aplicației",
      en: "General application settings"
    },
    pricing: {
      ro: "Prețuri",
      en: "Pricing"
    },
    pricingDesc: {
      ro: "Setări de preț și costuri",
      en: "Price and cost settings"
    },
    appearance: {
      ro: "Aspect",
      en: "Appearance"
    },
    appearanceDesc: {
      ro: "Personalizează aspectul aplicației",
      en: "Customize application appearance"
    },
    notifications: {
      ro: "Notificări",
      en: "Notifications"
    },
    notificationsDesc: {
      ro: "Setări pentru notificări",
      en: "Notification settings"
    },
    backups: {
      ro: "Backup-uri",
      en: "Backups"
    },
    backupsDesc: {
      ro: "Gestionează backup-urile datelor",
      en: "Manage data backups"
    },
    languages: {
      ro: "Limbi",
      en: "Languages"
    },
    languagesDesc: {
      ro: "Setări de limbă și traduceri",
      en: "Language and translation settings"
    },
    changeLanguage: {
      ro: "Schimbă limba",
      en: "Change Language"
    },
    languageChanged: {
      ro: "Limba a fost schimbată",
      en: "Language has been changed"
    },
    languageSetTo: {
      ro: {
        ro: "Limba a fost setată la Română",
        en: "Language has been set to Romanian"
      },
      en: {
        ro: "Limba a fost setată la Engleză",
        en: "Language has been set to English"
      }
    },
    saveChanges: {
      ro: "Salvează modificările",
      en: "Save Changes"
    },
    saving: {
      ro: "Se salvează...",
      en: "Saving..."
    },
    settingsSaved: {
      ro: "Setări salvate",
      en: "Settings Saved"
    },
    changesSavedSuccess: {
      ro: "Modificările au fost salvate cu succes",
      en: "Changes have been saved successfully"
    }
  }
};

// Funcție pentru a extrage toate cheile de traducere într-un format plat
export const extractTranslationKeys = (
  translationsObj: any, 
  prefix = ''
): Record<string, string> => {
  const result: Record<string, string> = {};
  
  Object.entries(translationsObj).forEach(([section, sectionData]: [string, any]) => {
    const sectionPrefix = prefix ? `${prefix}.${section}` : section;
    
    Object.entries(sectionData).forEach(([key, translations]: [string, any]) => {
      // Pentru cheile simple care conțin direct traducerile
      if (translations.ro !== undefined || translations.en !== undefined) {
        result[`${sectionPrefix}.${key}`] = translations.ro || translations.en || key;
      } else {
        // Pentru structuri nested, apelăm recursiv
        const nestedKeys = extractTranslationKeys(translations, `${sectionPrefix}.${key}`);
        Object.assign(result, nestedKeys);
      }
    });
  });
  
  return result;
};
