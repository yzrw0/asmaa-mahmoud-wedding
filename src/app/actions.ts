"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const cleanText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, "Please complete this field.")
    .max(max, `Please keep this under ${max} characters.`);

const messageSchema = z.object({
  guestName: cleanText(100),
  message: cleanText(1200),
});

function supabaseServer() {
  const url =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

function firstError(error: z.ZodError) {
  return (
    error.issues[0]?.message ??
    "Please review the details and try again."
  );
}

export async function submitMessage(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  if (String(formData.get("website") ?? "").trim()) {
    return {
      status: "success",
      message: "Your private note has been received.",
    };
  }

  const parsed = messageSchema.safeParse({
    guestName: formData.get("guestName"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: firstError(parsed.error),
    };
  }

  const supabase = supabaseServer();

  if (!supabase) {
    console.error(
      "Private message submission is missing Supabase URL or publishable key configuration."
    );

    return {
      status: "error",
      message:
        "We could not send your message right now. Please try again shortly.",
    };
  }

  const { error } = await supabase
    .from("wedding_messages")
    .insert({
      guest_name: parsed.data.guestName,
      message: parsed.data.message,
    });

  if (error) {
    console.error("Private message submission failed", {
      code: error.code,
      message: error.message,
    });

    return {
      status: "error",
      message:
        "Your message could not be saved. Please try again in a moment.",
    };
  }

  try {
    const notificationEmail =
      process.env.WEDDING_NOTIFICATION_EMAIL;

    if (!process.env.RESEND_API_KEY) {
      console.error(
        "Wedding email notification skipped: RESEND_API_KEY is missing."
      );
    } else if (!notificationEmail) {
      console.error(
        "Wedding email notification skipped: WEDDING_NOTIFICATION_EMAIL is missing."
      );
    } else {
      const { error: emailError } = await resend.emails.send({
        from:
          "Mahmoud & Ásmaa Wedding <onboarding@resend.dev>",
        to: notificationEmail,
        subject: `New wedding message from ${parsed.data.guestName}`,
        text: [
          "New wedding message",
          "",
          `From: ${parsed.data.guestName}`,
          "",
          "Message:",
          parsed.data.message,
          "",
          `Received: ${new Date().toLocaleString("en-US", {
            timeZone: "Africa/Cairo",
          })}`,
        ].join("\n"),
      });

      if (emailError) {
        console.error(
          "Wedding email notification failed:",
          emailError
        );
      }
    }
  } catch (emailError) {
    console.error(
      "Wedding email notification failed:",
      emailError
    );
  }

  return {
    status: "success",
    message:
      "Your private note is safely on its way to Mahmoud & Ásmaa.",
  };
}