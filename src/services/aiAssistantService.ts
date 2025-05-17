
import { AiAssistantMessage, AiLog, UserRole } from '@/types';

// Sample messages
const sampleSuggestions: AiAssistantMessage[] = [
  {
    id: '1',
    text: 'Would you like to add adjustable feet to this tall cabinet?',
    timestamp: new Date(),
    type: 'suggestion',
    relatedTo: {
      type: 'module',
      id: 'mod-123'
    }
  },
  {
    id: '2',
    text: 'This material cannot be painted. Would you like to choose an alternative?',
    timestamp: new Date(),
    type: 'warning',
    relatedTo: {
      type: 'material',
      id: 'mat-456'
    }
  },
  {
    id: '3',
    text: 'A drawer requires glides. Should I add them automatically?',
    timestamp: new Date(),
    type: 'error',
    relatedTo: {
      type: 'module',
      id: 'mod-789'
    }
  }
];

// Sample AI logs
const aiLogs: AiLog[] = [];

// AI Assistant Service
export const AiAssistantService = {
  // Get suggestions for a user based on role
  getSuggestions: (role: UserRole): AiAssistantMessage[] => {
    // In a real app, we would filter messages based on user role and context
    return sampleSuggestions;
  },
  
  // Add a new message
  addMessage: (message: Omit<AiAssistantMessage, 'id' | 'timestamp'>): AiAssistantMessage => {
    const newMessage = {
      ...message,
      id: `msg-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date()
    };
    
    sampleSuggestions.push(newMessage);
    return newMessage;
  },
  
  // Log an AI interaction
  logInteraction: (userId: string, role: UserRole, trigger: string, message: string, action: 'clicked' | 'ignored' | 'applied' | 'dismissed'): AiLog => {
    const log: AiLog = {
      id: `log-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      role,
      timestamp: new Date(),
      trigger,
      message,
      action
    };
    
    aiLogs.push(log);
    return log;
  },
  
  // Get contextual help for a topic
  getHelp: (topic: string): string => {
    const helpTopics: Record<string, string> = {
      'PAL': 'PAL (Particleboard) is a wood-based sheet material manufactured from wood chips, sawmill shavings, or sawdust. It is widely used in furniture manufacturing for cabinet carcasses and shelves. PAL cannot be painted but can be edgebanded.',
      'MDF': 'MDF (Medium Density Fiberboard) is an engineered wood product made by breaking down hardwood or softwood residuals into wood fibers. It can be painted and CNC processed, making it ideal for fronts and decorative elements.',
      'hinges': 'When selecting hinges, consider the door weight, opening angle required, and whether soft-close is desired. Blum and Hafele hinges are high quality options with different mounting plates available.',
      'order_steps': '1. Configure all furniture modules. 2. Review materials and accessories. 3. Calculate price. 4. Generate PDF offer. 5. Send to client for approval. 6. Export cutting sheets. 7. Submit order to suppliers.',
    };
    
    // Simple fuzzy matching
    const normalizedTopic = topic.toLowerCase();
    for (const [key, value] of Object.entries(helpTopics)) {
      if (normalizedTopic.includes(key.toLowerCase())) {
        return value;
      }
    }
    
    return 'I don\'t have information on that topic yet. Please try another query or contact support.';
  },
  
  // Get role-based tips
  getRoleTips: (role: UserRole): string[] => {
    const tips: Record<UserRole, string[]> = {
      'admin': [
        'Check for incomplete material entries in the database.',
        'Verify pricing consistency across similar products.',
        'Update stock quantities for popular accessories.',
        'Consider adding new materials from recent supplier catalogs.'
      ],
      'designer': [
        'Adding support braces improves stability for tall cabinets.',
        'Remember to include back panels (PFL) for all cabinets.',
        'For drawers deeper than 500mm, use heavy-duty slides.',
        'Glass fronts require aluminum profiles and special handling.'
      ],
      'client': [
        'Soft-close hinges reduce noise and increase durability.',
        'Consider handle-less designs with push systems for modern looks.',
        'MDF fronts allow for custom paint colors to match your interior.',
        'Adjustable shelves provide more flexibility for storage.'
      ]
    };
    
    return tips[role] || [];
  }
};
