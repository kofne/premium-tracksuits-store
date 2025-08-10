'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setStatus('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', message: '' });
    } else {
      const data = await res.json();
      setStatus(data.error || 'Failed to send message.');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <main>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required />
        <button type="submit">Send</button>
      </form>
      {status && <p>{status}</p>}
    </main>
  );
}
