"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitMessage, type FormState } from "@/app/actions";

const initialFormState: FormState = { status: "idle", message: "" };

function Status({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  return <p className={`form-status form-status--${state.status}`} role="status">{state.message}</p>;
}

export function MessageForm() {
  const [state, action, pending] = useActionState(submitMessage, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.status === "success") formRef.current?.reset(); }, [state.status]);
  return (
    <form ref={formRef} action={action} className="editorial-form message-form" aria-label="Leave a message for the couple">
      <div className="honeypot" aria-hidden="true"><label htmlFor="message-website">Website</label><input id="message-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <label><span>Your name</span><input name="guestName" autoComplete="name" maxLength={100} required placeholder="Full name" /></label>
      <label><span>Your message</span><textarea name="message" maxLength={1200} required rows={5} placeholder="A wish, a memory, a few words from the heart…" /></label>
      <p className="privacy-note">Only Asmaa & Mahmoud will see this message.</p>
      <button className="gold-button" type="submit" disabled={pending}>{pending ? "Sending your message…" : "Send your message"}</button>
      <Status state={state} />
    </form>
  );
}
