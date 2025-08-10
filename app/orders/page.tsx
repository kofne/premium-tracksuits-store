'use client';

import { useState } from 'react';

export default function OrderPage() {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    product_name: '',
    product_id: '',
    quantity: 1,
    price: 0,
    payment_status: 'pending',
  });
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setStatus('Order submitted successfully!');
      setForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        product_name: '',
        product_id: '',
        quantity: 1,
        price: 0,
        payment_status: 'pending',
      });
    } else {
      const data = await res.json();
      setStatus(data.error || 'Failed to submit order.');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  return (
    <main>
      <h1>Place Order</h1>
      <form onSubmit={handleSubmit}>
        <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Name" required />
        <input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} placeholder="Email" required />
        <input name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="Phone (optional)" />
        <input name="product_name" value={form.product_name} onChange={handleChange} placeholder="Product Name" required />
        <input name="product_id" value={form.product_id} onChange={handleChange} placeholder="Product ID (optional)" />
        <input
          name="quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <input
          name="price"
          type="number"
          min={0}
          step={0.01}
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        {/* payment_status could be hidden or selectable */}
        <button type="submit">Submit Order</button>
      </form>
      {status && <p>{status}</p>}
    </main>
  );
}
