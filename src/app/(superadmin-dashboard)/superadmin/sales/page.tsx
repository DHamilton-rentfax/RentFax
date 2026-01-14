'use client';

import { BarChart3, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/contexts/ModalContext';

export default function SalesDashboard() {
  const { openModal } = useModal();

  const handleExport = () => {
    // TODO: Wire to analytics export API
    console.log('Export analytics');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="text-blue-600" />
          Sales & Revenue
        </h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => openModal('adminAnalyticsFilter')}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
        Sales analytics components were consolidated during refactor.
        <br />
        This dashboard will be rebuilt on top of the unified analytics engine.
      </div>
    </div>
  );
}
