'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/login'); // redirect to login page
    } else {
      const data = await res.json();
      setError(data.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Sign Up</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Sign Up
      </button>
    </form>
  );
}
