import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, full_name, role, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name, role },
    });
    console.log("Data:", data);
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
    

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}