import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import {
  ChevronLeft, Clock, AlertTriangle, Phone, Mail, FileText, Upload,
  DollarSign, Scale, CheckCircle2, Circle, User, Building2,
  Calendar, MapPin, Flag, Download, Eye, Trash2, MessageSquare,
  ArrowUpRight, History
} from 'lucide-react';
import { dcaList, auditLogs } from '../data/mockData';
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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatShortDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });
};

const getSLAStatus = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const hoursLeft = (deadlineDate - now) / (1000 * 60 * 60);
  
  if (hoursLeft < 0) return { status: 'breached', label: 'SLA Breached', hours: Math.abs(Math.round(hoursLeft)), color: 'destructive' };
  if (hoursLeft < 24) return { status: 'critical', label: `${Math.round(hoursLeft)}h remaining`, hours: Math.round(hoursLeft), color: 'destructive' };
  if (hoursLeft < 48) return { status: 'warning', label: `${Math.round(hoursLeft)}h remaining`, hours: Math.round(hoursLeft), color: 'warning' };
  return { status: 'ok', label: `${Math.round(hoursLeft / 24)} days remaining`, hours: Math.round(hoursLeft), color: 'success' };
};

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { cases, addActivity } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [activityForm, setActivityForm] = useState({ type: 'call', note: '' });

  const caseData = useMemo(() => cases.find(c => c.case_id === caseId), [cases, caseId]);

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold">Case not found</h2>
        <p className="text-muted-foreground mt-2">The case you&apos;re looking for doesn&apos;t exist.</p>
        <Button className="mt-4" onClick={() => navigate('/cases')}>Back to Cases</Button>
      </div>
    );
  }

  const slaInfo = getSLAStatus(caseData.sla_deadline);
  const sopCompletedSteps = caseData.sop_progress.filter(s => s.status === 'done').length;
  const sopTotalSteps = caseData.sop_progress.length;
  const sopProgress = (sopCompletedSteps / sopTotalSteps) * 100;

  const handleAddActivity = () => {
    const newActivity = {
      id: `ACT-${Date.now()}`,
      actor: 'current_user',
      type: activityForm.type,
      note: activityForm.note,
      ts: new Date().toISOString()
    };
    addActivity(caseData.case_id, newActivity);
    toast.success('Activity added successfully');
    setActivityDialogOpen(false);
    setActivityForm({ type: 'call', note: '' });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'escalation': return <ArrowUpRight className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call': return 'bg-primary text-primary-foreground';
      case 'email': return 'bg-info text-info-foreground';
      case 'payment': return 'bg-success text-success-foreground';
      case 'escalation': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/cases')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{caseData.case_id}</h1>
            <Badge className={`${
              caseData.priority === 'HIGH' ? 'bg-destructive/10 text-destructive border-destructive/20' :
              caseData.priority === 'MEDIUM' ? 'bg-warning/10 text-warning border-warning/20' :
              'bg-success/10 text-success border-success/20'
            }`} variant="outline">
              {caseData.priority} Priority
            </Badge>
            {caseData.dispute_flag && (
              <Badge variant="outline" className="text-warning border-warning/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Dispute
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">{caseData.customer.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`sla-badge cursor-help ${
                  slaInfo.color === 'destructive' ? 'sla-red' :
                  slaInfo.color === 'warning' ? 'sla-yellow' : 'sla-green'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  {slaInfo.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>SLA Deadline: {formatDate(caseData.sla_deadline)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-enterprise">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(caseData.outstanding_amount)}</p>
          </CardContent>
        </Card>
        <Card className="card-enterprise">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Expected Recovery</p>
            <p className="text-xl font-bold text-success">{formatCurrency(caseData.expected_recovery)}</p>
          </CardContent>
        </Card>
        <Card className="card-enterprise">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Aging</p>
            <p className="text-xl font-bold text-foreground">{caseData.aging_days} days</p>
          </CardContent>
        </Card>
        <Card className="card-enterprise">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Recovery Probability</p>
            <p className="text-xl font-bold text-primary">{(caseData.p_recover * 100).toFixed(0)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Customer Info */}
              <Card className="card-enterprise">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="text-sm font-medium">{caseData.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Customer ID</p>
                      <p className="text-sm font-medium">{caseData.customer.customer_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Region</p>
                      <p className="text-sm font-medium">{caseData.customer.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Flag className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned DCA</p>
                      <p className="text-sm font-medium">{caseData.assigned_dca}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SOP Progress */}
              <Card className="card-enterprise">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">SOP Progress</CardTitle>
                    <Badge variant="secondary">{sopCompletedSteps}/{sopTotalSteps} Complete</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={sopProgress} className="h-2 mb-4" />
                  <div className="space-y-3">
                    {caseData.sop_progress.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.status === 'done' ? 'bg-success text-success-foreground' :
                          step.status === 'in_progress' ? 'bg-primary text-primary-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {step.status === 'done' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : step.status === 'in_progress' ? (
                            <Circle className="w-4 h-4 animate-pulse" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${
                              step.status === 'pending' ? 'text-muted-foreground' : ''
                            }`}>{step.step}</p>
                            {step.evidence_required && step.status !== 'done' && (
                              <Badge variant="outline" className="text-xs">
                                Evidence Required
                              </Badge>
                            )}
                          </div>
                          {step.ts && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Completed {formatShortDate(step.ts)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="card-enterprise">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Activity Timeline</CardTitle>
                    <Button size="sm" onClick={() => setActivityDialogOpen(true)}>
                      Add Activity
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-1">
                      {caseData.activities.map((activity, idx) => (
                        <div key={activity.id || idx} className="timeline-item">
                          <div className={`timeline-dot ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {activity.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  by {activity.actor.replace('_', ' ')}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(activity.ts)}
                              </span>
                            </div>
                            <p className="text-sm">{activity.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <Card className="card-enterprise">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Evidence & Documents</CardTitle>
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {caseData.evidence.length > 0 ? (
                    <div className="space-y-2">
                      {caseData.evidence.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.filename}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.type.replace('_', ' ')} • Uploaded {formatShortDate(doc.uploaded_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload First Document
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="mt-6">
              <Card className="card-enterprise">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Audit Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <History className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{log.action}</span>
                              <span className="text-xs text-muted-foreground">by {log.actor}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{log.details}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(log.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="card-enterprise">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" onClick={() => setActivityDialogOpen(true)}>
                <Phone className="w-4 h-4 mr-2" />
                Log Call
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Evidence
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                Propose Settlement
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Mark Promise-to-Pay
              </Button>
              <Separator className="my-3" />
              <Button 
                className="w-full justify-start text-destructive hover:text-destructive" 
                variant="outline"
                onClick={() => setEscalateDialogOpen(true)}
              >
                <Scale className="w-4 h-4 mr-2" />
                Escalate to Legal
              </Button>
            </CardContent>
          </Card>

          {/* Case Stage */}
          <Card className="card-enterprise">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Current Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-sm px-3 py-1.5">
                {caseData.stage}
              </Badge>
              <div className="mt-4">
                <Select defaultValue={caseData.stage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Change stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Notice Sent">Notice Sent</SelectItem>
                    <SelectItem value="First Contact">First Contact</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Settlement">Settlement</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* DCA Info */}
          <Card className="card-enterprise">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Assigned DCA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{caseData.assigned_dca}</p>
                  <p className="text-xs text-muted-foreground">{caseData.assigned_dca_id}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Reassign DCA
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Activity Dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogDescription>
              Log a new activity for this case.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Activity Type</label>
              <Select value={activityForm.type} onValueChange={(v) => setActivityForm({ ...activityForm, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <Textarea
                placeholder="Enter activity details..."
                value={activityForm.note}
                onChange={(e) => setActivityForm({ ...activityForm, note: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddActivity} disabled={!activityForm.note}>Add Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Escalate Dialog */}
      <Dialog open={escalateDialogOpen} onOpenChange={setEscalateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Escalate to Legal</DialogTitle>
            <DialogDescription>
              This action is irreversible for this case stage. Are you sure you want to escalate this case to legal proceedings?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason for escalation (required)..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEscalateDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              toast.success('Case escalated to legal');
              setEscalateDialogOpen(false);
            }}>Confirm Escalation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseDetail;
