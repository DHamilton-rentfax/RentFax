export function fullReportUnlockedTemplate(data: any) {
  return `
    <h2>Full Report Unlocked</h2>
    <p>The full RentFAX report for <b>${data.renterName}</b> has been unlocked.</p>
    <p><a href="${process.env.APP_URL}/reports/${data.reportId}">
      View Full Report
    </a></p>
  `;
}
