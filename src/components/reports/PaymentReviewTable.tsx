"use client";

export default function PaymentReviewTable({ payments, onConfirm }: any) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Review Payment History</h3>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Due</th>
            <th>Paid</th>
            <th>Days Late</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p: any, i: number) => (
            <tr key={i}>
              <td>{p.dueDate.slice(0, 10)}</td>
              <td>{p.paidDate?.slice(0, 10) || "—"}</td>
              <td>{p.daysLate}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="mt-4 bg-black text-white px-4 py-2"
        onClick={onConfirm}
      >
        Confirm Payments
      </button>
    </div>
  );
}