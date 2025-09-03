import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Send, CheckCircle, AlertCircle } from "lucide-react";

interface DiscordConfigProps {
  onWebhookUpdate: (webhook: string) => void;
  onNotificationToggle: (enabled: boolean) => void;
}

export function DiscordConfig({ onWebhookUpdate, onNotificationToggle }: DiscordConfigProps) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedWebhook = localStorage.getItem("discord-webhook");
    const savedEnabled = localStorage.getItem("discord-enabled") === "true";
    
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
      setIsConfigured(true);
      onWebhookUpdate(savedWebhook);
    }
    
    setIsEnabled(savedEnabled);
    onNotificationToggle(savedEnabled);
  }, [onWebhookUpdate, onNotificationToggle]);

  const handleWebhookSave = () => {
    if (!webhookUrl) {
      toast({
        title: "Invalid Webhook",
        description: "Please enter a valid Discord webhook URL",
        variant: "destructive",
      });
      return;
    }

    if (!webhookUrl.includes("discord.com/api/webhooks/")) {
      toast({
        title: "Invalid Webhook URL",
        description: "Please enter a valid Discord webhook URL",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("discord-webhook", webhookUrl);
    setIsConfigured(true);
    onWebhookUpdate(webhookUrl);
    
    toast({
      title: "Webhook Saved! ✅",
      description: "Discord webhook has been configured successfully",
    });
  };

  const handleToggleNotifications = (enabled: boolean) => {
    setIsEnabled(enabled);
    localStorage.setItem("discord-enabled", enabled.toString());
    onNotificationToggle(enabled);
    
    toast({
      title: enabled ? "Notifications Enabled" : "Notifications Disabled",
      description: enabled 
        ? "You'll now receive Discord notifications for new events"
        : "Discord notifications have been turned off",
    });
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "No Webhook URL",
        description: "Please save a webhook URL first",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          embeds: [{
            title: "🧪 Test Notification",
            description: "Your Blox Fruits Event Tracker is working perfectly!",
            color: 0x8B5CF6, // Purple color
            timestamp: new Date().toISOString(),
            footer: {
              text: "Blox Fruits Event Tracker"
            }
          }]
        }),
      });

      toast({
        title: "Test Sent! 📡",
        description: "Check your Discord channel for the test message",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test message. Please check your webhook URL.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gaming-card to-gaming-dark border-gaming-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
          <Settings className="h-5 w-5 text-gaming-cyan" />
          Discord Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="webhook" className="text-foreground">Discord Webhook URL</Label>
          <div className="flex gap-2">
            <Input
              id="webhook"
              type="url"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="bg-secondary border-gaming-border"
            />
            <Button 
              onClick={handleWebhookSave}
              className="bg-gaming-purple hover:bg-gaming-purple/80 text-white px-6"
            >
              Save
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Create a webhook in your Discord server settings under Integrations → Webhooks
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-gaming-border">
          <div className="flex items-center gap-3">
            {isConfigured ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            )}
            <div>
              <p className="font-medium text-foreground">Discord Notifications</p>
              <p className="text-sm text-muted-foreground">
                {isConfigured ? "Send event notifications to Discord" : "Configure webhook first"}
              </p>
            </div>
          </div>
          <Switch
            checked={isEnabled && isConfigured}
            onCheckedChange={handleToggleNotifications}
            disabled={!isConfigured}
          />
        </div>

        {isConfigured && (
          <Button
            onClick={testWebhook}
            variant="outline"
            className="w-full border-gaming-border hover:bg-gaming-card"
            disabled={isTesting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isTesting ? "Sending Test..." : "Send Test Message"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}