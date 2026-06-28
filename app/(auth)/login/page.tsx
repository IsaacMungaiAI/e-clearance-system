'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    Lock,
    Mail,
    Eye,
    EyeOff,
    ShieldCheck,
} from 'lucide-react';

import { loginAction } from '@/app/actions/auth/login';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] =
        useState('');
    const [loading, setLoading] =
        useState(false);

    const [showPassword, setShowPassword] =
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
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">

            {/* Left Side */}
            <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-500 text-white p-16">

                <div className="max-w-md space-y-8">

                    <div className="flex items-center gap-3">

                        <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center">

                            <ShieldCheck className="h-8 w-8" />

                        </div>

                        <div>
                            <h1 className="text-3xl font-bold">
                                Clearance System
                            </h1>

                            <p className="text-green-100">
                                Secure Digital Clearance Platform
                            </p>
                        </div>

                    </div>

                    <p className="text-lg leading-8 text-green-50">
                        Streamline academic and administrative clearance
                        through a secure, centralized digital platform.
                    </p>

                    <div className="space-y-3 text-green-100">

                        <div>
                            ✓ Secure Authentication
                        </div>

                        <div>
                            ✓ Real-time Clearance Tracking
                        </div>

                        <div>
                            ✓ Department Approvals
                        </div>

                        <div>
                            ✓ Instant Notifications
                        </div>

                    </div>

                </div>

            </div>

            {/* Right Side */}
            <div className="flex items-center justify-center p-6">

                <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl">

                    <CardContent className="p-8">

                        <div className="space-y-2 text-center mb-8">

                            <h2 className="text-3xl font-bold">
                                Welcome Back
                            </h2>

                            <p className="text-muted-foreground">
                                Sign in to your account
                            </p>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            <div className="space-y-2">

                                <Label>Email Address</Label>

                                <div className="relative">

                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        className="pl-10 h-11"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="space-y-2">

                                <Label>Password</Label>

                                <div className="relative">

                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                    <Input
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="pl-10 pr-10 h-11"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>

                                </div>

                            </div>

                            <div className="flex justify-between text-sm">

                                <label className="flex items-center gap-2">

                                    <input
                                        type="checkbox"
                                        className="rounded"
                                    />

                                    Remember me

                                </label>

                                <button
                                    type="button"
                                    className="text-emerald-600 hover:underline"
                                >
                                    Forgot Password?
                                </button>

                            </div>

                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 text-base bg-emerald-600 hover:bg-emerald-700"
                                disabled={loading}
                            >
                                {loading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}

                                {loading
                                    ? 'Signing In...'
                                    : 'Sign In'}
                            </Button>

                        </form>

                        <div className="mt-8 text-center text-xs text-muted-foreground">

                            © 2026 Clearance Management System

                        </div>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
}