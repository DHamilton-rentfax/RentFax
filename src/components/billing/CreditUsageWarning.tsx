
import { useState, useEffect } from 'react';
import { CreditWallet } from '@/types/credit-wallet';
import { getCreditWallet } from '@/lib/billing/getCreditWallet'; // Assuming this function exists
import { Alert } from '@/components/Alert'; // Assuming a generic Alert component

export function CreditUsageWarning({ userId, userType }) {
  const [wallet, setWallet] = useState<CreditWallet | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      const walletData = await getCreditWallet(userId, userType);
      setWallet(walletData);
    };
    fetchWallet();
  }, [userId, userType]);

  if (!wallet || !wallet.monthlyAllowance) return null;

  const usagePercentage = (wallet.balance / wallet.monthlyAllowance) * 100;

  if (usagePercentage > 90) {
    return <Alert severity="error">You have used over 90% of your monthly credits.</Alert>;
  } else if (usagePercentage > 70) {
    return <Alert severity="warning">You have used over 70% of your monthly credits.</Alert>;
  }

  return null;
}
