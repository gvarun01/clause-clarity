
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/sonner';
import { Save } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [apiKey, setApiKey] = useState('');
  
  // Load existing API key from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      const savedKey = localStorage.getItem('gemini_api_key') || '';
      setApiKey(savedKey);
    }
  }, [open]);
  
  const handleSaveSettings = () => {
    if (!apiKey.trim()) {
      toast.warning('Please enter a valid Gemini API key');
      return;
    }
    
    localStorage.setItem('gemini_api_key', apiKey.trim());
    toast.success('Settings saved successfully!');
    onOpenChange(false);
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
