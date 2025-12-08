import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

export function RentFAXReportPDF({ renter, timeline, ai, scores }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <Text style={styles.header}>RentFAX Renter Report</Text>

        {/* EXECUTIVE SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text>{ai.executiveSummary}</Text>
        </View>

        {/* RISK SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Summary</Text>
          <Text>{ai.riskSummary}</Text>
        </View>

        {/* BEHAVIOR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Behavior Overview</Text>
          <Text>{ai.behaviorSummary}</Text>
        </View>

        {/* PAYMENTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Reliability</Text>
          <Text>{ai.paymentSummary}</Text>
        </View>

        {/* IDENTITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity Confidence</Text>
          <Text>{ai.identitySummary}</Text>
        </View>

        {/* FLAGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Flags</Text>
          {ai.flags?.length > 0
            ? ai.flags.map((f: string, i: number) => (
                <Text key={i}>• {f}</Text>
              ))
            : <Text>No major flags detected.</Text>}
        </View>

        {/* RECOMMENDATIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {ai.recommendations?.map((item: string, i: number) => (
            <Text key={i}>• {item}</Text>
          ))}
        </View>

      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Inter",
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
  },
});
