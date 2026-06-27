'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function applyForClearance() {
    try {
        const serverSupabase = await createServerClient();

        const { data: authUser } = await serverSupabase.auth.getUser();
        if (!authUser?.user) {
            return { success: false, message: 'Unauthorized' };
        }

        // First, get all active departments
        const { data: departments, error: deptError } = await serverSupabase
            .from('departments')
            .select('id')
            .eq('is_active', true);

        if (deptError || !departments) {
            return { success: false, message: 'Failed to load departments' };
        }

        // Check if student already has an active clearance request
        const { data: existingRequests, error: checkError } = await serverSupabase
            .from('clearance_requests')
            .select('id, status')
            .eq('student_id', authUser.user.id)
            .order('created_at', { ascending: false })
            .limit(1);

        if (checkError) {
            return { success: false, message: 'Failed to check existing requests' };
        }

        if (existingRequests && existingRequests.length > 0) {
            const lastRequest = existingRequests[0];
            if (lastRequest.status !== 'rejected') {
                return {
                    success: false,
                    message: `You already have a clearance request that is ${lastRequest.status}.`,
                };
            }
        }

        // Create clearance request
        const { data: newRequest, error: reqError } = await serverSupabase
            .from('clearance_requests')
            .insert({
                student_id: authUser.user.id,
                status: 'pending',
            })
            .select('id')
            .single();

        if (reqError || !newRequest) {
            console.error(reqError);
            return { success: false, message: 'Failed to create clearance request' };
        }

        // Now create a clearance step for each department
        const steps = departments.map((dept) => ({
            clearance_request_id: newRequest.id,
            department_id: dept.id,
            student_id: authUser.user.id,
            status: 'pending',
        }));

        const { error: stepsError } = await serverSupabase
            .from('clearance_steps')
            .insert(steps);

        if (stepsError) {
            console.error(stepsError);
            return { success: false, message: 'Failed to create clearance steps' };
        }

        revalidatePath('/dashboard/student');

        return { success: true, message: 'Clearance application submitted successfully!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to apply for clearance' };
    }
}
