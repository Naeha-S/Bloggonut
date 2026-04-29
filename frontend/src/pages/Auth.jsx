import React, { useState } from 'react';
import { AlertCircle, Loader, Lock, Mail, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('bms_token', data.token);
        localStorage.setItem('bms_user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setIsLogin(true);
        setError('Registration successful. Please sign in.');
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="grid grid-cols-1 border border-[#111111] lg:grid-cols-12">
        <section className="newsprint-invert border-b border-[#111111] px-6 py-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:border-[#111111]">
          <div className="flex items-center gap-3">
            <Newspaper className="h-5 w-5" strokeWidth={1.5} />
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em]">Member Edition</p>
          </div>
          <h1 className="mt-5 font-display text-5xl leading-[0.92] tracking-tight">
            {isLogin ? 'Return to the newsroom.' : 'Open a new bureau account.'}
          </h1>
          <p className="mt-5 font-serif text-base leading-relaxed text-[#E5E5E0]">
            Sign in to publish, comment, and manage your saved reading list across the full edition.
          </p>
        </section>

        <section className="lg:col-span-7">
          <div className="border-b border-[#111111] px-6 py-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">
              {isLogin ? 'Sign in' : 'Register'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="newsprint-form px-6 py-6">
            {error ? (
              <div className="mb-6 flex items-start gap-3 border border-[#111111] bg-[#F7E2E2] px-4 py-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#CC0000]" strokeWidth={1.5} />
                <p className="font-serif text-sm leading-relaxed text-[#404040]">{error}</p>
              </div>
            ) : null}

            <div className="grid gap-6">
              <div>
                <label htmlFor="auth-email">Email</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" strokeWidth={1.5} />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="input-base pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-password">Password</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" strokeWidth={1.5} />
                  <input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    className="input-base pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-[#111111] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <Loader className="h-4 w-4 animate-spin" strokeWidth={1.5} /> : null}
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin((value) => !value);
                  setError('');
                  setEmail('');
                  setPassword('');
                }}
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
