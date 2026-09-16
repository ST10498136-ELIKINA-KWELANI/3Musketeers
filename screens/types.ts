export interface CampusReport {
  report_id: string;
  timestamp: string;
  location: string;
  report_type: string;
  description: string;
  reporter_confidence?: number;
}

export interface Incident {
  incident_id: string;
  type: string;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  report_ids: string[];
  assigned_services: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'CONTROLLED' | 'RESOLVED';
  actions: string[];
}

export interface DecisionLogEntry {
  report_id: string;
  incident_id: string;
  relationship: 'NEW' | 'UPDATE' | 'DUPLICATE';
  severity: string;
  confidence: number;
  decision: string;
  service: string;
  status: string;
  concise_reason: string;
}

export interface ActionHistoryEntry {
  action_id: string;
  incident_id: string;
  action: string;
  service: string;
  timestamp: string;
  status: string;
}