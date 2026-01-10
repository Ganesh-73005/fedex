import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
  FunnelChart, Funnel, LabelList
} from 'recharts';
import {
  TrendingUp, TrendingDown, Clock, AlertTriangle, Users, Target,
  DollarSign, FileWarning, ArrowRight, ChevronRight, Calendar
} from 'lucide-react';
import { kpiData, trendData, funnelData, dcaList, cases } from '../data/mockData';
import { Link } from 'react-router-dom';

const formatCurrency = (value) => {
  if (value >= 100000) return `\u20B9${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `\u20B9${(value / 1000).toFixed(1)}K`;
  return `\u20B9${value}`;
};

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const FunnelTooltipContent = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-1">{data.stage}</p>
        <p className="text-sm text-muted-foreground">{data.count} cases</p>
        <p className="text-sm font-medium text-primary">{formatCurrency(data.amount)}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { currentUser } = useApp();

  const kpiCards = [
    {
      title: 'Total Overdue',
      value: formatCurrency(kpiData.totalOverdue),
      subtext: `${kpiData.totalCases} active cases`,
      icon: DollarSign,
      trend: -2.4,
      variant: 'primary'
    },
    {
      title: 'Recovery Rate',
      value: `${(kpiData.recoveryRate * 100).toFixed(0)}%`,
      subtext: 'Last 30 days',
      icon: Target,
      trend: 3.2,
      variant: 'success'
    },
    {
      title: 'Avg. Time to Recover',
      value: `${kpiData.avgTimeToRecover} days`,
      subtext: 'From assignment',
      icon: Clock,
      trend: -5.1,
      variant: 'warning'
    },
    {
      title: 'SLA Breaches Today',
      value: kpiData.slaBreachesToday,
      subtext: `${kpiData.disputes} active disputes`,
      icon: AlertTriangle,
      trend: kpiData.slaBreachesToday > 5 ? 8.3 : -4.2,
      variant: 'destructive'
    },
    {
      title: 'Active DCAs',
      value: kpiData.activeDCAs,
      subtext: `${kpiData.closedCases} cases closed`,
      icon: Users,
      trend: 0,
      variant: 'primary'
    }
  ];

  const upcomingSLABreaches = cases
    .filter(c => {
      const deadline = new Date(c.sla_deadline);
      const now = new Date();
      const hoursLeft = (deadline - now) / (1000 * 60 * 60);
      return hoursLeft > 0 && hoursLeft < 48 && c.stage !== 'Closed';
    })
    .slice(0, 5);

  const COLORS = [
    'hsl(217, 91%, 45%)',
    'hsl(142, 71%, 45%)',
    'hsl(38, 92%, 50%)',
    'hsl(0, 72%, 51%)',
    'hsl(199, 89%, 48%)'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {currentUser.name}. Here&apos;s your collections overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Calendar className="w-3 h-3" />
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className={`kpi-card kpi-${kpi.variant} cursor-pointer hover:shadow-card-hover transition-shadow`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        kpi.variant === 'primary' ? 'bg-primary/10 text-primary' :
                        kpi.variant === 'success' ? 'bg-success/10 text-success' :
                        kpi.variant === 'warning' ? 'bg-warning/10 text-warning' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        <kpi.icon className="w-5 h-5" />
                      </div>
                      {kpi.trend !== 0 && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${
                          kpi.trend > 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {kpi.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(kpi.trend)}%
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <p className="text-xs text-muted-foreground/80">{kpi.subtext}</p>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view detailed {kpi.title.toLowerCase()} report</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="card-enterprise">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Overdue by Aging Bucket</CardTitle>
              <Badge variant="secondary" className="text-xs">Last 6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="color030" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 45%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="color3160" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="color6190" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="color90plus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(v) => `${v / 1000}K`} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="0-30" name="0-30 days" stroke="hsl(217, 91%, 45%)" fill="url(#color030)" strokeWidth={2} />
                  <Area type="monotone" dataKey="31-60" name="31-60 days" stroke="hsl(142, 71%, 45%)" fill="url(#color3160)" strokeWidth={2} />
                  <Area type="monotone" dataKey="61-90" name="61-90 days" stroke="hsl(38, 92%, 50%)" fill="url(#color6190)" strokeWidth={2} />
                  <Area type="monotone" dataKey="90+" name="90+ days" stroke="hsl(0, 72%, 51%)" fill="url(#color90plus)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Chart */}
        <Card className="card-enterprise">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Collection Funnel</CardTitle>
              <Badge variant="secondary" className="text-xs">Current Period</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={funnelData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis type="category" dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={90} />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                            <p className="font-medium mb-1">{data.stage}</p>
                            <p className="text-sm text-muted-foreground">{data.count} cases</p>
                            <p className="text-sm font-medium text-primary">{formatCurrency(data.amount)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DCA Leaderboard */}
        <Card className="card-enterprise lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">DCA Performance</CardTitle>
              <Link to="/allocation">
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dcaList.slice(0, 5).map((dca, index) => (
                <div key={dca.dca_id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{dca.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {dca.region_focus.join(', ')}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium">{dca.active_cases}/{dca.capacity}</p>
                    <p className="text-xs text-muted-foreground">cases</p>
                  </div>
                  <div className="w-24">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Recovery</span>
                      <span className="text-xs font-medium text-success">{(dca.recovery_rate_30d * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={dca.recovery_rate_30d * 100} className="h-1.5" />
                  </div>
                  <div className="hidden md:block">
                    <Badge variant={dca.sla_compliance >= 0.9 ? 'secondary' : 'destructive'} className="text-xs">
                      SLA {(dca.sla_compliance * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming SLA Breaches */}
        <Card className="card-enterprise">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Upcoming SLA Breaches</CardTitle>
              <Badge variant="destructive" className="text-xs">
                {upcomingSLABreaches.length} cases
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px] pr-4">
              {upcomingSLABreaches.length > 0 ? (
                <div className="space-y-3">
                  {upcomingSLABreaches.map((c) => {
                    const deadline = new Date(c.sla_deadline);
                    const hoursLeft = Math.round((deadline - new Date()) / (1000 * 60 * 60));
                    return (
                      <Link key={c.case_id} to={`/cases/${c.case_id}`}>
                        <div className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium">{c.case_id}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {c.customer.name}
                              </p>
                            </div>
                            <Badge className={`text-xs ${
                              hoursLeft < 12 ? 'bg-destructive/10 text-destructive border-destructive/20' :
                              'bg-warning/10 text-warning border-warning/20'
                            }`} variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {hoursLeft}h left
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{c.assigned_dca}</span>
                            <span className="font-medium">{formatCurrency(c.outstanding_amount)}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
                    <Target className="w-6 h-6 text-success" />
                  </div>
                  <p className="text-sm font-medium">No SLA breaches</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Great job! View upcoming expirations.
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
