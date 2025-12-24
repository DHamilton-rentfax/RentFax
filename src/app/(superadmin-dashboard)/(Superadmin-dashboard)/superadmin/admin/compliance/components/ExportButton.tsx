'use client';

import ExcelJS from 'exceljs';

export default function ExportButton({ banners }: { banners: any[] }) {
  const handleExport = async () => {
    const rows = [];

    banners.forEach((b) => {
      b.acknowledgments?.forEach((ack: any) => {
        rows.push({
          Policy: b.title,
          Audience: b.audience,
          Role: ack.role,
          UserID: ack.userId,
          AcknowledgedAt: ack.acknowledgedAt?.toDate?.().toISOString?.() || '',
        });
      });
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Compliance Logs');

    worksheet.columns = [
      { header: 'Policy', key: 'Policy', width: 30 },
      { header: 'Audience', key: 'Audience', width: 20 },
      { header: 'Role', key: 'Role', width: 20 },
      { header: 'UserID', key: 'UserID', width: 30 },
      { header: 'AcknowledgedAt', key: 'AcknowledgedAt', width: 30 },
    ];

    worksheet.addRows(rows);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RentFAX_Compliance_Report_${new Date().toISOString()}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-[#1A2540] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#2d3c66] transition"
    >
      Download Compliance Report
    </button>
  );
}
