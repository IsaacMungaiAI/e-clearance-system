'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { loginAction } from '@/app/actions/auth/login';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const result = await loginAction(
            email,
            password
        );

        setLoading(false);

        if (!result.success) {
            setError(result.error);
            return;
        }

        router.push('/dashboard');
        router.refresh();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        Clearance System
                    </CardTitle>

                    <CardDescription>
                        Sign in to continue
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <Label>Email</Label>

                            <Input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div>
                            <Label>Password</Label>

                            <Input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}

                            Sign In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}