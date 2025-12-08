import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  item: {
    marginBottom: 15,
  },
  header: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#1F2937', // gray-800
    marginBottom: 5,
  },
  meta: {
    fontSize: 10,
    fontFamily: 'Inter',
    color: '#4B5563', // gray-600
    marginBottom: 8,
  },
  summary: {
    fontSize: 10,
    fontFamily: 'Inter',
    color: '#374151', // gray-700
    lineHeight: 1.4,
  },
  amountContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
  },
  disputeContainer: {
    marginTop: 10,
    backgroundColor: '#F3F4F6', // gray-100
    padding: 10,
    borderRadius: 4,
  },
  disputeHeader: {
    fontSize: 11,
    fontFamily: 'Inter',
    fontWeight: 'medium',
    marginBottom: 5,
  },
  disputeText: {
    fontSize: 10,
    fontFamily: 'Inter',
    lineHeight: 1.4,
    color: '#4B5563', // gray-600
  },
});

const TimelineBlock = ({ incidents }) => (
  <View>
    {incidents.map((item, index) => (
      <View key={index} style={styles.item}>
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.meta}>Date: {item.date} | Company: {item.company} | Status: {item.status}</Text>
        <Text style={styles.summary}>{item.summary}</Text>

        {item.amount && (
          <View style={styles.amountContainer}>
            <Text>Claim: {item.amount.claim}</Text>
            <Text>Paid: {item.amount.paid}</Text>
          </View>
        )}

        {item.dispute && (
          <View style={styles.disputeContainer}>
            <Text style={styles.disputeHeader}>Dispute Details</Text>
            <Text style={styles.disputeText}>Renter Statement: {item.dispute.statement}</Text>
            <Text style={styles.disputeText}>Outcome: {item.dispute.outcome}</Text>
          </View>
        )}
      </View>
    ))}
  </View>
);

export default TimelineBlock;