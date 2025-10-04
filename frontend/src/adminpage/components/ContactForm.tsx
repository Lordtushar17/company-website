// src/components/ContactForm.tsx
import React, { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const ContactForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Base URLs ---
  const CONTACT_API = (process.env.REACT_APP_CONTACT_API || "").replace(/\/$/, "");
  const MAIN_API = (process.env.REACT_APP_MAIN_API_BASE || "").replace(/\/$/, "");

  // Use Contact API if available, else fallback to main
  const ENDPOINT = CONTACT_API ? `${CONTACT_API}/contact` : `${MAIN_API}/contact`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const message = form.message.trim();

  if (!name || !email || !message) {
    setError("Please fill name, email and message.");
    return;
  }

  setLoading(true);
  try {
    const payload = { name, email, phone, message };
    console.info("[ContactForm] POST", ENDPOINT, payload);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text(); // read raw text first
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      console.warn("[ContactForm] failed to parse JSON response:", parseErr, "raw:", text);
      data = { raw: text };
    }

    console.info("[ContactForm] response", res.status, data);

    if (!res.ok) {
      // prefer server message, else status
      const serverMsg = data?.message || data?.error || data?.raw || `Server error (${res.status})`;
      throw new Error(serverMsg);
    }

    setSuccess("Message sent successfully — thank you!");
    setForm({ name: "", email: "", phone: "", message: "" });
  } catch (err: any) {
    console.error("[ContactForm] submit error:", err);
    setError(err?.message || "Failed to send message.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4 text-orange-500">Send us a message</h3>

      {success && <div className="mb-4 p-2 bg-green-50 text-green-800 rounded">{success}</div>}
      {error && <div className="mb-4 p-2 bg-red-50 text-red-800 rounded break-words">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone (optional)</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="+91 9XXXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="How can we help?"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({ name: "", email: "", phone: "", message: "" });
              setError(null);
              setSuccess(null);
            }}
            className="px-3 py-2 border rounded"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
