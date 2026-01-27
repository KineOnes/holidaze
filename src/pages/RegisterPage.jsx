// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  venueManager: false,
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    // --- Basic client-side validation (matches Noroff rules) ---
    if (!form.name.trim()) {
      return setError("Display name is required.");
    }

    // Only letters, numbers and underscores for name
    if (!/^[\w\d_]+$/.test(form.name)) {
      return setError(
        "Display name can only contain letters, numbers and underscores (_)."
      );
    }

    if (!form.email.endsWith("@stud.noroff.no")) {
      return setError("Email must be a @stud.noroff.no address.");
    }

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

    setIsSubmitting(true);

    try {
      // 1) Register user
      const response = await fetch(
        "https://v2.api.noroff.dev/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.errors?.[0]?.message || "Registration failed.");
      }

      // 2) Auto-login using your AuthContext login function
      await login(form.email, form.password);

      // 3) Send them to profile page
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create an account
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-500/40 rounded px-3 py-2">
            {error}
          </p>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-200"
            >
              Display name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="my_noroff_name"
            />
            <p className="mt-1 text-xs text-slate-400">
              Only letters, numbers and underscores. This is public.
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200"
            >
              Noroff email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="name@stud.noroff.no"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="At least 8 characters"
            />
          </div>

          {/* Venue manager toggle */}
          <div className="flex items-center gap-2">
            <input
              id="venueManager"
              name="venueManager"
              type="checkbox"
              checked={form.venueManager}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-400"
            />
            <label
              htmlFor="venueManager"
              className="text-sm text-slate-200"
            >
              I want to register as a venue manager
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-md bg-emerald-500 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
