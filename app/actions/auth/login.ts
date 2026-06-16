'use server';

import { createClient } from '@/lib/supabase/server';

export type LoginResult =
    | {
        success: true;
    }
    | {
        success: false;
        error: string;
    };

export async function loginAction(
    email: string,
    password: string
): Promise<LoginResult> {
    try {
        const supabase = await createClient();

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: true,
        };
    } catch {
        return {
            success: false,
            error: 'Something went wrong',
        };
    }
}