
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Scissors, Box, Router, Palette, Mail, HelpCircle, Search, 
  Sliders, Download, Clock, Settings, ChevronDown, Filter, Plus 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProcessingSectionCard } from '@/components/processing/ProcessingSectionCard';
import { ProcessingRulesTable } from '@/components/processing/ProcessingRulesTable';
import { ProcessingStatusTable } from '@/components/processing/ProcessingStatusTable';
import { ProcessingGanttChart } from '@/components/processing/ProcessingGanttChart';
import { useToast } from '@/hooks/use-toast';

// Sample data for processing sections
const processingSections = [
  {
    id: 1,
    name: 'Tăiere',
    icon: Scissors,
    machines: ['Felder Kappa 550', 'Holzmann FKS 305'],
    activeJobs: 3,
    pendingJobs: 5,
    standardTime: 2.5, // min/mp
    color: 'blue'
  },
  {
    id: 2,
    name: 'Cant',
    icon: Box,
    machines: ['Holz-Her Sprint 1327', 'Felder G 480'],
    activeJobs: 1,
    pendingJobs: 2,
    standardTime: 1.8, // min/mp
    color: 'green'
  },
  {
    id: 3,
    name: 'CNC',
    icon: Router,
    machines: ['BIESSE Rover K', 'SCM Tech Z5'],
    activeJobs: 2,
    pendingJobs: 4,
    standardTime: 5.2, // min/mp
    color: 'purple'
  },
  {
    id: 4,
    name: 'Vopsitorie',
    icon: Palette,
    machines: ['Cabină vopsit Wagner', 'Uscător UV'],
    activeJobs: 0,
    pendingJobs: 1,
    standardTime: 15.0, // min/mp
    color: 'amber'
  },
  {
    id: 5,
    name: 'Sticlă',
    icon: Mail,
    machines: ['Mașină tăiat sticlă', 'Mașină șlefuit'],
    activeJobs: 1,
    pendingJobs: 0,
    standardTime: 8.5, // min/mp
    color: 'cyan'
  },
];

// Sample data for routing rules
const routingRules = [
  {
    id: 1,
    material: 'PAL',
    thickness: '18mm',
    condition: 'Standard',
    route: ['Tăiere', 'Cant'],
    isActive: true
  },
  {
    id: 2,
    material: 'MDF',
    thickness: '18mm',
    condition: 'Vopsit',
    route: ['Tăiere', 'CNC', 'Vopsitorie'],
    isActive: true
  },
  {
    id: 3,
    material: 'PAL',
    thickness: '18mm',
    condition: 'Cu frezare',
    route: ['Tăiere', 'CNC', 'Cant'],
    isActive: true
  },
  {
    id: 4,
    material: 'PFL',
    thickness: '3mm',
    condition: 'Standard',
    route: ['Tăiere'],
    isActive: false
  },
  {
    id: 5,
    material: 'Sticlă',
    thickness: '6mm',
    condition: 'Standard',
    route: ['Sticlă'],
    isActive: true
  }
];

// Sample data for projects in production
const productionProjects = [
  {
    id: 'PRJ-001',
    name: 'Modern Kitchen Set',
    client: 'John Smith',
    status: 'În producție',
    currentSection: 'Tăiere',
    nextSection: 'Cant',
    totalPieces: 32,
    completedPieces: 12,
    startDate: '2023-06-15',
    estimatedCompletion: '2023-06-22'
  },
  {
    id: 'PRJ-002',
    name: 'Office Furniture Set',
    client: 'Tech Solutions SRL',
    status: 'În așteptare',
    currentSection: '-',
    nextSection: 'Tăiere',
    totalPieces: 24,
    completedPieces: 0,
    startDate: '2023-06-20',
    estimatedCompletion: '2023-06-28'
  },
  {
    id: 'PRJ-003',
    name: 'Living Room Remodel',
    client: 'Elena Dumitru',
    status: 'În producție',
    currentSection: 'CNC',
    nextSection: 'Vopsitorie',
    totalPieces: 18,
    completedPieces: 8,
    startDate: '2023-06-10',
    estimatedCompletion: '2023-06-18'
  },
  {
    id: 'PRJ-004',
    name: 'Master Bedroom Closets',
    client: 'Daniel Popa',
    status: 'Finalizat',
    currentSection: 'Finalizat',
    nextSection: '-',
    totalPieces: 28,
    completedPieces: 28,
    startDate: '2023-05-28',
    estimatedCompletion: '2023-06-08'
  },
  {
    id: 'PRJ-005',
    name: 'Retail Store Shelving',
    client: 'Magazin Central SRL',
    status: 'În producție',
    currentSection: 'Cant',
    nextSection: 'CNC',
    totalPieces: 42,
    completedPieces: 18,
    startDate: '2023-06-12',
    estimatedCompletion: '2023-06-25'
  }
];

const Processing = () => {
  const [activeTab, setActiveTab] = useState('sections');
  const [viewMode, setViewMode] = useState('table');
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [materialFilter, setMaterialFilter] = useState('all');
  const { toast } = useToast();

  const filteredProjects = productionProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRule = () => {
    toast({
      title: "Regulă nouă adăugată",
      description: "Regula a fost salvată cu succes.",
    });
    setIsRuleDialogOpen(false);
  };

  const handleToggleRule = (id: number, isActive: boolean) => {
    toast({
      title: isActive ? "Regulă activată" : "Regulă dezactivată",
      description: `Regula ${id} a fost ${isActive ? 'activată' : 'dezactivată'} cu succes.`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export în curs",
      description: "Se exportă datele în format CSV/Excel...",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">Production Planning</h1>
            <p className="text-admin-text-secondary">Gestionarea fluxului de producție și a regulilor de rutare</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-admin-accent-purple hover:bg-admin-accent-purple/80">
                  <Plus size={18} className="mr-2" /> Adaugă regulă
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-admin-bg-secondary border-admin-border-light">
                <DialogHeader>
                  <DialogTitle className="text-white">Adaugă regulă nouă de rutare</DialogTitle>
                  <DialogDescription className="text-admin-text-secondary">
                    Configurează regula de rutare pentru un tip specific de material și grosime.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="material" className="text-right text-white">Material</Label>
                    <Select defaultValue="pal">
                      <SelectTrigger className="col-span-3 bg-admin-bg-tertiary border-admin-border-light text-white">
                        <SelectValue placeholder="Selectează material" />
                      </SelectTrigger>
                      <SelectContent className="bg-admin-bg-secondary border-admin-border-light">
                        <SelectItem value="pal">PAL</SelectItem>
                        <SelectItem value="mdf">MDF</SelectItem>
                        <SelectItem value="pfl">PFL</SelectItem>
                        <SelectItem value="glass">Sticlă</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="thickness" className="text-right text-white">Grosime</Label>
                    <Select defaultValue="18">
                      <SelectTrigger className="col-span-3 bg-admin-bg-tertiary border-admin-border-light text-white">
                        <SelectValue placeholder="Selectează grosime" />
                      </SelectTrigger>
                      <SelectContent className="bg-admin-bg-secondary border-admin-border-light">
                        <SelectItem value="3">3mm</SelectItem>
                        <SelectItem value="16">16mm</SelectItem>
                        <SelectItem value="18">18mm</SelectItem>
                        <SelectItem value="22">22mm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="condition" className="text-right text-white">Condiție</Label>
                    <Input 
                      id="condition"
                      className="col-span-3 bg-admin-bg-tertiary border-admin-border-light text-white"
                      placeholder="Ex: Standard, Cu frezare, etc."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="route" className="text-right text-white">Rută</Label>
                    <div className="col-span-3 space-y-2">
                      {['Tăiere', 'Cant', 'CNC', 'Vopsitorie', 'Sticlă'].map((section, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Switch id={`section-${idx}`} />
                          <Label htmlFor={`section-${idx}`} className="text-admin-text-secondary">{section}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRuleDialogOpen(false)}
                    className="border-admin-border-light text-admin-text-secondary hover:bg-admin-bg-highlight"
                  >
                    Anulează
                  </Button>
                  <Button onClick={handleAddRule}>Salvează</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="border-admin-border-light text-admin-text-secondary hover:bg-admin-bg-highlight"
            >
              <Download size={18} className="mr-2" /> Export CSV
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-admin-bg-tertiary border border-admin-border-light">
            <TabsTrigger 
              value="sections" 
              className="data-[state=active]:bg-admin-accent-blue data-[state=active]:text-white"
            >
              Secții Producție
            </TabsTrigger>
            <TabsTrigger 
              value="rules" 
              className="data-[state=active]:bg-admin-accent-blue data-[state=active]:text-white"
            >
              Reguli Rutare
            </TabsTrigger>
            <TabsTrigger 
              value="status" 
              className="data-[state=active]:bg-admin-accent-blue data-[state=active]:text-white"
            >
              Status Producție
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sections" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {processingSections.map((section) => (
                <ProcessingSectionCard key={section.id} section={section} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rules" className="mt-6">
            <Card className="bg-admin-bg-secondary border-admin-border-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Reguli de Rutare</CardTitle>
                <CardDescription className="text-admin-text-muted">
                  Configurează fluxul pieselor în funcție de material și caracteristici
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProcessingRulesTable 
                  rules={routingRules} 
                  onToggleRule={handleToggleRule} 
                />
              </CardContent>
              <CardFooter className="border-t border-admin-border-mid py-4 flex justify-between">
                <div className="text-sm text-admin-text-secondary">
                  Afișare {routingRules.length} reguli
                </div>
                <Button 
                  onClick={() => setIsRuleDialogOpen(true)}
                  size="sm"
                  className="bg-admin-accent-purple hover:bg-admin-accent-purple/80"
                >
                  <Plus size={14} className="mr-1" /> Adaugă regulă
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="status" className="mt-6">
            <Card className="bg-admin-bg-secondary border-admin-border-light">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Status Proiecte în Producție</CardTitle>
                    <CardDescription className="text-admin-text-muted">
                      Monitorizează statusul și progresul proiectelor
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`border-admin-border-light ${
                        viewMode === 'table' 
                          ? 'bg-admin-accent-blue/20 text-admin-accent-blue' 
                          : 'text-admin-text-secondary'
                      }`}
                      onClick={() => setViewMode('table')}
                    >
                      Tabel
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`border-admin-border-light ${
                        viewMode === 'gantt' 
                          ? 'bg-admin-accent-blue/20 text-admin-accent-blue' 
                          : 'text-admin-text-secondary'
                      }`}
                      onClick={() => setViewMode('gantt')}
                    >
                      Gantt
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 border-b border-admin-border-light pb-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-text-secondary" />
                    <Input
                      type="search"
                      placeholder="Caută după client, proiect sau ID..."
                      className="pl-9 bg-admin-bg-tertiary border-admin-border-light text-admin-text-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select 
                      value={materialFilter} 
                      onValueChange={setMaterialFilter}
                    >
                      <SelectTrigger className="w-[180px] bg-admin-bg-tertiary border-admin-border-light text-admin-text-primary">
                        <SelectValue placeholder="Filtrează" />
                      </SelectTrigger>
                      <SelectContent className="bg-admin-bg-secondary border-admin-border-light">
                        <SelectItem value="all">Toate statusurile</SelectItem>
                        <SelectItem value="in_production">În producție</SelectItem>
                        <SelectItem value="waiting">În așteptare</SelectItem>
                        <SelectItem value="completed">Finalizat</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="border-admin-border-light text-admin-text-secondary hover:bg-admin-bg-highlight"
                        >
                          <Sliders size={16} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-admin-bg-secondary border-admin-border-light">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-admin-text-primary">Opțiuni filtrare</h4>
                            <Separator className="bg-admin-border-light" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="mb-1 text-sm text-admin-text-secondary">Sortare</div>
                              <Select defaultValue="deadline">
                                <SelectTrigger className="w-full bg-admin-bg-tertiary border-admin-border-light text-admin-text-primary">
                                  <SelectValue placeholder="Sortare" />
                                </SelectTrigger>
                                <SelectContent className="bg-admin-bg-secondary border-admin-border-light">
                                  <SelectItem value="deadline">După termen</SelectItem>
                                  <SelectItem value="progress">După progres</SelectItem>
                                  <SelectItem value="name">După nume</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <div className="mb-1 text-sm text-admin-text-secondary">Direcție</div>
                              <Select defaultValue="asc">
                                <SelectTrigger className="w-full bg-admin-bg-tertiary border-admin-border-light text-admin-text-primary">
                                  <SelectValue placeholder="Direcție" />
                                </SelectTrigger>
                                <SelectContent className="bg-admin-bg-secondary border-admin-border-light">
                                  <SelectItem value="asc">Ascendent</SelectItem>
                                  <SelectItem value="desc">Descendent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-admin-border-light text-admin-text-secondary hover:bg-admin-bg-highlight w-full mt-2"
                          >
                            Resetează filtrele
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'table' ? (
                  <ProcessingStatusTable projects={filteredProjects} />
                ) : (
                  <ProcessingGanttChart projects={filteredProjects} />
                )}
              </CardContent>
              <CardFooter className="border-t border-admin-border-mid py-4">
                <div className="text-sm text-admin-text-secondary">
                  {filteredProjects.length} proiecte afișate
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Processing;
