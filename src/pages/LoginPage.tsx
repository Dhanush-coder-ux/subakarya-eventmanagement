import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Briefcase, Building2, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('priya.sharma@example.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setErrorMessage('');
    // Route to account-type selection to fulfill the flow
    navigate('/account-type');
  };

  const handleQuickDemo = (role: 'customer' | 'professional', specificId?: string) => {
    login(undefined, role, specificId);
    if (role === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-sand/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-surface-card rounded-2xl border border-border shadow-elevated p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <img src="/subakarya-logo.png" alt="Subakarya Logo" className="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain mb-3 drop-shadow-md" />
          <h1 className="font-bold text-3xl font-bold tracking-wider text-charcoal">
            SUBAKARYA
          </h1>
          <p className="text-xs uppercase tracking-widest text-wine font-semibold mt-1">
            Premium Event Services Marketplace
          </p>
          <h2 className="text-sm text-charcoal-muted mt-3">
            Sign in to curate, discover, and book extraordinary event professionals
          </h2>
        </div>

        {/* Demo Disclaimer Pill */}
        <div className="mb-5 p-2.5 rounded-xl bg-sand/50 border border-sand-dark/60 text-[11px] text-charcoal-muted flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-wine flex-shrink-0" />
          <span>Frontend prototype demonstration. No real credentials required.</span>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="mb-6 p-3 bg-surface-muted rounded-xl border border-border/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-2 text-center">
            Instant Demo Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer', 'cust-1')}
              className="py-2 px-2.5 rounded-lg bg-surface border border-border hover:border-wine hover:bg-wine-soft/50 text-[11px] font-semibold text-charcoal flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-wine" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('professional', 'pro-1')}
              className="py-2 px-2.5 rounded-lg bg-surface border border-border hover:border-wine hover:bg-wine-soft/50 text-[11px] font-semibold text-charcoal flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
            >
              <Briefcase className="w-3.5 h-3.5 text-wine" />
              <span>Vendor Demo</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Email or Phone Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-light absolute left-3 top-2.5" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com or +91..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface focus:border-wine focus:ring-1 focus:ring-wine/20 text-charcoal outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-light absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-border bg-surface focus:border-wine focus:ring-1 focus:ring-wine/20 text-charcoal outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-charcoal-light hover:text-charcoal focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-charcoal-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-border text-wine focus:ring-wine"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Demo notice: In this prototype, you can use any email or the quick demo buttons.')}
              className="text-wine hover:underline font-medium text-[11px]"
            >
              Forgot password?
            </button>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-error-light border border-error/30 text-error text-xs">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold tracking-wider transition-all duration-150 shadow-sm flex items-center justify-center gap-2 active:scale-98"
          >
            <span>Continue to Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-border/80 text-center text-xs text-charcoal-muted">
          <span>New to SUBAKARYA </span>
          <Link
            to="/account-type"
            className="font-bold text-wine hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
