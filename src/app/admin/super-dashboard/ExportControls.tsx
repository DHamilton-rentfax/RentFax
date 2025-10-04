'use client';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

interface ExportControlsProps {
  chartData: any[];
  funnelData: {
    renterVisits: number;
    companyVisits: number;
    renterConversions: number;
    companyConversions: number;
    renterTrials: number;
    companyTrials: number;
    renterPaid: number;
    companyPaid: number;
  };
}

const ExportControls: React.FC<ExportControlsProps> = ({ chartData, funnelData }) => {

  const handleExportCSV = () => {
    const csv = Papa.unparse({
      fields: ['Metric', 'Renter Funnel', 'Company Funnel'],
      data: [
        ['Visits', funnelData.renterVisits, funnelData.companyVisits],
        ['Conversions', funnelData.renterConversions, funnelData.companyConversions],
        ['Trials', funnelData.renterTrials, funnelData.companyTrials],
        ['Paid', funnelData.renterPaid, funnelData.companyPaid],
      ],
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'funnel-data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text('Funnel Metrics', 14, 20);
    (doc as any).autoTable({
      startY: 25,
      head: [['Metric', 'Renter Funnel', 'Company Funnel']],
      body: [
        ['Visits', funnelData.renterVisits, funnelData.companyVisits],
        ['Conversions', funnelData.renterConversions, funnelData.companyConversions],
        ['Trials', funnelData.renterTrials, funnelData.companyTrials],
        ['Paid', funnelData.renterPaid, funnelData.companyPaid],
      ],
    });

    doc.addPage();
    doc.text('Funnel Trends', 14, 20);

    // Chart data is more complex to render in a PDF.
    // For now, we will just include the raw data.
    (doc as any).autoTable({
      startY: 25,
      head: [['Week', 'Visits', 'Conversions', 'Trials', 'Paid']],
      body: chartData.map(d => [d.week, d.visits, d.conversions, d.trials, d.paid]),
    });

    doc.save('funnel-report.pdf');
  };

  return (
    <div className="flex justify-end space-x-2 mt-4">
      <button onClick={handleExportCSV} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
        Export CSV
      </button>
      <button onClick={handleExportPDF} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
        Export PDF
      </button>
    </div>
  );
};

export default ExportControls;
