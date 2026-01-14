import '@/lib/server-only';

import { getImpersonationHistory } from '@/app/actions/get-impersonation-history';

export default async function ImpersonationLogsPage() {
  const logs = await getImpersonationHistory(100);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Impersonation Audit Log</h1>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Admin</th>
              <th className="p-3">Organization</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Started</th>
              <th className="p-3">Exited</th>
              <th className="p-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-3">
                  <div>{log.adminName}</div>
                  <div className="font-mono text-xs text-gray-500">
                    {log.adminId}
                  </div>
                </td>
                <td className="p-3">
                  <div>{log.orgName}</div>
                  <div className="font-mono text-xs text-gray-500">
                    {log.orgId}
                  </div>
                </td>
                <td className="p-3">{log.reason || '—'}</td>
                <td className="p-3">
                  {new Date(log.startedAt).toLocaleString()}
                </td>
                <td className="p-3">
                  {log.exitedAt ? (
                    new Date(log.exitedAt).toLocaleString()
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </td>
                <td className="p-3 font-mono text-xs">{log.ip || '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No impersonation events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
