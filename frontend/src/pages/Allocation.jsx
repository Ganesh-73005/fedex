import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Users, Zap, RefreshCcw, GripVertical, Clock, AlertTriangle,
  TrendingUp, Building2, Target, Shuffle, ArrowRight, ChevronRight,
  CheckCircle2, Settings, Info
} from 'lucide-react';
import { dcaList, cases } from '../data/mockData';
import { toast } from 'sonner';

const formatCurrency = (value) => {
  if (value >= 100000) return `\u20B9${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `\u20B9${(value / 1000).toFixed(1)}K`;
  return `\u20B9${value}`;
};

const SortableCaseCard = ({ caseData, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: caseData.case_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const now = new Date();
  const deadline = new Date(caseData.sla_deadline);
  const hoursLeft = (deadline - now) / (1000 * 60 * 60);
  const isUrgent = hoursLeft < 24;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg border bg-card hover:shadow-md transition-shadow ${
        isOverlay ? 'shadow-lg ring-2 ring-primary' : 'border-border'
      } ${isDragging ? 'z-50' : ''}`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-primary">{caseData.case_id}</span>
            {isUrgent && (
              <Badge variant="outline" className="text-xs text-destructive border-destructive/30">
                <Clock className="w-3 h-3 mr-1" />
                {Math.max(0, Math.round(hoursLeft))}h
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{caseData.customer.name}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-semibold">{formatCurrency(caseData.outstanding_amount)}</span>
            <Badge className={`text-xs ${
              caseData.priority === 'HIGH' ? 'bg-destructive/10 text-destructive border-destructive/20' :
              caseData.priority === 'MEDIUM' ? 'bg-warning/10 text-warning border-warning/20' :
              'bg-success/10 text-success border-success/20'
            }`} variant="outline">
              {caseData.priority}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

const DCALane = ({ dca, caseItems, onDrop, children }) => {
  const capacityUsed = (dca.active_cases / dca.capacity) * 100;
  const isOverCapacity = dca.active_cases > dca.capacity;
  const isNearCapacity = capacityUsed > 80;

  return (
    <Card className="card-enterprise h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">{dca.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dca.region_focus.join(', ')}
            </p>
          </div>
          <Badge variant={isOverCapacity ? 'destructive' : isNearCapacity ? 'secondary' : 'outline'} className="text-xs">
            {dca.active_cases}/{dca.capacity}
          </Badge>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Capacity</span>
            <span className={isOverCapacity ? 'text-destructive' : ''}>{capacityUsed.toFixed(0)}%</span>
          </div>
          <Progress 
            value={Math.min(100, capacityUsed)} 
            className={`h-1.5 ${isOverCapacity ? '[&>div]:bg-destructive' : isNearCapacity ? '[&>div]:bg-warning' : ''}`} 
          />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span>{(dca.recovery_rate_30d * 100).toFixed(0)}% recovery</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-primary" />
            <span>{(dca.sla_compliance * 100).toFixed(0)}% SLA</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ScrollArea className="h-[320px] pr-2">
          <div className="space-y-2">
            {children}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const Allocation = () => {
  const { cases: allCases, assignCaseToDCA } = useApp();
  const [simulationMode, setSimulationMode] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [allocationHistory, setAllocationHistory] = useState([]);

  // Get unassigned or allocatable cases
  const unassignedCases = useMemo(() => 
    allCases.filter(c => c.stage !== 'Closed').slice(0, 20),
    [allCases]
  );

  // Group cases by DCA
  const casesByDCA = useMemo(() => {
    const grouped = {};
    dcaList.forEach(dca => {
      grouped[dca.dca_id] = allCases.filter(c => c.assigned_dca_id === dca.dca_id && c.stage !== 'Closed').slice(0, 8);
    });
    return grouped;
  }, [allCases]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      // Find which DCA lane the case was dropped on
      const targetDCA = dcaList.find(d => casesByDCA[d.dca_id]?.some(c => c.case_id === over.id));
      if (targetDCA) {
        assignCaseToDCA(active.id, targetDCA.dca_id);
        setAllocationHistory(prev => [...prev, {
          caseId: active.id,
          dcaId: targetDCA.dca_id,
          dcaName: targetDCA.name,
          timestamp: new Date().toISOString()
        }]);
        toast.success(`Case ${active.id} assigned to ${targetDCA.name}`);
      }
    }
  };

  const runSimulation = () => {
    setSimulationMode(true);
    // Simulate AI allocation suggestions
    const suggestions = dcaList.map(dca => {
      const predictedRecovery = Math.floor(Math.random() * 50000) + 20000;
      const suggestedCases = Math.floor(Math.random() * 10) + 5;
      return {
        ...dca,
        predictedRecovery,
        suggestedCases,
        confidence: (0.7 + Math.random() * 0.25).toFixed(2)
      };
    });
    setSimulationResults(suggestions);
    toast.success('Simulation complete! Review suggested allocations.');
  };

  const applySimulation = () => {
    toast.success('Simulation results applied successfully');
    setSimulationMode(false);
    setSimulationResults(null);
  };

  const activeCaseData = activeId ? allCases.find(c => c.case_id === activeId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Allocation Workbench</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop cases to assign them to DCAs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" onClick={runSimulation}>
                  <Zap className="w-4 h-4" />
                  Simulate Allocation
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Run AI model to suggest optimal case distribution</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="sm" className="gap-2">
            <Shuffle className="w-4 h-4" />
            Auto-Balance
          </Button>
        </div>
      </div>

      {/* Simulation Results Banner */}
      {simulationMode && simulationResults && (
        <Card className="card-enterprise bg-primary-light border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Simulation Results</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    AI model suggests optimal distribution based on DCA performance and capacity
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={applySimulation}>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Apply
                </Button>
                <Button size="sm" variant="ghost" onClick={() => {
                  setSimulationMode(false);
                  setSimulationResults(null);
                }}>
                  Dismiss
                </Button>
              </div>
            </div>
            
            {/* Simulation Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
              {simulationResults.map(result => (
                <div key={result.dca_id} className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-xs font-medium truncate">{result.name}</p>
                  <p className="text-lg font-bold text-success mt-1">
                    {formatCurrency(result.predictedRecovery)}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">+{result.suggestedCases} cases</span>
                    <Badge variant="outline" className="text-xs">{(result.confidence * 100).toFixed(0)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allocation Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dcaList.map(dca => (
            <SortableContext
              key={dca.dca_id}
              items={casesByDCA[dca.dca_id]?.map(c => c.case_id) || []}
              strategy={verticalListSortingStrategy}
            >
              <DCALane dca={dca} caseItems={casesByDCA[dca.dca_id] || []}>
                {casesByDCA[dca.dca_id]?.map(c => (
                  <SortableCaseCard key={c.case_id} caseData={c} />
                ))}
                {(!casesByDCA[dca.dca_id] || casesByDCA[dca.dca_id].length === 0) && (
                  <div className="p-4 rounded-lg border-2 border-dashed border-border text-center">
                    <p className="text-sm text-muted-foreground">Drop cases here</p>
                  </div>
                )}
              </DCALane>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeCaseData ? (
            <SortableCaseCard caseData={activeCaseData} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Allocation History */}
      {allocationHistory.length > 0 && (
        <Card className="card-enterprise">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Allocation History</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setAllocationHistory([])}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allocationHistory.slice(-5).reverse().map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium text-primary">{item.caseId}</span>
                      <span className="text-muted-foreground"> assigned to </span>
                      <span className="font-medium">{item.dcaName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Allocation;
