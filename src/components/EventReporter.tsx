import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sword, Crown, Moon, Cake, Users, Zap } from "lucide-react";

const eventTypes = [
  { id: "dough_king", name: "Dough King", icon: Crown, color: "text-yellow-400" },
  { id: "cake_prince", name: "Cake Prince", icon: Cake, color: "text-pink-400" },
  { id: "order_boss", name: "Order Boss", icon: Sword, color: "text-red-400" },
  { id: "legendary_sword_dealer", name: "Legendary Sword Dealer", icon: Sword, color: "text-purple-400" },
  { id: "full_moon", name: "Full Moon", icon: Moon, color: "text-blue-400" },
  { id: "raid", name: "Raid Available", icon: Users, color: "text-green-400" },
  { id: "other", name: "Other Event", icon: Zap, color: "text-cyan-400" }
];

interface EventReporterProps {
  onEventReport: (event: any) => void;
}

export function EventReporter({ onEventReport }: EventReporterProps) {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [server, setServer] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent || !server) {
      toast({
        title: "Missing Information",
        description: "Please select an event type and enter the server.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const eventData = {
      id: Date.now().toString(),
      type: selectedEvent,
      server,
      location,
      notes,
      timestamp: new Date(),
      reporter: "Anonymous" // Could be extended with user authentication
    };

    try {
      onEventReport(eventData);
      
      toast({
        title: "Event Reported! 🎉",
        description: `${eventTypes.find(e => e.id === selectedEvent)?.name} reported successfully`,
      });

      // Reset form
      setSelectedEvent("");
      setServer("");
      setLocation("");
      setNotes("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gaming-card to-gaming-dark border-gaming-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
          Report New Event
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="eventType" className="text-foreground">Event Type</Label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="bg-secondary border-gaming-border">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-gaming-card border-gaming-border">
                {eventTypes.map((event) => {
                  const Icon = event.icon;
                  return (
                    <SelectItem key={event.id} value={event.id}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${event.color}`} />
                        {event.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="server" className="text-foreground">Server</Label>
            <Input
              id="server"
              placeholder="e.g., Server 1, 2, 3..."
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="bg-secondary border-gaming-border"
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-foreground">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="e.g., Mansion, Castle, Hydra Island..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-secondary border-gaming-border"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-foreground">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary border-gaming-border min-h-[80px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-gaming-purple to-gaming-cyan hover:from-gaming-purple/80 hover:to-gaming-cyan/80 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Reporting..." : "Report Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}