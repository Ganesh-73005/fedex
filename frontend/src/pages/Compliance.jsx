import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Search, Filter, Download, AlertTriangle, Shield, FileText,
  Clock, User, CheckCircle2, XCircle, Eye, Flag, Calendar
} from 'lucide-react';
import { auditLogs, cases } from '../data/mockData';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Compliance = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate compliance issues
  const complianceIssues = [
    {
      id: 1,
      type: 'missing_evidence',
      severity: 'high',
      case_id: 'C-2026-0023',
      description: 'Required call recording missing for negotiation stage',
      detected_at: '2026-01-10T09:00:00+05:30',
      status: 'open'
    },
    {
      id: 2,
      type: 'sla_breach',
      severity: 'critical',
      case_id: 'C-2026-0045',
      description: 'SLA deadline exceeded by 48 hours',
      detected_at: '2026-01-09T14:30:00+05:30',
      status: 'open'
    },
    {
      id: 3,
      type: 'forbidden_communication',
      severity: 'medium',
      case_id: 'C-2026-0067',
      description: 'Communication attempted outside allowed hours',
      detected_at: '2026-01-08T21:15:00+05:30',
      status: 'resolved'
    },
    {
      id: 4,
      type: 'missing_evidence',
      severity: 'medium',
      case_id: 'C-2026-0089',
      description: 'Settlement agreement not uploaded within SLA',
      detected_at: '2026-01-07T16:00:00+05:30',
      status: 'open'
    },
    {
      id: 5,
      type: 'data_anomaly',
      severity: 'low',
      case_id: 'C-2026-0012',
      description: 'Duplicate activity entries detected',
      detected_at: '2026-01-06T11:00:00+05:30',
      status: 'resolved'
    }
  ];

  // Extended audit logs with more entries
  const extendedAuditLogs = [
    ...auditLogs,
    { id: 6, action: 'Role Changed', actor: 'Admin', target: 'User: John Smith', details: 'Role changed from DCA Agent to Compliance Officer', timestamp: '2026-01-09T10:00:00+05:30' },
    { id: 7, action: 'Bulk Assignment', actor: 'Sarah Chen', target: '15 cases', details: 'Bulk assigned to Phoenix Collections', timestamp: '2026-01-08T15:30:00+05:30' },
    { id: 8, action: 'SOP Updated', actor: 'Admin', target: 'SOP-001', details: 'Updated settlement stage SLA from 7 to 5 days', timestamp: '2026-01-08T09:00:00+05:30' },
    { id: 9, action: 'Case Escalated', actor: 'Mike Johnson', target: 'C-2026-0078', details: 'Escalated to legal team for review', timestamp: '2026-01-07T14:45:00+05:30' },
    { id: 10, action: 'Evidence Deleted', actor: 'System', target: 'C-2026-0034', details: 'Duplicate file removed from evidence', timestamp: '2026-01-07T11:20:00+05:30' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-muted text-muted-foreground border-muted';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getIssueTypeIcon = (type) => {
    switch (type) {
      case 'missing_evidence': return <FileText className="w-4 h-4" />;
      case 'sla_breach': return <Clock className="w-4 h-4" />;
      case 'forbidden_communication': return <XCircle className="w-4 h-4" />;
      case 'data_anomaly': return <AlertTriangle className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const openIssues = complianceIssues.filter(i => i.status === 'open').length;
  const criticalIssues = complianceIssues.filter(i => i.severity === 'critical' || i.severity === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Compliance & Audit</h1>
          <p className="text-muted-foreground mt-1">
            Monitor compliance issues and review audit trails
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="kpi-card kpi-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Open Issues</span>
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-destructive">{openIssues}</p>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card className="kpi-card kpi-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Critical/High</span>
              <Flag className="w-4 h-4 text-warning" />
            </div>
            <p className="text-2xl font-bold text-warning">{criticalIssues}</p>
            <p className="text-xs text-muted-foreground">Priority issues</p>
          </CardContent>
        </Card>
        <Card className="kpi-card kpi-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Audit Entries</span>
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{extendedAuditLogs.length}</p>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card className="kpi-card kpi-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Compliance Rate</span>
              <Shield className="w-4 h-4 text-success" />
            </div>
            <p className="text-2xl font-bold text-success">94%</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="issues">
            Compliance Issues
            {openIssues > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs justify-center">
                {openIssues}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="mt-6">
          <Card className="card-enterprise">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-base">Audit Trail</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by case, actor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-[250px]"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Action Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="assignment">Assignments</SelectItem>
                      <SelectItem value="stage">Stage Updates</SelectItem>
                      <SelectItem value="evidence">Evidence</SelectItem>
                      <SelectItem value="escalation">Escalations</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="7d">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extendedAuditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <span className="text-sm">{log.actor}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-primary">
                        {log.target}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                        {log.details}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="mt-6">
          <Card className="card-enterprise">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Compliance Issues</CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {complianceIssues.map((issue) => (
                    <div key={issue.id} className={`p-4 rounded-lg border ${
                      issue.status === 'resolved' ? 'bg-muted/30' : 'bg-card'
                    } border-border`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            issue.severity === 'critical' || issue.severity === 'high' 
                              ? 'bg-destructive/10 text-destructive'
                              : issue.severity === 'medium'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-muted text-muted-foreground'
                          }`}>
                            {getIssueTypeIcon(issue.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{issue.case_id}</span>
                              <Badge variant="outline" className={`text-xs ${getSeverityColor(issue.severity)}`}>
                                {issue.severity}
                              </Badge>
                              <Badge variant={issue.status === 'open' ? 'destructive' : 'secondary'} className="text-xs">
                                {issue.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Detected: {formatDate(issue.detected_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm">
                            View Case
                          </Button>
                          {issue.status === 'open' && (
                            <Button size="sm">
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card className="card-enterprise">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Compliance Reports</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Generate detailed compliance reports for auditing and regulatory purposes.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline">
                    Monthly Summary
                  </Button>
                  <Button variant="outline">
                    SLA Compliance
                  </Button>
                  <Button>
                    Generate Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Compliance;
