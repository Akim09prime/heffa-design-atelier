
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Clock, Settings, Info } from 'lucide-react';

interface ProcessingSectionProps {
  section: {
    id: number;
    name: string;
    icon: LucideIcon;
    machines: string[];
    activeJobs: number;
    pendingJobs: number;
    standardTime: number;
    color: string;
  };
}

export const ProcessingSectionCard: React.FC<ProcessingSectionProps> = ({ section }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500/20',
          text: 'text-blue-400',
          border: 'border-blue-500/30'
        };
      case 'green':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          border: 'border-green-500/30'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/20',
          text: 'text-purple-400',
          border: 'border-purple-500/30'
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/20',
          text: 'text-amber-400',
          border: 'border-amber-500/30'
        };
      case 'cyan':
        return {
          bg: 'bg-cyan-500/20',
          text: 'text-cyan-400',
          border: 'border-cyan-500/30'
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-500/30'
        };
    }
  };

  const colorClasses = getColorClasses(section.color);

  return (
    <Card className="bg-admin-bg-secondary border-admin-border-light hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <CardHeader className="pb-2 relative">
        <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-20 ${colorClasses.bg}`}></div>
        <div className="flex items-center gap-3 z-10">
          <div className={`p-2 rounded-md ${colorClasses.bg} ${colorClasses.border} border`}>
            <section.icon size={20} className={colorClasses.text} />
          </div>
          <h3 className="font-medium text-lg text-white">{section.name}</h3>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-admin-text-secondary">Jobs active:</div>
          <div className="text-white text-right font-medium">{section.activeJobs}</div>
          
          <div className="text-admin-text-secondary">Jobs în așteptare:</div>
          <div className="text-white text-right font-medium">{section.pendingJobs}</div>
          
          <div className="text-admin-text-secondary flex items-center">
            Timp standard:
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info size={14} className="ml-1 text-admin-text-secondary cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-admin-bg-secondary border-admin-border-light text-admin-text-secondary">
                Timpul standard reprezintă durata medie necesară pentru procesarea unui metru pătrat de material în această secție.
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="text-white text-right font-medium flex items-center justify-end">
            <Clock size={14} className="mr-1 opacity-70" />
            {section.standardTime} min/mp
          </div>
        </div>
      </CardContent>
      <Separator className="bg-admin-border-light" />
      <CardFooter className="pt-3 pb-3">
        <div className="w-full">
          <div className="text-sm text-admin-text-secondary mb-1">Utilaje:</div>
          <div className="flex flex-wrap gap-1">
            {section.machines.map((machine, idx) => (
              <div 
                key={idx} 
                className="text-xs py-1 px-2 rounded-md bg-admin-bg-tertiary text-admin-text-primary"
              >
                {machine}
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
      <div className="bg-admin-bg-tertiary p-2 border-t border-admin-border-light">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-center hover:bg-admin-bg-highlight text-admin-text-secondary"
        >
          <Settings size={14} className="mr-1" /> Configurare
        </Button>
      </div>
    </Card>
  );
};
