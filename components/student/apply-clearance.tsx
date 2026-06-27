'use client';

import { useState } from 'react';
import { applyForClearance } from '@/app/actions/student/apply-clearance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function ApplyForClearance() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    async function handleApply() {
        setLoading(true);
        setMessage(null);

        try {
            const result = await applyForClearance();

            if (result.success) {
                setMessage({ type: 'success', text: result.message });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (err) {
            setMessage({
                type: 'error',
                text: 'An unexpected error occurred.',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Apply for Clearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    Click below to submit a new clearance application. This will create clearance steps for all active departments.
                </p>

                {message && (
                    <Alert
                        variant={message.type === 'success' ? 'default' : 'destructive'}
                    >
                        {message.type === 'success' ? (
                            <CheckCircle className="h-4 w-4" />
                        ) : (
                            <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                            {message.type === 'success' ? 'Success' : 'Error'}
                        </AlertTitle>
                        <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                )}

                <Button onClick={handleApply} disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Applying...' : 'Apply for Clearance'}
                </Button>
            </CardContent>
        </Card>
    );
}
