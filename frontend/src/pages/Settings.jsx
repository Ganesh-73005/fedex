import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
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
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Settings as SettingsIcon, Users, Shield, FileText, Plus, GripVertical,
  Clock, Trash2, Edit2, Save, CheckCircle2, AlertTriangle, Building2,
  Bell, Lock, Database, Workflow
} from 'lucide-react';
import { sopTemplates, dcaList, roles } from '../data/mockData';
import { toast } from 'sonner';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('sop');
  const [selectedSOP, setSelectedSOP] = useState(sopTemplates[0]);
  const [editingStage, setEditingStage] = useState(null);

  const handleSaveStage = () => {
    toast.success('Stage saved successfully');
    setEditingStage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure workflows, permissions, and system settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sop" className="gap-2">
            <Workflow className="w-4 h-4" />
            SOP Builder
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Database className="w-4 h-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* SOP Builder */}
        <TabsContent value="sop" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SOP List */}
            <Card className="card-enterprise">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">SOP Templates</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New SOP</DialogTitle>
                        <DialogDescription>
                          Create a new Standard Operating Procedure template
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>SOP Name</Label>
                          <Input placeholder="Enter SOP name" className="mt-1.5" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input placeholder="Brief description" className="mt-1.5" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Create SOP</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sopTemplates.map((sop) => (
                    <div
                      key={sop.id}
                      onClick={() => setSelectedSOP(sop)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSOP?.id === sop.id
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{sop.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {sop.stages.length} stages
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {sop.id}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SOP Editor */}
            <Card className="card-enterprise lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{selectedSOP?.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Drag stages to reorder, click to edit
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    Save Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px] pr-4">
                  <div className="space-y-3">
                    {selectedSOP?.stages.map((stage, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <button className="mt-1 cursor-grab text-muted-foreground hover:text-foreground">
                            <GripVertical className="w-4 h-4" />
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                                  {idx + 1}
                                </div>
                                <span className="font-medium">{stage.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="gap-1">
                                  <Clock className="w-3 h-3" />
                                  {stage.sla_days} days
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingStage(idx)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Required artifacts:</span>
                              {stage.artifacts.map((artifact, aidx) => (
                                <Badge key={aidx} variant="secondary" className="text-xs">
                                  {artifact.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Stage Button */}
                    <Button variant="outline" className="w-full border-dashed">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stage
                    </Button>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Roles List */}
            <Card className="card-enterprise">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">User Roles</CardTitle>
                <CardDescription>
                  Manage role-based access control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div key={role.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{role.name}</p>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permissions Matrix */}
            <Card className="card-enterprise">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Permission Matrix</CardTitle>
                <CardDescription>
                  Configure access levels for each role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b border-border">
                    <div>Permission</div>
                    <div className="text-center">Admin</div>
                    <div className="text-center">DCA</div>
                    <div className="text-center">Compliance</div>
                    <div className="text-center">Executive</div>
                  </div>
                  
                  {[
                    { name: 'View Dashboard', admin: true, dca: true, compliance: true, exec: true },
                    { name: 'Manage Cases', admin: true, dca: true, compliance: false, exec: false },
                    { name: 'Allocate Cases', admin: true, dca: false, compliance: false, exec: false },
                    { name: 'View Audit Log', admin: true, dca: false, compliance: true, exec: false },
                    { name: 'Manage SOPs', admin: true, dca: false, compliance: false, exec: false },
                    { name: 'Export Reports', admin: true, dca: true, compliance: true, exec: true },
                    { name: 'Manage Users', admin: true, dca: false, compliance: false, exec: false },
                  ].map((perm, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2 items-center py-2">
                      <div className="text-sm">{perm.name}</div>
                      <div className="flex justify-center">
                        <Switch checked={perm.admin} />
                      </div>
                      <div className="flex justify-center">
                        <Switch checked={perm.dca} />
                      </div>
                      <div className="flex justify-center">
                        <Switch checked={perm.compliance} />
                      </div>
                      <div className="flex justify-center">
                        <Switch checked={perm.exec} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="card-enterprise max-w-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Email Notifications</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'SLA breach warnings', description: 'Get notified 24h before SLA deadline', enabled: true },
                      { label: 'Case assignments', description: 'When cases are assigned to your DCAs', enabled: true },
                      { label: 'Escalation requests', description: 'When collectors request escalation', enabled: true },
                      { label: 'Daily digest', description: 'Summary of daily activities', enabled: false },
                      { label: 'Weekly report', description: 'Weekly performance summary', enabled: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch defaultChecked={item.enabled} />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4">In-App Notifications</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Real-time updates', description: 'Show notifications in the app', enabled: true },
                      { label: 'Sound alerts', description: 'Play sound for critical notifications', enabled: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch defaultChecked={item.enabled} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'SAP', description: 'ERP integration for billing data', status: 'connected', icon: Database },
              { name: 'Salesforce', description: 'CRM integration for customer data', status: 'connected', icon: Building2 },
              { name: 'Twilio', description: 'Communication platform for calls', status: 'connected', icon: Bell },
              { name: 'DocuSign', description: 'E-signature for settlements', status: 'disconnected', icon: FileText },
              { name: 'AWS S3', description: 'Document storage', status: 'connected', icon: Database },
              { name: 'Slack', description: 'Team notifications', status: 'disconnected', icon: Bell },
            ].map((integration, idx) => (
              <Card key={idx} className="card-enterprise">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <integration.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                      </div>
                    </div>
                    <Badge variant={integration.status === 'connected' ? 'default' : 'outline'} className="text-xs">
                      {integration.status === 'connected' ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</>
                      ) : (
                        'Disconnected'
                      )}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant={integration.status === 'connected' ? 'outline' : 'default'} 
                      size="sm" 
                      className="w-full"
                    >
                      {integration.status === 'connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Stage Dialog */}
      <Dialog open={editingStage !== null} onOpenChange={() => setEditingStage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stage</DialogTitle>
            <DialogDescription>
              Modify stage settings and requirements
            </DialogDescription>
          </DialogHeader>
          {editingStage !== null && selectedSOP && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Stage Name</Label>
                <Input 
                  defaultValue={selectedSOP.stages[editingStage]?.name} 
                  className="mt-1.5" 
                />
              </div>
              <div>
                <Label>SLA (Days)</Label>
                <Input 
                  type="number" 
                  defaultValue={selectedSOP.stages[editingStage]?.sla_days} 
                  className="mt-1.5" 
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input 
                  defaultValue={selectedSOP.stages[editingStage]?.description} 
                  className="mt-1.5" 
                />
              </div>
              <div>
                <Label>Required Artifacts</Label>
                <Select defaultValue={selectedSOP.stages[editingStage]?.artifacts[0]}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select artifacts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notice_copy">Notice Copy</SelectItem>
                    <SelectItem value="call_record">Call Recording</SelectItem>
                    <SelectItem value="email_thread">Email Thread</SelectItem>
                    <SelectItem value="signed_agreement">Signed Agreement</SelectItem>
                    <SelectItem value="payment_proof">Payment Proof</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStage(null)}>Cancel</Button>
            <Button onClick={handleSaveStage}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
