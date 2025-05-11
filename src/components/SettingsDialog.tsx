
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/sonner';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [apiKey, setApiKey] = useState('');
  const { user } = useAuth();
  
  // Load existing API key from Supabase when dialog opens
  useEffect(() => {
    if (open && user) {
      fetchApiKey();
    }
  }, [open, user]);

  const fetchApiKey = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('gemini_api_key')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setApiKey(data.gemini_api_key);
      } else {
        // Fallback to localStorage for backward compatibility
        const savedKey = localStorage.getItem('gemini_api_key') || '';
        setApiKey(savedKey);
      }
    } catch (error) {
      console.error('Error fetching API key:', error);
      toast.error('Failed to load saved API key');
    }
  };
  
  const handleSaveSettings = async () => {
    if (!apiKey.trim()) {
      toast.warning('Please enter a valid Gemini API key');
      return;
    }
    
    if (!user) {
      toast.error('You must be signed in to save settings');
      return;
    }
    
    try {
      // First, check if a record exists
      const { data } = await supabase
        .from('api_keys')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        // Update existing record
        const { error } = await supabase
          .from('api_keys')
          .update({ gemini_api_key: apiKey.trim() })
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('api_keys')
          .insert({ user_id: user.id, gemini_api_key: apiKey.trim() });
        
        if (error) throw error;
      }
      
      // Also save to localStorage for backward compatibility
      localStorage.setItem('gemini_api_key', apiKey.trim());
      
      toast.success('Settings saved successfully!');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Enter your Gemini API key to enable AI analysis features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Gemini API Key
            </label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              You can get your Gemini API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-legal-action underline">Google AI Studio</a>.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSaveSettings} className="gap-2">
            <Save size={16} />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
