// Edge Function: delete-user
// Dipanggil dari panel Admin (Operator) untuk menghapus akun Sensei/Siswa.
// Hapus dilakukan lewat Supabase Auth Admin API - baris di profiles,
// srs_progress, dan activity_log ikut terhapus otomatis lewat
// "on delete cascade" di skema, jadi tidak perlu dihapus manual di sini.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Hanya domain situs sendiri yang boleh memanggil function ini lewat
// browser (bukan "*") - membatasi permukaan serang kalau token seseorang
// bocor, request dari domain lain tetap diblokir oleh browser sebelum
// sampai ke sini.
const ALLOWED_ORIGINS = [
  "https://divaadam96-cmd.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
];

function corsHeadersFor(req: Request) {
  const origin = req.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace("Bearer ", "");
    if (!jwt) {
      return json(corsHeaders, { error: "Tidak ada token." }, 401);
    }

    const { data: callerData, error: callerError } = await admin.auth.getUser(jwt);
    if (callerError || !callerData.user) {
      return json(corsHeaders, { error: "Token tidak valid." }, 401);
    }

    const { data: callerProfile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", callerData.user.id)
      .single();

    if (!callerProfile || callerProfile.role !== "operator") {
      return json(corsHeaders, { error: "Hanya Operator yang boleh menghapus akun." }, 403);
    }

    const body = await req.json();
    const { user_id } = body || {};
    if (!user_id) {
      return json(corsHeaders, { error: "user_id wajib diisi." }, 400);
    }
    if (user_id === callerData.user.id) {
      return json(corsHeaders, { error: "Tidak bisa menghapus akun sendiri." }, 400);
    }

    const { data: targetProfile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user_id)
      .single();
    if (!targetProfile) {
      return json(corsHeaders, { error: "Akun tidak ditemukan." }, 404);
    }
    if (targetProfile.role === "operator") {
      return json(corsHeaders, { error: "Akun Operator tidak bisa dihapus lewat panel ini." }, 403);
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(user_id);
    if (deleteError) {
      return json(corsHeaders, { error: deleteError.message }, 400);
    }

    return json(corsHeaders, { success: true });
  } catch (err) {
    return json(corsHeaders, { error: String(err) }, 500);
  }
});

function json(corsHeaders: Record<string, string>, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
