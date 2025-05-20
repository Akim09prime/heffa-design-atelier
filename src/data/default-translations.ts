
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
