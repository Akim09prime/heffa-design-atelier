
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void> | void;
  debounceMs?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 1000,
  onSuccess,
  onError
}: UseAutoSaveOptions<T>) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const save = useCallback(
    async (dataToSave: T) => {
      setIsSaving(true);
      try {
        await onSave(dataToSave);
        setLastSaved(new Date());
        if (onSuccess) {
          onSuccess();
        }
        toast({
          title: "Saved",
          description: "Your changes have been saved automatically",
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
        if (onError) {
          onError(error as Error);
        }
        toast({
          title: "Save failed",
          description: (error as Error).message || "Failed to save changes",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, onSuccess, onError, toast]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      save(data);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [data, debounceMs, save]);

  return {
    isSaving,
    lastSaved,
    forceSave: () => save(data)
  };
}
