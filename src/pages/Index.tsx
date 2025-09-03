import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventReporter } from "@/components/EventReporter";
import { DiscordConfig } from "@/components/DiscordConfig";
import { EventFeed } from "@/components/EventFeed";
import { StatsOverview } from "@/components/StatsOverview";
import { useToast } from "@/hooks/use-toast";
import { Swords, MessageSquare, Github } from "lucide-react";
import heroImage from "@/assets/blox-fruits-hero.jpg";

interface Event {
  id: string;
  type: string;
  server: string;
  location?: string;
  notes?: string;
  timestamp: Date;
  reporter: string;
}

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [discordEnabled, setDiscordEnabled] = useState(false);
  const { toast } = useToast();

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("blox-fruits-events");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp)
      }));
      setEvents(parsedEvents);
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem("blox-fruits-events", JSON.stringify(events));
  }, [events]);

  const handleEventReport = async (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep only last 50 events

    // Send Discord notification if enabled
    if (discordEnabled && discordWebhook) {
      await sendDiscordNotification(newEvent);
    }
  };

  const sendDiscordNotification = async (event: Event) => {
    const eventNames: Record<string, string> = {
      dough_king: "👑 Dough King",
      cake_prince: "🍰 Cake Prince",
      order_boss: "⚔️ Order Boss",
      legendary_sword_dealer: "🗡️ Legendary Sword Dealer",
      full_moon: "🌕 Full Moon",
      raid: "🏴‍☠️ Raid Available",
      other: "⚡ Special Event"
    };

    const eventName = eventNames[event.type] || "⚡ Event";
    const embedColor = {
      dough_king: 0xFFD700,
      cake_prince: 0xFF69B4,
      order_boss: 0xFF0000,
      legendary_sword_dealer: 0x8B00FF,
      full_moon: 0x0080FF,
      raid: 0x00FF00,
      other: 0x00FFFF
    }[event.type] || 0x8B5CF6;

    try {
      await fetch(discordWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          embeds: [{
            title: `${eventName} Spotted!`,
            description: `A new event has been reported by the community!`,
            color: embedColor,
            fields: [
              {
                name: "🖥️ Server",
                value: `Server ${event.server}`,
                inline: true
              },
              ...(event.location ? [{
                name: "📍 Location",
                value: event.location,
                inline: true
              }] : []),
              ...(event.notes ? [{
                name: "📝 Notes",
                value: event.notes,
                inline: false
              }] : []),
              {
                name: "🕒 Time",
                value: new Date().toLocaleString(),
                inline: true
              }
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: `Event ID: #${event.id.slice(-6)} | Blox Fruits Event Tracker`
            }
          }]
        }),
      });
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
    }
  };

  const handleWebhookUpdate = (webhook: string) => {
    setDiscordWebhook(webhook);
  };

  const handleNotificationToggle = (enabled: boolean) => {
    setDiscordEnabled(enabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-background to-gaming-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/20 via-transparent to-gaming-cyan/20" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <Swords className="h-12 w-12 text-gaming-purple mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gaming-purple via-white to-gaming-cyan bg-clip-text text-transparent">
              Blox Fruits
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Community Event Tracker
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Stay ahead of the game! Report and track boss spawns, raids, and special events. 
            Get instant Discord notifications when the community spots something big.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-gradient-to-r from-gaming-purple to-gaming-cyan hover:from-gaming-purple/80 hover:to-gaming-cyan/80 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-glow">
              <MessageSquare className="h-5 w-5 mr-2" />
              Join Community
            </Button>
            <Button variant="outline" className="border-gaming-border hover:bg-gaming-card text-foreground px-8 py-3">
              <Github className="h-5 w-5 mr-2" />
              View Guide
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Stats Overview */}
        <StatsOverview events={events} />

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Event Reporter */}
          <div className="lg:col-span-1 space-y-6">
            <EventReporter onEventReport={handleEventReport} />
            <DiscordConfig 
              onWebhookUpdate={handleWebhookUpdate}
              onNotificationToggle={handleNotificationToggle}
            />
          </div>

          {/* Right Column - Event Feed */}
          <div className="lg:col-span-2">
            <EventFeed events={events} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gaming-border">
          <p className="text-muted-foreground">
            Made with ❤️ for the Blox Fruits community | Not affiliated with Roblox Corporation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
