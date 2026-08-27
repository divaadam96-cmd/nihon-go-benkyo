// Edge Function: create-user
// Dipanggil dari panel Admin (Operator) untuk membuat akun Sensei/Siswa.
// Hanya user dengan role 'operator' yang boleh memanggil ini - dicek di
// sini pakai service-role client (tidak percaya begitu saja pada client),
// supaya "cuma Operator yang bisa bikin akun" benar-benar dipaksakan.

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

    // Ambil token user yang memanggil dari header Authorization.
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
      return json(corsHeaders, { error: "Hanya Operator yang boleh membuat akun." }, 403);
    }

    const body = await req.json();
    const { email, password, full_name, role } = body || {};

    if (!email || !password || !full_name || !["sensei", "siswa"].includes(role)) {
      return json(
        corsHeaders,
        { error: "Data tidak lengkap. Perlu email, password, full_name, dan role (sensei/siswa)." },
        400,
      );
    }
    if (password.length < 6) {
      return json(corsHeaders, { error: "Password minimal 6 karakter." }, 400);
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created.user) {
      return json(corsHeaders, { error: createError?.message || "Gagal membuat user." }, 400);
    }

    const { error: profileError } = await admin.from("profiles").insert({
      id: created.user.id,
      full_name,
      email,
      role,
    });
    if (profileError) {
      // Rollback: jangan tinggalkan auth user tanpa profil.
      await admin.auth.admin.deleteUser(created.user.id);
      return json(corsHeaders, { error: profileError.message }, 400);
    }

    return json(corsHeaders, {
      id: created.user.id,
      email,
      full_name,
      role,
    });
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
