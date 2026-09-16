import { CampusReport, Incident, DecisionLogEntry, ActionHistoryEntry } from './types';

// Utility for basic string similarity (useful for location/type correlation)
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.75;
  return 0.0;
}

export class AgentEngine {
  private incidents: Incident[] = [];
  public decisionLogs: DecisionLogEntry[] = [];
  public actionHistory: ActionHistoryEntry[] = [];

  // Correlates incoming reports with active incidents without shared IDs
  private findMatchingIncident(report: CampusReport): Incident | undefined {
    return this.incidents.find((incident) => {
      if (incident.status === 'RESOLVED') return false;

      const locationScore = calculateSimilarity(report.location, incident.location);
      const typeScore = calculateSimilarity(report.report_type, incident.type);

      // Match if location is high-confidence, or same general area + report type
      return locationScore > 0.7 || (locationScore > 0.4 && typeScore > 0.4);
    });
  }

  public processReport(report: CampusReport): DecisionLogEntry {
    let matchedIncident = this.findMatchingIncident(report);
    let relationship: 'NEW' | 'UPDATE' | 'DUPLICATE' = 'UPDATE';
    let incidentId = '';

    if (!matchedIncident) {
      // 1. OBSERVE & CREATE
      relationship = 'NEW';
      incidentId = `INC-${Date.now().toString().slice(-4)}`;
      matchedIncident = {
        incident_id: incidentId,
        type: report.report_type || 'Unclassified Hazard',
        location: report.location,
        severity: 'LOW',
        confidence: report.reporter_confidence || 0.6,
        report_ids: [report.report_id],
        assigned_services: [],
        status: 'OPEN',
        actions: [],
      };
      this.incidents.push(matchedIncident);
    } else {
      // 2. CORRELATE & REASSESS
      incidentId = matchedIncident.incident_id;
      if (matchedIncident.report_ids.includes(report.report_id)) {
        relationship = 'DUPLICATE';
      } else {
        matchedIncident.report_ids.push(report.report_id);
      }
      
      // Accumulating report evidence boosts confidence
      matchedIncident.confidence = Math.min(1.0, matchedIncident.confidence + 0.15);
    }

    // 3. DECIDE & ACT (Prevent duplicate dispatches)
    let decision = 'MONITOR';
    let assignedService = 'NONE';
    
    if (matchedIncident.report_ids.length >= 3 && matchedIncident.severity !== 'HIGH') {
      matchedIncident.severity = 'HIGH';
      matchedIncident.status = 'IN_PROGRESS';
      decision = 'DISPATCH_SECURITY';
      assignedService = 'Campus Security';
      
      if (!matchedIncident.assigned_services.includes(assignedService)) {
        matchedIncident.assigned_services.push(assignedService);
        this.actionHistory.push({
          action_id: `ACT-${Date.now().toString().slice(-4)}`,
          incident_id: incidentId,
          action: 'Dispatch Security Patrol',
          service: assignedService,
          timestamp: new Date().toLocaleTimeString(),
          status: 'DISPATCHED',
        });
      }
    }

    // 4. RECORD
    const logEntry: DecisionLogEntry = {
      report_id: report.report_id,
      incident_id: incidentId,
      relationship,
      severity: matchedIncident.severity,
      confidence: Number(matchedIncident.confidence.toFixed(2)),
      decision,
      service: assignedService,
      status: matchedIncident.status,
      concise_reason: `Report matched via ${relationship.toLowerCase()} evidence at location '${report.location}'.`,
    };

    this.decisionLogs.push(logEntry);
    return logEntry;
  }

  public getIncidents(): Incident[] {
    return this.incidents;
  }
}