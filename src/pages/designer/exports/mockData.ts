
// Mock data for projects and exports
export const projectMockData = [
  {
    id: 'proj-1',
    name: 'Modern Kitchen',
    status: 'approved',
    lastExport: '2023-10-15',
    exportCount: 5,
  },
  {
    id: 'proj-2',
    name: 'Classic Bedroom',
    status: 'in_production',
    lastExport: '2023-10-10',
    exportCount: 3,
  },
  {
    id: 'proj-3',
    name: 'Minimalist Living Room',
    status: 'completed',
    lastExport: '2023-09-28',
    exportCount: 8,
  },
];

export const recentExportsMockData = [
  {
    id: 'exp-1',
    projectId: 'proj-1',
    projectName: 'Modern Kitchen',
    format: 'pdf',
    date: '2023-10-15T10:30:00',
    size: '2.3MB',
    url: '/exports/pdf/modern_kitchen_offer.pdf',
  },
  {
    id: 'exp-2',
    projectId: 'proj-1',
    projectName: 'Modern Kitchen',
    format: 'dxf',
    date: '2023-10-15T10:32:00',
    size: '1.8MB',
    url: '/exports/dxf/modern_kitchen_cnc.dxf',
  },
  {
    id: 'exp-3',
    projectId: 'proj-2',
    projectName: 'Classic Bedroom',
    format: 'excel',
    date: '2023-10-10T14:15:00',
    size: '980KB',
    url: '/exports/excel/bedroom_cutting_list.xlsx',
  },
  {
    id: 'exp-4',
    projectId: 'proj-3',
    projectName: 'Minimalist Living Room',
    format: 'json',
    date: '2023-09-28T09:45:00',
    size: '126KB',
    url: '/exports/json/living_room_backup.json',
  },
  {
    id: 'exp-5',
    projectId: 'proj-3',
    projectName: 'Minimalist Living Room',
    format: 'svg',
    date: '2023-09-28T09:50:00',
    size: '540KB',
    url: '/exports/svg/living_room_fronts.svg',
  },
];
