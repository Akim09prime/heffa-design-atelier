
import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Send, MessageSquare, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUi } from '@/contexts/UiContext';
import { useTranslation, TranslationProvider } from '@/contexts/TranslationContext';
import { db } from '@/firebase-config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const samplePrompts = [
  { id: 'p1', text: "Generează idei de layout pentru un dormitor de 12mp" },
  { id: 'p2', text: "Recomandă culori pentru mobilier de bucătărie modernă" },
  { id: 'p3', text: "Sugerează materiale pentru un design minimalist" },
  { id: 'p4', text: "Cum pot economisi spațiu într-o bucătărie mică?" },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AiAssistantContent = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast, showSuccessToast, showErrorToast } = useUi();
  const { t } = useTranslation();
  
  const handleQuery = async () => {
    if (!query.trim()) {
      showToast("Introduceți o întrebare", "error");
      return;
    }
    
    if (isGenerating) {
      showToast("Se generează deja un răspuns", "info");
      return;
    }
    
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsGenerating(true);
    showToast("AI generează răspunsul...", "info");
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would be an API call to an AI service
      const responseText = `Răspuns la întrebarea: "${query}"\n\nAcesta este un răspuns simulat pentru scopuri demonstrative. Într-o implementare reală, acest text ar fi generat de un model AI bazat pe întrebarea utilizatorului.`;
      
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      showSuccessToast("Răspuns generat", "AI-ul a generat un răspuns la întrebarea ta");
      
      // Log to Firebase
      try {
        await setDoc(doc(db, "ai_interactions", `query_${Date.now()}`), {
          query,
          response: responseText,
          timestamp: serverTimestamp(),
          userId: '1' // This would be the current user's ID
        });
      } catch (firebaseError) {
        console.error("Firebase log error:", firebaseError);
      }
    } catch (error) {
      console.error("AI generation error:", error);
      showErrorToast("Eroare la generarea răspunsului", (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePromptSelect = (promptText: string, promptId: string) => {
    setQuery(promptText);
    setSelectedPrompt(promptId);
    showToast(`Prompt selectat: ${promptText.substring(0, 20)}...`, "info");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };
  
  const handleClearConversation = () => {
    if (messages.length === 0) {
      showToast("Conversația este deja goală", "info");
      return;
    }
    
    setMessages([]);
    showToast("Conversația a fost ștearsă", "success");
  };
  
  const handleCloseAssistant = () => {
    showToast("Asistent AI închis", "info");
    // In a real app, this might navigate away or close a modal
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">{t('assistant.aiDesignAssistant')}</h1>
          <p className="text-muted-foreground">{t('assistant.description')}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCloseAssistant}
          className="mt-2 md:mt-0"
        >
          <X className="h-4 w-4 mr-2" />
          {t('common.close')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompts and Chat Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Sample Prompts */}
          <Card>
            <CardHeader>
              <CardTitle>{t('assistant.samplePrompts')}</CardTitle>
              <CardDescription>{t('assistant.clickToUse')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {samplePrompts.map(prompt => (
                <Button 
                  key={prompt.id}
                  variant={selectedPrompt === prompt.id ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handlePromptSelect(prompt.text, prompt.id)}
                >
                  {prompt.text}
                </Button>
              ))}
            </CardContent>
          </Card>
          
          {/* Additional Controls */}
          <Card>
            <CardHeader>
              <CardTitle>{t('assistant.controls')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleClearConversation}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('assistant.clearConversation')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{t('assistant.conversation')}</CardTitle>
              <CardDescription>
                {messages.length === 0 
                  ? t('assistant.startConversation')
                  : `${messages.length} ${t('assistant.messages')}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-4 opacity-25" />
                    <p>{t('assistant.noMessages')}</p>
                    <p className="text-sm">{t('assistant.startByTyping')}</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div 
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-100 ml-6' 
                          : 'bg-gray-100 mr-6'
                      }`}
                    >
                      <div className="font-medium mb-1">
                        {message.role === 'user' ? 'Tu' : 'AI Assistant'}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
                
                {isGenerating && (
                  <div className="p-4 rounded-lg bg-gray-100 mr-6">
                    <div className="flex items-center">
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      <span>{t('assistant.generating')}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full flex gap-2">
                <Textarea
                  placeholder={t('assistant.typeYourQuestion')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                  disabled={isGenerating}
                />
                <Button 
                  onClick={handleQuery} 
                  disabled={!query.trim() || isGenerating}
                  className="h-full"
                >
                  {isGenerating ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main component with TranslationProvider
const AiAssistant = () => {
  return (
    <TranslationProvider>
      <DesignerLayout>
        <AiAssistantContent />
      </DesignerLayout>
    </TranslationProvider>
  );
};

export default AiAssistant;
