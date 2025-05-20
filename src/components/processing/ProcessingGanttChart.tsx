
import React from 'react';
import { Card } from '@/components/ui/card';

interface ProcessingProject {
  id: string;
  name: string;
  client: string;
  status: string;
  currentSection: string;
  nextSection: string;
  totalPieces: number;
  completedPieces: number;
  startDate: string;
  estimatedCompletion: string;
}

interface GanttBarProps {
  project: ProcessingProject;
  index: number;
}

interface ProcessingGanttChartProps {
  projects: ProcessingProject[];
}

// Component to render an individual Gantt bar
const GanttBar: React.FC<GanttBarProps> = ({ project, index }) => {
  // Calculate project duration (in days)
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.estimatedCompletion);
  const today = new Date();
  
  // Create a time range for our chart (7 days before first project to 14 days after last project)
  const chartStartDate = new Date();
  chartStartDate.setDate(chartStartDate.getDate() - 7);
  const chartEndDate = new Date();
  chartEndDate.setDate(chartEndDate.getDate() + 30);
  
  // Calculate total chart duration
  const totalDays = (chartEndDate.getTime() - chartStartDate.getTime()) / (1000 * 3600 * 24);
  
  // Calculate positioning and width for the bar
  const startOffset = Math.max(0, (startDate.getTime() - chartStartDate.getTime()) / (1000 * 3600 * 24));
  const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  const barWidth = (duration / totalDays) * 100;
  const barOffset = (startOffset / totalDays) * 100;
  
  // Calculate progress
  const progress = (project.completedPieces / project.totalPieces) * 100;
  
  // Calculate today marker position
  const todayOffset = Math.max(0, (today.getTime() - chartStartDate.getTime()) / (1000 * 3600 * 24));
  const todayPosition = (todayOffset / totalDays) * 100;
  
  const isCompleted = project.status === 'Finalizat';
  const isActive = project.status === 'În producție';
  const isWaiting = project.status === 'În așteptare';
  
  // Determine bar color based on status
  const getBarColor = () => {
    if (isCompleted) return 'bg-green-600';
    if (isActive) return 'bg-blue-600';
    return 'bg-amber-600';
  };
  
  return (
    <div className="group relative h-12 mb-1">
      {/* Project label */}
      <div className="absolute left-0 top-0 w-48 h-full flex items-center">
        <div className="truncate text-sm text-admin-text-primary">{project.name}</div>
      </div>
      
      {/* Gantt bar */}
      <div 
        className="absolute h-6 rounded-md transition-all duration-200 cursor-pointer group-hover:opacity-90"
        style={{ 
          left: `calc(200px + ${barOffset}%)`, 
          width: `${barWidth}%`,
        }}
      >
        <div className={`w-full h-full flex items-center rounded-md ${getBarColor()}`}>
          <div 
            className="h-full bg-white/30 rounded-l-md"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Tooltip on hover */}
        <div className="absolute invisible group-hover:visible bg-admin-bg-secondary border border-admin-border-light shadow-lg rounded-md p-2 text-xs -top-16 left-0 w-56 z-20">
          <div className="font-semibold text-white mb-1">{project.name}</div>
          <div className="grid grid-cols-2 gap-y-1 text-admin-text-secondary">
            <span>Client:</span>
            <span className="text-white">{project.client}</span>
            
            <span>Status:</span>
            <span className="text-white">{project.status}</span>
            
            <span>Progres:</span>
            <span className="text-white">{Math.round(progress)}%</span>
            
            <span>Start:</span>
            <span className="text-white">{new Date(project.startDate).toLocaleDateString()}</span>
            
            <span>Termen:</span>
            <span className="text-white">{new Date(project.estimatedCompletion).toLocaleDateString()}</span>
          </div>
          <div className="absolute bottom-[-8px] left-4 w-4 h-4 bg-admin-bg-secondary border-r border-b border-admin-border-light transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

// Main Gantt chart component
export const ProcessingGanttChart: React.FC<ProcessingGanttChartProps> = ({ projects }) => {
  // Generate dates for the header (today + 30 days)
  const today = new Date();
  const dates = Array.from({ length: 31 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });
  
  return (
    <div className="bg-admin-bg-tertiary border border-admin-border-light rounded-md overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Header with dates */}
        <div className="flex border-b border-admin-border-light">
          {/* Empty space for project names */}
          <div className="w-48 flex-shrink-0 p-2 border-r border-admin-border-light"></div>
          
          {/* Date headers */}
          <div className="flex-1 flex">
            {dates.map((date, i) => (
              <div 
                key={i} 
                className={`flex-1 p-2 text-center text-xs ${
                  i === 0 ? 'bg-blue-500/20 text-blue-400' : 'text-admin-text-secondary'
                } ${
                  date.getDay() === 0 || date.getDay() === 6 ? 'bg-admin-bg-highlight' : ''
                }`}
              >
                <div className={`${i === 0 ? 'font-bold' : ''}`}>
                  {date.getDate()}
                </div>
                <div>
                  {date.toLocaleDateString('ro-RO', { weekday: 'short' })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chart body */}
        <div className="relative">
          {/* Today marker */}
          <div className="absolute top-0 bottom-0 w-px bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] z-10" style={{ left: '200px' }}>
            <div className="absolute -top-1 -left-[9px] bg-blue-500 text-xs text-white px-1 rounded">
              Azi
            </div>
          </div>
          
          {/* Project bars */}
          <div className="py-2">
            {projects.map((project, i) => (
              <GanttBar key={project.id} project={project} index={i} />
            ))}
            
            {projects.length === 0 && (
              <div className="flex justify-center items-center h-24 text-admin-text-secondary">
                Nu există proiecte care să corespundă filtrelor selectate.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
