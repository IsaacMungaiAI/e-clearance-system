import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AuditLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Audit Trail
        </CardTitle>
      </CardHeader>

      <CardContent>
        Audit records table
      </CardContent>
    </Card>
  );
}