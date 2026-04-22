import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader, Lock, Mail, Feather } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@')) {
      return setError('Please enter a valid email.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    
    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      if (isLogin) {
        localStorage.setItem('bms_token', data.token);
        localStorage.setItem('bms_user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.'); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background gradient accents */}
      <motion.div
        className="absolute -top-32 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/8 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            className="flex items-center justify-center gap-2.5 mb-5"
            whileHover={{ scale: 1.05 }}
          >
            <Feather className="w-6 h-6 text-accent" />
            <h1 className="font-display text-2xl font-semibold text-text-main">Bloggonut</h1>
          </motion.div>
          <h2 className="text-3xl font-display font-semibold text-text-main mb-3">
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          <p className="text-text-muted text-base font-light">
            {isLogin ? 'Sign in to share your stories' : 'Start writing and sharing ideas'}
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-5">
          {/* Error Alert */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: error ? 1 : 0, y: error ? 0 : -10 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-2xl text-sm flex items-start gap-3 border ${
              error.includes('successful')
                ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200'
                : 'bg-rose-50/80 text-rose-700 border-rose-200'
            }`}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="font-light">{error}</p>
          </motion.div>

          {/* Input Fields */}
          <div className="space-y-4">
            {/* Email Input */}
            <motion.div variants={itemVariants} className="space-y-2.5">
              <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                Email Address
              </label>
              <motion.div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="input-base w-full py-3 px-4 pl-11"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted pointer-events-none" />
              </motion.div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-text-main flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" />
                  Password
                </label>
                {isLogin && <a href="#" className="text-xs text-accent hover:text-accent-dark transition-colors font-light">Forgot?</a>}
              </div>
              <motion.div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="input-base w-full py-3 px-4 pl-11"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted pointer-events-none" />
              </motion.div>
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.button 
            type="submit" 
            disabled={loading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full py-3.5 mt-8 font-semibold text-base"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                <Loader className="w-5 h-5" />
              </motion.div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </motion.button>
        </motion.form>

        {/* Toggle Auth Mode */}
        <motion.div variants={itemVariants} className="mt-10 text-center text-sm border-t border-border pt-8">
          <p className="text-text-muted mb-4 font-light">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </p>
          <motion.button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
            }} 
            className="inline-block px-5 py-2.5 rounded-2xl bg-surface-secondary text-accent hover:bg-surface-hover font-semibold transition-all border border-secondary/30 hover:border-secondary/60"
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? 'Sign Up Instead' : 'Log In Instead'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
