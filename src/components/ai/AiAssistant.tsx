import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, ArrowUp, CheckCircle, AlertCircle, InfoIcon, Loader } from 'lucide-react';
import { AiAssistantMessage } from '@/types';
import { useUi } from '@/contexts/UiContext';

interface AiAssistantProps {
  projectId?: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ projectId }) => {
  const { showToast } = useUi();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiAssistantMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant for HeffaDesign. How can I help you today?',
      timestamp: new Date(),
      type: 'info'
    }
  ]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      showToast('Asistent AI deschis', 'info');
    } else {
      showToast('Asistent AI închis', 'info');
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setMessage(prompt);
    showToast(`Prompt selectat: ${prompt.substring(0, 20)}...`, 'info');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isProcessing) return;
    
    // Add user message to chat
    const userMessage: AiAssistantMessage = {
      id: `user-${Date.now()}`,
      text: message,
      timestamp: new Date(),
      type: 'info'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setSelectedPrompt(null);
    setIsProcessing(true);
    
    showToast('Se generează răspuns...', 'info');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const responseText = generateAiResponse(message);
      const aiMessage: AiAssistantMessage = {
        id: `ai-${Date.now()}`,
        text: responseText.text,
        timestamp: new Date(),
        type: responseText.type
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      
      if (responseText.type === 'error') {
        showToast('Eroare în generarea răspunsului', 'error');
      } else if (responseText.type === 'warning') {
        showToast('Răspuns generat cu atenționări', 'warning');
      } else {
        showToast('Răspuns generat cu succes', 'success');
      }
    }, 1200);
  };

  const generateAiResponse = (userMessage: string): { text: string; type: 'suggestion' | 'warning' | 'error' | 'info' } => {
    const userMessageLower = userMessage.toLowerCase();
    
    // Simple rule-based responses
    if (userMessageLower.includes('price') || userMessageLower.includes('cost')) {
      return {
        text: 'Pricing is calculated based on materials (price/m²), processing options, and accessories. For detailed pricing, check the module configuration panel.',
        type: 'info'
      };
    } else if (userMessageLower.includes('paint') || userMessageLower.includes('vopsire')) {
      return {
        text: 'Warning: Only MDF materials can be painted. PAL, PFL, and other materials cannot be painted.',
        type: 'warning'
      };
    } else if (userMessageLower.includes('edge') || userMessageLower.includes('cant')) {
      return {
        text: 'Edge banding can be applied to PAL and MDF-AGT materials, but not to standard MDF (which should be painted) or glass.',
        type: 'info'
      };
    } else if (userMessageLower.includes('glass') || userMessageLower.includes('sticla')) {
      return {
        text: 'Suggestion: For glass doors, remember to add aluminum profiles in the accessories section.',
        type: 'suggestion'
      };
    } else if (userMessageLower.includes('drawer') || userMessageLower.includes('sertar')) {
      return {
        text: 'Suggestion: Drawer units require slides. Consider adding Blum TandemBox or Hafele slides to your accessories.',
        type: 'suggestion'
      };
    } else if (userMessageLower.includes('error') || userMessageLower.includes('problem')) {
      return {
        text: 'If you\'re experiencing issues, check the validation panel for any errors or warnings, or try refreshing the page.',
        type: 'error'
      };
    } else if (userMessageLower.includes('export') || userMessageLower.includes('download')) {
      return {
        text: 'You can export your project in various formats: PDF (client offer), Excel (cutting lists), DXF (for CNC), or save a complete backup as JSON.',
        type: 'info'
      };
    } else {
      // Default response
      return {
        text: 'I\'m here to help with material selection, pricing, project configuration, and troubleshooting. Feel free to ask specific questions!',
        type: 'info'
      };
    }
  };

  const predefinedPrompts = [
    "Cum calculez prețul pentru un modul?",
    "Ce materiale pot fi vopsite?",
    "Ce tipuri de cantuit pot folosi pentru PAL?"
  ];

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={handleToggleOpen}
            className="h-14 w-14 rounded-full shadow-lg"
          >
            <MessageCircle size={24} />
          </Button>
        )}
      </div>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 z-50 shadow-xl">
          <Card className="border overflow-hidden">
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-medium">AI Assistant</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleToggleOpen}>
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${
                      msg.id.startsWith('user-') ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.id.startsWith('user-')
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {!msg.id.startsWith('user-') && msg.type !== 'info' && (
                        <div className="flex items-center mb-1">
                          {msg.type === 'suggestion' && (
                            <CheckCircle size={16} className="mr-1 text-green-500" />
                          )}
                          {msg.type === 'warning' && (
                            <AlertCircle size={16} className="mr-1 text-yellow-500" />
                          )}
                          {msg.type === 'error' && (
                            <AlertCircle size={16} className="mr-1 text-red-500" />
                          )}
                          <span className="text-xs font-medium capitalize">
                            {msg.type}:
                          </span>
                        </div>
                      )}
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-center my-4">
                    <div className="flex items-center gap-2 bg-muted p-2 px-4 rounded">
                      <Loader size={16} className="animate-spin" />
                      <span className="text-sm">Se generează răspuns...</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Predefined prompts */}
              <div className="p-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Întrebări frecvente:</p>
                <div className="flex flex-wrap gap-1">
                  {predefinedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptSelect(prompt)}
                      className={`text-xs ${selectedPrompt === prompt ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      {prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-3 border-t">
              <form className="flex w-full gap-2" onSubmit={handleSendMessage}>
                <Input
                  placeholder="Ask about materials, pricing..."
                  value={message}
                  onChange={handleMessageChange}
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="shrink-0"
                  disabled={!message.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};
