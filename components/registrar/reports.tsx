import { Button } from '@/components/ui/button';

export function Reports() {
  return (
    <div className="space-y-3">
      <Button>
        Export Students CSV
      </Button>

      <Button>
        Export Clearances CSV
      </Button>

      <Button>
        Generate PDF Report
      </Button>
    </div>
  );
}