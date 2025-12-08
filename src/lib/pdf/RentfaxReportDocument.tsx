import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import SectionHeader from './components/SectionHeader';
import RiskScoreBlock from './components/RiskScoreBlock';
import RenterDetailsBlock from './components/RenterDetailsBlock';
import TimelineBlock from './components/TimelineBlock';
import path from 'path';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: path.join(process.cwd(), 'src/lib/pdf/fonts/Inter-Regular.ttf'), fontWeight: 'normal' },
    { src: path.join(process.cwd(), 'src/lib/pdf/fonts/Inter-Medium.ttf'), fontWeight: 'medium' },
    { src: path.join(process.cwd(), 'src/lib/pdf/fonts/Inter-Bold.ttf'), fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#333333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 10,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportMeta: {
    fontSize: 9,
    color: '#666666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#F3F4F6',
    padding: 5,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  aiSummary: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    lineHeight: 1.5,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#E0E7FF',
    color: '#3730A3',
    padding: 8,
    borderRadius: 12,
    fontSize: 10,
    marginRight: 8,
    marginBottom: 8,
  }
});

const reportData = {
  summary: {
    riskScore: '732 (Low Risk)',
    identityConfidence: '815 (High Match)',
    incidents: '2',
    disputes: '1',
    openBalances: '$0',
    fraudSignals: '0 Detected',
  },
  profile: {
    name: 'Johnathan “John” Doe',
    email: 'john.doe@mail.com',
    phone: '(555) 555-1234',
    address: '123 Main St, Nashville, TN 37201',
    license: 'TN-X29837712',
    firstSeen: 'February 2023',
  },
  behavior: [
    { category: 'On-time payments', status: 'Consistent' },
    { category: 'Returned vehicles on time', status: 'Yes' },
    { category: 'Prior chargebacks', status: '0' },
    { category: 'Verified identity', status: 'Yes – KYC Match' },
    { category: 'Fraud signals detected', status: 'None' },
  ],
  incidents: [
    {
      title: 'Incident #1 — Damage Claim',
      date: 'August 2, 2024',
      company: 'Elite Rentals',
      status: 'Resolved – Paid in Full',
      summary: 'Minor cosmetic damage to passenger side door. Renter accepted liability and paid outstanding balance within 14 days.',
      amount: { claim: '$650', paid: '$650' },
      dispute: {
        statement: '“Damage occurred in a parking lot when we were away from the vehicle.”',
        outcome: '✔ Adjusted balance from $650 → $250 ✔ Renter paid remaining balance ✔ Dispute closed amicably',
      }
    },
    {
      title: 'Incident #2 — Late Return',
      date: 'September 12, 2023',
      company: 'West End Auto',
      status: 'Closed – Minor Infraction',
      summary: 'Vehicle returned 45 minutes late due to traffic congestion. Company reduced fee as courtesy.',
      amount: { claim: '$25', paid: '$25' },
    }
  ],
  identity: {
    score: '815 / 900',
    level: 'High Identity Match',
    signals: [
        'Name match', 'Address match', 'License verified', 'Phone owner match', 'Email age confidence', 'KYC-like document review'
    ],
    fraudSignals: '0 (No mismatched SSN histories, VOIP phone, burner emails, or flagged addresses.)'
  },
  aiSummary: [
    'John Doe demonstrates low renter risk with good historical behavior.',
    'He has:',
    '• Strong payment reliability',
    '• No history of fraud or chargebacks',
    '• Positive dispute resolution record',
    '• Verified identity across multiple data sources',
    '• Consistent address usage',
    'Based on patterns across 15,000+ renters, John falls in the top 20% of trustworthy renter profiles.'
  ],
  linkedAddresses: [
      '1. 123 Main St, Nashville TN (Primary – 2023–2025)',
      'No other addresses associated.'
  ],
  badges: [
      'Verified Identity', 'Paid-In-Full', 'No Fraud Indicators', 'Positive History'
  ]
};


const RentfaxReportDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.reportTitle}>RENTFAX — RENTER HISTORY REPORT</Text>
            <Text style={styles.reportMeta}>Report ID: RF-2025-002183 | Generated: Jan 3, 2025 | Prepared For: Elite Rentals, Nashville TN</Text>
        </View>

      <RiskScoreBlock summary={reportData.summary} />

      <SectionHeader title="RENTER PROFILE" />
      <RenterDetailsBlock profile={reportData.profile} />

      <SectionHeader title="RENTAL BEHAVIOR SUMMARY" />
       <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Category</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Status</Text></View>
        </View>
        {reportData.behavior.map((row, i) => (
            <View style={styles.tableRow} key={i}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{row.category}</Text></View>
                <View style={styles.tableCol}><Text style={[styles.tableCell, styles.bold]}>{row.status}</Text></View>
            </View>
        ))}
      </View>

      <SectionHeader title="INCIDENT HISTORY (Timeline)" />
      <TimelineBlock incidents={reportData.incidents} />

      <SectionHeader title="IDENTITY VERIFICATION RESULTS" />
      <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 5}}>Identity Confidence Score: {reportData.identity.score}</Text>
      <Text style={{fontSize: 10, marginBottom: 10}}>Level: {reportData.identity.level}</Text>
        <Text style={{fontSize: 10, fontWeight: 'bold', marginBottom: 5}}>Signals Used:</Text>
         {reportData.identity.signals.map((signal, i) => <Text key={i} style={{fontSize: 10, marginBottom: 2}}>✔ {signal}</Text>)}
       <Text style={{fontSize: 10, marginTop: 10}}>Fraud Signals Detected: {reportData.identity.fraudSignals}</Text>


      <View style={{marginTop: 20}}></View>
      <SectionHeader title="AI RISK SUMMARY (Generated automatically)" />
       <View style={styles.aiSummary}>
        {reportData.aiSummary.map((line, i) => <Text key={i} style={{marginBottom: 5}}>{line}</Text>)}
       </View>

      <SectionHeader title="LINKED ADDRESSES" />
        {reportData.linkedAddresses.map((line, i) => <Text key={i} style={{marginBottom: 5}}>{line}</Text>)}


      <View style={{marginTop: 20}}></View>
      <SectionHeader title="RENTFAX BADGES" />
        <View style={styles.badgeContainer}>
            {reportData.badges.map((badge, i) => <Text key={i} style={styles.badge}>{badge}</Text>)}
        </View>


      <Text style={styles.footer}>END OF REPORT - For questions, contact support@rentfax.io - © 2025 RentFAX — All Rights Reserved.</Text>
    </Page>
  </Document>
);

export default RentfaxReportDocument;