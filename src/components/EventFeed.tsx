import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sword, Crown, Moon, Cake, Users, Zap, Clock, MapPin, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const eventTypes = [
  { id: "dough_king", name: "Dough King", icon: Crown, color: "bg-yellow-500", textColor: "text-yellow-400" },
  { id: "cake_prince", name: "Cake Prince", icon: Cake, color: "bg-pink-500", textColor: "text-pink-400" },
  { id: "order_boss", name: "Order Boss", icon: Sword, color: "bg-red-500", textColor: "text-red-400" },
  { id: "legendary_sword_dealer", name: "Legendary Sword Dealer", icon: Sword, color: "bg-purple-500", textColor: "text-purple-400" },
  { id: "full_moon", name: "Full Moon", icon: Moon, color: "bg-blue-500", textColor: "text-blue-400" },
  { id: "raid", name: "Raid Available", icon: Users, color: "bg-green-500", textColor: "text-green-400" },
  { id: "other", name: "Other Event", icon: Zap, color: "bg-cyan-500", textColor: "text-cyan-400" }
];

interface Event {
  id: string;
  type: string;
  server: string;
  location?: string;
  notes?: string;
  timestamp: Date;
  reporter: string;
}

interface EventFeedProps {
  events: Event[];
}

export function EventFeed({ events }: EventFeedProps) {
  const getEventConfig = (eventType: string) => {
    return eventTypes.find(e => e.id === eventType) || eventTypes[eventTypes.length - 1];
  };

  if (events.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gaming-card to-gaming-dark border-gaming-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
            Recent Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No events reported yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to report an event!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gaming-card to-gaming-dark border-gaming-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
          <Clock className="h-5 w-5 text-gaming-cyan" />
          Recent Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
        {events.map((event) => {
          const eventConfig = getEventConfig(event.type);
          const Icon = eventConfig.icon;
          
          return (
            <div
              key={event.id}
              className="bg-secondary/50 border border-gaming-border rounded-lg p-4 hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${eventConfig.color} bg-opacity-20`}>
                    <Icon className={`h-4 w-4 ${eventConfig.textColor}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{eventConfig.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Server {event.server}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="border-gaming-border text-xs">
                  {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                </Badge>
              </div>
              
              {event.notes && (
                <p className="text-sm text-muted-foreground mb-2 bg-gaming-dark/30 rounded px-3 py-2">
                  {event.notes}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Reported by {event.reporter}
                </span>
                <span>#{event.id.slice(-6)}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}