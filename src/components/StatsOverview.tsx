import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, Target } from "lucide-react";

interface Event {
  id: string;
  type: string;
  server: string;
  timestamp: Date;
}

interface StatsOverviewProps {
  events: Event[];
}

export function StatsOverview({ events }: StatsOverviewProps) {
  const now = new Date();
  const last24Hours = events.filter(event => 
    now.getTime() - event.timestamp.getTime() < 24 * 60 * 60 * 1000
  );
  
  const serverCounts = events.reduce((acc, event) => {
    acc[event.server] = (acc[event.server] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostActiveServer = Object.entries(serverCounts).sort(([,a], [,b]) => b - a)[0];
  
  const eventTypeCounts = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonEvent = Object.entries(eventTypeCounts).sort(([,a], [,b]) => b - a)[0];

  const stats = [
    {
      title: "Total Events",
      value: events.length,
      description: "All time reports",
      icon: Target,
      color: "text-gaming-purple"
    },
    {
      title: "Last 24 Hours",
      value: last24Hours.length,
      description: "Recent activity",
      icon: Clock,
      color: "text-gaming-cyan"
    },
    {
      title: "Most Active Server",
      value: mostActiveServer ? `Server ${mostActiveServer[0]}` : "N/A",
      description: mostActiveServer ? `${mostActiveServer[1]} events` : "No data",
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      title: "Community Reports",
      value: new Set(events.map(e => e.id)).size,
      description: "Unique contributors",
      icon: Users,
      color: "text-yellow-400"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-gradient-to-br from-gaming-card to-gaming-dark border-gaming-border shadow-lg hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
      
      {mostCommonEvent && (
        <Card className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-gaming-purple/10 to-gaming-cyan/10 border-gaming-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Most Reported Event</p>
                <p className="text-lg font-semibold text-foreground capitalize">
                  {mostCommonEvent[0].replace('_', ' ')}
                </p>
              </div>
              <Badge variant="secondary" className="bg-gaming-purple/20 text-gaming-purple border-gaming-purple/30">
                {mostCommonEvent[1]} reports
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}