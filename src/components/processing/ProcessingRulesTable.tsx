
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Edit, Trash, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProcessingRule {
  id: number;
  material: string;
  thickness: string;
  condition: string;
  route: string[];
  isActive: boolean;
}

interface ProcessingRulesTableProps {
  rules: ProcessingRule[];
  onToggleRule: (id: number, isActive: boolean) => void;
}

export const ProcessingRulesTable: React.FC<ProcessingRulesTableProps> = ({ rules, onToggleRule }) => {
  const getMaterialBadgeClass = (material: string) => {
    switch (material.toLowerCase()) {
      case 'pal':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'mdf':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pfl':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'sticlă':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-admin-bg-tertiary text-admin-text-secondary">
          <tr>
            <th scope="col" className="px-6 py-3">Material</th>
            <th scope="col" className="px-6 py-3">Grosime</th>
            <th scope="col" className="px-6 py-3">Condiție</th>
            <th scope="col" className="px-6 py-3">Rută</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Acțiuni</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border-light">
          {rules.map((rule) => (
            <tr 
              key={rule.id} 
              className="hover:bg-admin-bg-highlight transition-colors duration-200"
            >
              <td className="px-6 py-4">
                <Badge className={`${getMaterialBadgeClass(rule.material)} border`}>
                  {rule.material}
                </Badge>
              </td>
              <td className="px-6 py-4 text-admin-text-primary">
                {rule.thickness}
              </td>
              <td className="px-6 py-4 text-admin-text-primary">
                {rule.condition}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center flex-wrap gap-1">
                  {rule.route.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <Badge variant="outline" className="border-admin-border-light text-admin-text-secondary">
                        {step}
                      </Badge>
                      {idx < rule.route.length - 1 && (
                        <ArrowRight size={12} className="text-admin-text-muted mx-1" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch 
                        checked={rule.isActive} 
                        onCheckedChange={(checked) => onToggleRule(rule.id, checked)}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-admin-bg-secondary border-admin-border-light">
                      <p className="text-admin-text-primary">
                        {rule.isActive ? 'Dezactivează regula' : 'Activează regula'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-admin-text-secondary hover:bg-admin-bg-tertiary">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-500/10">
                    <Trash size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
