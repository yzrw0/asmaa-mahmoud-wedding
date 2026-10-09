"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const cleanText = (max: number) => z.string().trim().min(1, "Please complete this field.").max(max, `Please keep this under ${max} characters.`);

const messageSchema = z.object({
  guestName: cleanText(100),
  message: cleanText(1200),
});

function supabaseServer() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
}

function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please review the details and try again.";
}

export async function submitMessage(_: FormState, formData: FormData): Promise<FormState> {
  if (String(formData.get("website") ?? "").trim()) {
    return { status: "success", message: "Your private note has been received." };
  }

  const parsed = messageSchema.safeParse({
    guestName: formData.get("guestName"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { status: "error", message: firstError(parsed.error) };

  const supabase = supabaseServer();
  if (!supabase) return { status: "error", message: "Messages are not connected yet. Please try again later." };

  const { error } = await supabase.from("wedding_messages").insert({
    guest_name: parsed.data.guestName,
    message: parsed.data.message,
  });
  if (error) {
    console.error("Private message submission failed", error.code);
    return { status: "error", message: "We could not save your note. Please try again in a moment." };
  }
  return { status: "success", message: "Your private note is safely on its way to Asmaa & Mahmoud." };
}
