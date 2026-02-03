
export type BuildingType = 'Residential' | 'Commercial' | 'Industrial';

export interface ProjectBrief {
  siteAddress: string;
  city: string;
  buildingType: BuildingType;
  builtUpArea: number; // sq ft
  unit: 'sqft' | 'sqm';
  floors: number;
  occupancyType: string;
  occupancyDensity: number; // persons per 100 sqft
  operatingHours: string;
  targetBudget: number; // INR
  targetTimeline: string;
  clientName: string;
  contractorName: string;
  performanceExpectations: string;
}

export interface DesignInputs {
  cadReference: string;
  mechanicalLayoutStatus: 'Pending' | 'In Progress' | 'Completed';
  electricalLoadKW: number;
  totalCoolingLoadTR: number;
  designAssumptions: string;
}

export interface Equipment {
  id: string;
  category: string;
  specification: string;
  capacity: number; // in TR or relevant unit
  capacityUnit: string;
  quantity: number;
  supplier: string;
  unitPrice: number;
  warrantyYears: number;
  efficiencyValue: number; // COP/EER
  efficiencyType: 'COP' | 'EER' | 'IPLV';
  leadTimeWeeks: number;
  maintenanceNotes: string;
  origin: 'Local' | 'Imported';
}

export interface ComplianceStatus {
  nbcCompliant: boolean;
  ecbcCompliant: boolean;
  fireNocStatus: 'Applied' | 'Received' | 'Not Required' | 'Pending';
  moefClearance: boolean;
  refrigerantType: string;
  municipalApproval: string;
}

export enum LeakCategory {
  DESIGN = 'Design-driven',
  SPECIFICATION = 'Specification-driven',
  PROCUREMENT = 'Procurement-driven',
  EXECUTION = 'Execution-driven'
}

export interface CashLeak {
  category: LeakCategory;
  description: string;
  impactAmount: number;
  justification: string;
}

export interface OptimizationSuggestion {
  title: string;
  basis: string;
  costImpact: number;
  energyImpact: string;
  complianceImpact: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ProjectState {
  brief: ProjectBrief | null;
  design: DesignInputs | null;
  inventory: Equipment[];
  compliance: ComplianceStatus | null;
}
