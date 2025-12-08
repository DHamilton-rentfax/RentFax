import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
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
});

const RenterDetailsBlock = ({ profile }) => (
  <View>
    <View style={styles.grid}>
        <View style={styles.gridItem}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{profile.name}</Text>
        </View>
        <View style={styles.gridItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile.email}</Text>
        </View>
        <View style={styles.gridItem}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{profile.phone}</Text>
        </View>
        <View style={styles.gridItem}>
            <Text style={styles.label}>Current Address</Text>
            <Text style={styles.value}>{profile.address}</Text>
        </View>
        <View style={styles.gridItem}>
            <Text style={styles.label}>Driver License</Text>
            <Text style={styles.value}>{profile.license}</Text>
        </View>
         <View style={styles.gridItem}>
            <Text style={styles.label}>Date First Seen</Text>
            <Text style={styles.value}>{profile.firstSeen}</Text>
        </View>
    </View>
  </View>
);

export default RenterDetailsBlock;