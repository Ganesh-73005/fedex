import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
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
  Search, Filter, LayoutGrid, LayoutList, MoreHorizontal, Download,
  UserPlus, Tag, RefreshCcw, Clock, AlertTriangle, FileText,
  ChevronLeft, ChevronRight, ExternalLink, X
} from 'lucide-react';
import { dcaList } from '../data/mockData';
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

const CasesList = () => {
  const {
    getFilteredCases,
    filters,
    updateFilters,
    resetFilters,
    viewMode,
    setViewMode,
    selectedCases,
    setSelectedCases,
    bulkAssignCases
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedDCA, setSelectedDCA] = useState('');
  const itemsPerPage = 15;

  const filteredCases = useMemo(() => getFilteredCases(), [getFilteredCases]);
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCases(paginatedCases.map(c => c.case_id));
    } else {
      setSelectedCases([]);
    }
  };

  const handleSelectCase = (caseId, checked) => {
    if (checked) {
      setSelectedCases([...selectedCases, caseId]);
    } else {
      setSelectedCases(selectedCases.filter(id => id !== caseId));
    }
  };

  const handleBulkAssign = () => {
    if (selectedDCA && selectedCases.length > 0) {
      bulkAssignCases(selectedCases, selectedDCA);
      toast.success(`${selectedCases.length} cases assigned successfully`);
      setAssignDialogOpen(false);
      setSelectedDCA('');
    }
  };

  const regions = ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad'];
  const stages = ['Notice Sent', 'First Contact', 'Negotiation', 'Settlement', 'Closed'];

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all' && v !== '').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Cases</h1>
          <p className="text-muted-foreground mt-1">
            {filteredCases.length} cases found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="card-enterprise">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search cases, customers..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Filter Selects */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filters.aging} onValueChange={(v) => updateFilters({ aging: v })}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Aging" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Aging</SelectItem>
                  <SelectItem value="0-30">0-30 days</SelectItem>
                  <SelectItem value="31-60">31-60 days</SelectItem>
                  <SelectItem value="61-90">61-90 days</SelectItem>
                  <SelectItem value="91-">90+ days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.region} onValueChange={(v) => updateFilters({ region: v })}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.dca} onValueChange={(v) => updateFilters({ dca: v })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="DCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All DCAs</SelectItem>
                  {dcaList.map(d => (
                    <SelectItem key={d.dca_id} value={d.dca_id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(v) => updateFilters({ priority: v })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.stage} onValueChange={(v) => updateFilters({ stage: v })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.slaStatus} onValueChange={(v) => updateFilters({ slaStatus: v })}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="SLA Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SLA</SelectItem>
                  <SelectItem value="breached">Breached</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="ok">On Track</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-muted-foreground">
                  <X className="w-4 h-4" />
                  Clear ({activeFiltersCount})
                </Button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('card')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedCases.length > 0 && (
        <Card className="card-enterprise bg-primary-light border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCases.length} case(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setAssignDialogOpen(true)} className="gap-1">
                  <UserPlus className="w-4 h-4" />
                  Assign to DCA
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Tag className="w-4 h-4" />
                  Add Tag
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedCases([])}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card className="card-enterprise overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-enterprise">
              <thead>
                <tr>
                  <th className="w-12">
                    <Checkbox
                      checked={selectedCases.length === paginatedCases.length && paginatedCases.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th>Case ID</th>
                  <th>Customer</th>
                  <th className="text-right">Outstanding</th>
                  <th className="text-center">Aging</th>
                  <th className="text-center">Priority</th>
                  <th>Assigned DCA</th>
                  <th>Stage</th>
                  <th className="text-center">SLA Status</th>
                  <th>Last Activity</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedCases.map((c) => {
                  const slaInfo = getSLAStatus(c.sla_deadline);
                  return (
                    <tr key={c.case_id}>
                      <td>
                        <Checkbox
                          checked={selectedCases.includes(c.case_id)}
                          onCheckedChange={(checked) => handleSelectCase(c.case_id, checked)}
                        />
                      </td>
                      <td>
                        <Link to={`/cases/${c.case_id}`} className="font-medium text-primary hover:underline">
                          {c.case_id}
                        </Link>
                        {c.dispute_flag && (
                          <Badge variant="outline" className="ml-2 text-xs text-warning border-warning/30">
                            Dispute
                          </Badge>
                        )}
                      </td>
                      <td>
                        <div>
                          <p className="font-medium truncate max-w-[180px]">{c.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{c.customer.region}</p>
                        </div>
                      </td>
                      <td className="text-right font-medium">
                        {formatCurrency(c.outstanding_amount)}
                      </td>
                      <td className="text-center">
                        <Badge variant="outline" className={`${
                          c.aging_days > 90 ? 'text-destructive border-destructive/30' :
                          c.aging_days > 60 ? 'text-warning border-warning/30' :
                          'text-muted-foreground'
                        }`}>
                          {c.aging_days}d
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge className={`${
                          c.priority === 'HIGH' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          c.priority === 'MEDIUM' ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-success/10 text-success border-success/20'
                        }`} variant="outline">
                          {c.priority}
                        </Badge>
                      </td>
                      <td className="text-sm truncate max-w-[150px]">{c.assigned_dca}</td>
                      <td>
                        <Badge variant="secondary" className="text-xs">
                          {c.stage}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className={`cursor-help ${
                                slaInfo.color === 'destructive' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                slaInfo.color === 'warning' ? 'bg-warning/10 text-warning border-warning/20' :
                                'bg-success/10 text-success border-success/20'
                              }`} variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                {slaInfo.label}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Deadline: {formatDate(c.sla_deadline)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="text-xs text-muted-foreground">
                        {formatDate(c.last_activity_at)}
                      </td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link to={`/cases/${c.case_id}`} className="cursor-pointer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Reassign DCA
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              Add Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCases.map((c) => {
            const slaInfo = getSLAStatus(c.sla_deadline);
            return (
              <Link key={c.case_id} to={`/cases/${c.case_id}`}>
                <Card className="card-enterprise hover:shadow-card-hover transition-shadow cursor-pointer relative overflow-hidden">
                  <div className={`priority-strip ${
                    c.priority === 'HIGH' ? 'priority-high' :
                    c.priority === 'MEDIUM' ? 'priority-medium' : 'priority-low'
                  }`} />
                  <CardContent className="p-4 pl-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-primary">{c.case_id}</p>
                        <p className="text-sm text-foreground truncate max-w-[200px]">
                          {c.customer.name}
                        </p>
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
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Outstanding</span>
                        <span className="font-semibold">{formatCurrency(c.outstanding_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Aging</span>
                        <span>{c.aging_days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stage</span>
                        <Badge variant="secondary" className="text-xs">{c.stage}</Badge>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {c.assigned_dca}
                      </span>
                      {c.dispute_flag && (
                        <Badge variant="outline" className="text-xs text-warning border-warning/30">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Dispute
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Cases to DCA</DialogTitle>
            <DialogDescription>
              When you reassign these cases, the previous DCAs will be notified and an override will be recorded.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedDCA} onValueChange={setSelectedDCA}>
              <SelectTrigger>
                <SelectValue placeholder="Select a DCA" />
              </SelectTrigger>
              <SelectContent>
                {dcaList.map(d => (
                  <SelectItem key={d.dca_id} value={d.dca_id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{d.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {d.active_cases}/{d.capacity} cases
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkAssign} disabled={!selectedDCA}>Assign {selectedCases.length} Case(s)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CasesList;
