import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderBottomColor: '#333333',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#333333',
  },
});

const SectionHeader = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default SectionHeader;