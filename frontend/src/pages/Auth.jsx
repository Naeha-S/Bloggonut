import React, { useState } from 'react';
import { AlertCircle, Loader, Lock, Mail, Newspaper, PenLine, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

const ROLES = [
  {
    value: 'author',
    label: 'Author',
    icon: PenLine,
    desc: 'Publish stories, manage your own posts',
  },
  {
    value: 'admirer',
    label: 'Admirer',
    icon: Star,
    desc: 'Read, comment and follow your favourite writers',
  },
];

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('admirer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refresh } = useAuth();

  // Support ?redirect=/some/path after login
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.includes('@')) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin
      ? { email, password }
      : { email, password, role, display_name: displayName.trim() || undefined };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('bms_token', data.token);
        localStorage.setItem('bms_user', JSON.stringify(data.user));
        refresh(); // sync useAuth across components
        navigate(redirectTo, { replace: true });
      } else {
        setIsLogin(true);
        setError('Account created! Please sign in.');
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError('');
    setEmail('');
    setPassword('');
    setDisplayName('');
    setRole('admirer');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="grid grid-cols-1 border border-[#111111] lg:grid-cols-12">

        {/* Left panel */}
        <section className="newsprint-invert border-b border-[#111111] px-6 py-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:border-[#111111]">
          <div className="flex items-center gap-3">
            <Newspaper className="h-5 w-5" strokeWidth={1.5} />
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em]">Member Edition</p>
          </div>
          <h1 className="mt-5 font-display text-5xl leading-[0.92] tracking-tight">
            {isLogin ? 'Return to the newsroom.' : 'Open a new bureau account.'}
          </h1>
          <p className="mt-5 font-serif text-base leading-relaxed text-[#E5E5E0]">
            {isLogin
              ? 'Sign in to publish, comment and manage your saved reading list across the full edition.'
              : 'Choose your role and join the Bloggonut community.'}
          </p>
        </section>

        {/* Right panel — form */}
        <section className="lg:col-span-7">
          <div className="border-b border-[#111111] px-6 py-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">
              {isLogin ? 'Sign in' : 'Register'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="newsprint-form px-6 py-6" noValidate>

            {/* Error / success banner */}
            {error && (
              <div
                className="mb-6 flex items-start gap-3 border border-[#111111] px-4 py-4"
                style={{ background: error.includes('created') ? '#E4F2E4' : '#F7E2E2' }}
              >
                <AlertCircle
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  strokeWidth={1.5}
                  style={{ color: error.includes('created') ? '#2D7D2D' : '#CC0000' }}
                />
                <p className="font-serif text-sm leading-relaxed text-[#404040]">{error}</p>
              </div>
            )}

            <div className="grid gap-6">

              {/* Display name — signup only */}
              {!isLogin && (
                <div>
                  <label htmlFor="auth-display-name">Display name</label>
                  <input
                    id="auth-display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How you'll appear to readers"
                    className="input-base mt-2"
                    maxLength={60}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="auth-email">Email</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" strokeWidth={1.5} />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-base pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="auth-password">Password</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" strokeWidth={1.5} />
                  <input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="input-base pl-10"
                    required
                  />
                </div>
              </div>

              {/* Role selection — signup only */}
              {!isLogin && (
                <div>
                  <label className="block mb-3">Your role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map(({ value, label, icon: Icon, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className="role-select-card"
                        aria-pressed={role === value}
                        style={{
                          border: `1px solid ${role === value ? '#111111' : '#E5E5E0'}`,
                          background: role === value ? '#111111' : '#F9F9F7',
                          color: role === value ? '#F9F9F7' : '#525252',
                        }}
                      >
                        <Icon
                          className="h-5 w-5 mb-2"
                          strokeWidth={1.5}
                          style={{ color: role === value ? '#F9F9F7' : '#111111' }}
                        />
                        <p
                          className="font-mono text-[0.72rem] uppercase tracking-[0.14em]"
                          style={{ color: 'inherit' }}
                        >
                          {label}
                        </p>
                        <p
                          className="mt-1 font-serif text-[0.72rem] leading-snug"
                          style={{ color: role === value ? '#D0D0CE' : '#737373' }}
                        >
                          {desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-4 border-t border-[#111111] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading && <Loader className="h-4 w-4 animate-spin" strokeWidth={1.5} />}
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin((v) => !v); resetForm(); }}
                className="btn-secondary"
              >
                {isLogin ? 'Need an account' : 'Already registered'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
