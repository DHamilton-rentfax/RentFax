'use client';

import {
  useEffect,
  useState
} from 'react';

type SubOrg = {
  id: string;
  orgName: string
};

export default function PartnerDashboard() {
  const [subs, setSubs] = useState < SubOrg[] > ([]);
  const partnerId = 'demo-partner'; // TODO: from auth

  useEffect(() => {
    fetch(`/api/partners/${partnerId}/suborgs/list`)
      .then(r => r.json())
      .then(setSubs);
  }, []);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Partner Dashboard</h1>
      {subs.map(s => (
        <div key={s.id} className='border p-2 mb-2 rounded'>
          {s.orgName}
        </div>
      ))}
    </div>
  );
}