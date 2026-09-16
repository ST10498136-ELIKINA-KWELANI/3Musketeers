import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { AgentEngine } from './AgentEngine';
import { CampusReport, DecisionLogEntry } from './types';
import styles from "../css/styles";

const engine = new AgentEngine();

export default function Dashboard() {
  const [currentReport, setCurrentReport] = useState<CampusReport | null>(null);
  const [decisionLogs, setDecisionLogs] = useState<DecisionLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'decision' | 'incident' | 'action'>('decision');

  // Trigger simulated incoming report stream
  const handleIngestReport = () => {
    const mockReport: CampusReport = {
      report_id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString(),
      location: 'Science Lab B',
      report_type: 'Chemical Spill',
      description: 'Minor solvent leak detected near station 4.',
      reporter_confidence: 0.8,
    };

    setCurrentReport(mockReport);
    engine.processReport(mockReport);
    setDecisionLogs([...engine.decisionLogs]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Campus Crisis Agent Dashboard</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleIngestReport}>
        <Text style={styles.buttonText}>+ Ingest Incoming Report Stream</Text>
      </TouchableOpacity>

      {/* VIEW 1: Incoming Report View */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Incoming Report (Currently Processing)</Text>
        {currentReport ? (
          <Text style={styles.reportText}>
            [{currentReport.report_id}] {currentReport.report_type} @ {currentReport.location} - "{currentReport.description}"
          </Text>
        ) : (
          <Text style={styles.placeholderText}>Waiting for incoming report stream...</Text>
        )}
      </View>

      {/* TAB NAVIGATION FOR VIEWS 2, 3, & 4 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('decision')}>
          <Text style={styles.tabText}>2. Decision Log</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('incident')}>
          <Text style={styles.tabText}>3. Incident Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('action')}>
          <Text style={styles.tabText}>4. Action History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea}>
        {/* VIEW 2: Decision Log View */}
        {activeTab === 'decision' && (
          <View>
            {decisionLogs.map((log, idx) => (
              <View key={idx} style={styles.logRow}>
                <Text style={styles.boldText}>Report: {log.report_id} ➔ Incident: {log.incident_id}</Text>
                <Text>Rel: {log.relationship} | Sev: {log.severity} | Conf: {log.confidence}</Text>
                <Text>Decision: {log.decision} ({log.service})</Text>
                <Text style={styles.reasonText}>Reason: {log.concise_reason}</Text>
              </View>
            ))}
          </View>
        )}

        {/* VIEW 3: Incident Summary View */}
        {activeTab === 'incident' && (
          <View>
            {engine.getIncidents().map((inc) => (
              <View key={inc.incident_id} style={styles.logRow}>
                <Text style={styles.boldText}>{inc.incident_id} [{inc.status}] - {inc.type}</Text>
                <Text>Location: {inc.location} | Severity: {inc.severity}</Text>
                <Text>Reports Linked: {inc.report_ids.join(', ')}</Text>
                <Text>Assigned Services: {inc.assigned_services.join(', ') || 'None'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* VIEW 4: Action History View */}
        {activeTab === 'action' && (
          <View>
            {engine.actionHistory.map((act) => (
              <View key={act.action_id} style={styles.logRow}>
                <Text style={styles.boldText}>{act.action} ({act.service})</Text>
                <Text>Incident: {act.incident_id} | Status: {act.status}</Text>
                <Text style={styles.reasonText}>Time: {act.timestamp}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
