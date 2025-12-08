import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6', // gray-100
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  header: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1F2937', // gray-800
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter',
    color: '#4B5563', // gray-600
  },
  value: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: 'medium',
    color: '#1F2937', // gray-800
  },
  riskScore: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#16A34A', // green-700
  },
  identityScore: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#16A34A', // green-700
  },
});

const RiskScoreBlock = ({ summary }) => (
  <View style={styles.container}>
    <Text style={styles.header}>Summary of Findings</Text>
    <View style={styles.grid}>
      <View style={styles.gridItem}>
        <Text style={styles.label}>Renter Risk Score</Text>
        <Text style={styles.riskScore}>{summary.riskScore}</Text>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.label}>Identity Confidence Score</Text>
        <Text style={styles.identityScore}>{summary.identityConfidence}</Text>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.label}>Incidents Found</Text>
        <Text style={styles.value}>{summary.incidents}</Text>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.label}>Disputes Found</Text>
        <Text style={styles.value}>{summary.disputes}</Text>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.label}>Open Balances</Text>
        <Text style={styles.value}>{summary.openBalances}</Text>
      </View>
      <View style={styles.gridItem}>
        <Text style={styles.label}>Fraud Signals</Text>
        <Text style={styles.value}>{summary.fraudSignals}</Text>
      </View>
    </View>
  </View>
);

export default RiskScoreBlock;