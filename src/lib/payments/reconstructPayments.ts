type Payment = {
  amount: number;
  paidDate: string;
};

export function reconstructPayments(
  startDate: string,
  frequencyDays: number,
  amount: number,
  payments: Payment[]
) {
  const results = [];

  let due = new Date(startDate);

  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i];
    const paid = new Date(payment.paidDate);
    const daysLate = Math.max(
      0,
      Math.floor((paid.getTime() - due.getTime()) / 86400000)
    );

    results.push({
      dueDate: due.toISOString(),
      paidDate: paid.toISOString(),
      daysLate,
      amount: payment.amount,
      status: daysLate > 0 ? "paid_late" : "on_time"
    });

    due.setDate(due.getDate() + frequencyDays);
  }

  return results;
}