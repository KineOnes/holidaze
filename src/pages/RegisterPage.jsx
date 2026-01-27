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

    if (!form.name.trim()) return setError("Display name is required.");
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
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.errors?.[0]?.message || "Registration failed.");
      }

      await login(form.email, form.password);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an account</h1>

        {error && (
          <p
            className="mb-4 text-sm rounded px-3 py-2 border"
            style={{ color: "#b91c1c", background: "rgba(185,28,28,0.08)" }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Display name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm"
              style={{ background: "rgba(255,255,255,0.7)" }}
              placeholder="my_noroff_name"
            />
            <p className="mt-1 text-xs" style={{ opacity: 0.75 }}>
              Only letters, numbers and underscores. This is public.
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Noroff email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm"
              style={{ background: "rgba(255,255,255,0.7)" }}
              placeholder="name@stud.noroff.no"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm"
              style={{ background: "rgba(255,255,255,0.7)" }}
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
            />
            <label htmlFor="venueManager" className="text-sm">
              I want to register as a venue manager
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
