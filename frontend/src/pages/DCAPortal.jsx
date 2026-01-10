import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Briefcase, Clock, AlertTriangle, TrendingUp, Target, Phone, Mail,
  FileText, Upload, MessageSquare, Send, DollarSign, CheckCircle2,
  ArrowUpRight, Building2, Calendar, Filter, Search
} from 'lucide-react';
import { dcaList, cases } from '../data/mockData';
import { toast } from 'sonner';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getSLAStatus = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const hoursLeft = (deadlineDate - now) / (1000 * 60 * 60);
  
  if (hoursLeft < 0) return { status: 'breached', label: 'Breached', color: 'destructive' };
  if (hoursLeft < 24) return { status: 'critical', label: `${Math.round(hoursLeft)}h left`, color: 'destructive' };
  if (hoursLeft < 48) return { status: 'warning', label: `${Math.round(hoursLeft)}h left`, color: 'warning' };
  return { status: 'ok', label: `${Math.round(hoursLeft / 24)}d left`, color: 'success' };
};

const DCAPortal = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedCase, setSelectedCase] = useState(null);
  const [callFormOpen, setCallFormOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Simulate DCA's assigned cases
  const currentDCA = dcaList[0]; // Atlas Recovery Co
  const assignedCases = useMemo(() => 
    cases.filter(c => c.assigned_dca_id === currentDCA.dca_id && c.stage !== 'Closed')
      .sort((a, b) => new Date(a.sla_deadline) - new Date(b.sla_deadline)),
    [currentDCA.dca_id]
  );

  const urgentCases = assignedCases.filter(c => {
    const hoursLeft = (new Date(c.sla_deadline) - new Date()) / (1000 * 60 * 60);
    return hoursLeft < 48;
  });

  // Performance data
  const performanceData = [
    { week: 'W1', recovered: 45000, target: 50000 },
    { week: 'W2', recovered: 62000, target: 55000 },
    { week: 'W3', recovered: 48000, target: 52000 },
    { week: 'W4', recovered: 71000, target: 60000 },
  ];

  const stageDistribution = [
    { name: 'Notice Sent', value: 12, color: 'hsl(217, 91%, 45%)' },
    { name: 'Contacted', value: 25, color: 'hsl(199, 89%, 48%)' },
    { name: 'Negotiation', value: 18, color: 'hsl(38, 92%, 50%)' },
    { name: 'Settlement', value: 8, color: 'hsl(142, 71%, 45%)' },
  ];

  const handleLogCall = () => {
    toast.success('Call logged successfully');
    setCallFormOpen(false);
    setSelectedCase(null);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success('Message sent to enterprise');
      setMessage('');
      setMessageDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{currentDCA.name}</h1>
              <p className="text-muted-foreground">DCA Portal</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setMessageDialogOpen(true)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Enterprise
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="kpi-card kpi-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Active Cases</span>
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{assignedCases.length}</p>
            <p className="text-xs text-muted-foreground">of {currentDCA.capacity} capacity</p>
          </CardContent>
        </Card>
        <Card className="kpi-card kpi-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Urgent</span>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <p className="text-2xl font-bold text-warning">{urgentCases.length}</p>
            <p className="text-xs text-muted-foreground">SLA expiring soon</p>
          </CardContent>
        </Card>
        <Card className="kpi-card kpi-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Recovery Rate</span>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-2xl font-bold text-success">{(currentDCA.recovery_rate_30d * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="kpi-card kpi-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">SLA Compliance</span>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{(currentDCA.sla_compliance * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">On target</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases Inbox */}
        <div className="lg:col-span-2">
          <Card className="card-enterprise h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Assigned Cases</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8 w-[180px] h-8" />
                  </div>
                  <Select defaultValue="sla">
                    <SelectTrigger className="w-[130px] h-8">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sla">SLA Priority</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="aging">Aging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px] pr-4">
                <div className="space-y-3">
                  {assignedCases.slice(0, 15).map((c) => {
                    const slaInfo = getSLAStatus(c.sla_deadline);
                    return (
                      <div 
                        key={c.case_id} 
                        className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer relative"
                        onClick={() => setSelectedCase(c)}
                      >
                        <div className={`priority-strip ${
                          c.priority === 'HIGH' ? 'priority-high' :
                          c.priority === 'MEDIUM' ? 'priority-medium' : 'priority-low'
                        }`} />
                        <div className="pl-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-semibold text-primary">{c.case_id}</p>
                              <p className="text-sm text-foreground">{c.customer.name}</p>
                              <p className="text-xs text-muted-foreground">{c.customer.region}</p>
                            </div>
                            <Badge className={`${
                              slaInfo.color === 'destructive' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                              slaInfo.color === 'warning' ? 'bg-warning/10 text-warning border-warning/20' :
                              'bg-success/10 text-success border-success/20'
                            }`} variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {slaInfo.label}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Outstanding</p>
                                <p className="text-sm font-semibold">{formatCurrency(c.outstanding_amount)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Stage</p>
                                <Badge variant="secondary" className="text-xs">{c.stage}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCase(c);
                                setCallFormOpen(true);
                              }}>
                                <Phone className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Mail className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Performance Chart */}
          <Card className="card-enterprise">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recovery Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(v) => `${v / 1000}K`} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="recovered" stroke="hsl(142, 71%, 45%)" fill="url(#colorRecovered)" strokeWidth={2} />
                    <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" fill="none" strokeWidth={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stage Distribution */}
          <Card className="card-enterprise">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Cases by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stageDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {stageDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                    <span className="text-xs font-medium ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-enterprise">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload Evidence
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Download Reports
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Follow-ups
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call Log Dialog */}
      <Dialog open={callFormOpen} onOpenChange={setCallFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Call Activity</DialogTitle>
            <DialogDescription>
              Record call details for {selectedCase?.case_id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Call Outcome</label>
              <Select defaultValue="contacted">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacted">Right Party Contact</SelectItem>
                  <SelectItem value="voicemail">Left Voicemail</SelectItem>
                  <SelectItem value="no_answer">No Answer</SelectItem>
                  <SelectItem value="wrong_number">Wrong Number</SelectItem>
                  <SelectItem value="promise">Promise to Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <Textarea
                placeholder="Enter call details..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Follow-up Date (Optional)</label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCallFormOpen(false)}>Cancel</Button>
            <Button onClick={handleLogCall}>Log Call</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Enterprise</DialogTitle>
            <DialogDescription>
              Send a secure message to the FedEx Collections team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select defaultValue="general">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="escalation">Escalation Request</SelectItem>
                  <SelectItem value="dispute">Dispute Information</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DCAPortal;
