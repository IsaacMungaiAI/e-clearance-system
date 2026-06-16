'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
//import {supabase} from "@/lib/supabase/client";

const CreateUserSchema = z.object({
    email: z.string().email(),
    full_name: z.string().min(3),
    password: z.string().min(8),
    role: z.enum([
        'student',
        'officer_finance',
        'officer_library',
        'officer_hostel',
        'registrar',
    ]),
});

export async function createUserAction(formData: {
    email: string;
    full_name: string;
    password: string;
    role: string;
}) {
    try {

        // Use server-side Supabase client to read the current session from cookies
        const serverSupabase = await createServerClient();

        // Log start (never log the password)
        console.info('[createUserAction] start', {
            email: formData.email,
            full_name: formData.full_name,
            role: formData.role,
        });

        // Get authenticated user from the session (server client reads cookies)
        const { data: authUser } = await serverSupabase.auth.getUser();

        console.debug('[createUserAction] authUser fetched', {
            id: authUser?.user?.id ?? null,
        });

        if (!authUser?.user) {
            console.warn('[createUserAction] unauthorized attempt to create user');
            return { success: false, message: 'Unauthorized' };
        }

        // Authorization check (IMPORTANT: do NOT trust client role)
        const { data: profile } = await serverSupabase
            .from('profiles')
            .select('role')
            .eq('id', authUser.user.id)
            .single();

        console.debug('[createUserAction] profile lookup', { role: profile?.role });

        if (profile?.role !== 'registrar') {
            console.warn('[createUserAction] forbidden: user role is not registrar', {
                requesterRole: profile?.role,
                requesterId: authUser.user.id,
            });

            return {
                success: false,
                message: 'You are not allowed to create users',
            };
        }

        // Validate input
        const validated = CreateUserSchema.parse(formData);

        console.debug('[createUserAction] input validated', {
            email: validated.email,
            full_name: validated.full_name,
            role: validated.role,
        });

        // Create auth user (THIS replaces password hashing)
        console.info('[createUserAction] creating user', { email: validated.email });

        const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
            email: validated.email,
            password: validated.password,
            email_confirm: true,
            user_metadata: {
                full_name: validated.full_name,
                role: validated.role,
            },
        });

        if (error) {
            console.error('[createUserAction] supabase createUser error', error.message);

            return {
                success: false,
                message: error.message,
            };
        }

        console.info('[createUserAction] user created', { id: newUser.user.id });

        revalidatePath('/registrar/users');

        return {
            success: true,
            message: 'User created successfully',
            data: {
                id: newUser.user.id,
            },
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: 'Failed to create user',
        };
    }
}