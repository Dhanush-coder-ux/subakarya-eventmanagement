import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerPersonalUser } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    registerPersonalUser({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      password,
    });

    // Per specifications: After registration, navigate to personal profile setup
    setTimeout(() => {
      navigate('/onboarding/personal');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-sand/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-surface-card rounded-2xl border border-border shadow-elevated p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <img
            src="/subakarya-logo.png"
            alt="Subakarya Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain mb-3 drop-shadow-md"
          />
          <h1 className="text-xl font-bold text-charcoal">Create Your Account</h1>
          <p className="text-xs uppercase tracking-widest text-wine font-semibold mt-1">
            Subakarya Event Marketplace
          </p>
          <p className="text-xs text-charcoal-muted mt-2">
            Sign up for a personal account to browse verified artists, book services, and watch reels.
          </p>
        </div>

        {/* Informational banner: Normal personal account */}
        <div className="mb-5 p-2.5 rounded-xl bg-sand/50 border border-sand-dark/60 text-[11px] text-charcoal-muted flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-wine flex-shrink-0" />
          <span>Every user starts with a personal account. You can activate a professional profile anytime in Settings.</span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Full Name <span className="text-wine">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-light absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface focus:border-wine focus:ring-1 focus:ring-wine/20 text-charcoal outline-none transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Email Address <span className="text-wine">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-light absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface focus:border-wine focus:ring-1 focus:ring-wine/20 text-charcoal outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone Number (Optional) */}
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Phone Number <span className="text-charcoal-muted font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-charcoal-light absolute left-3 top-2.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface focus:border-wine focus:ring-1 focus:ring-wine/20 text-charcoal outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Password <span className="text-wine">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-light absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Confirm Password <span className="text-wine">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-light absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface focus:border-wine focus:ring-1 focus:ring-wine/20 text-charcoal outline-none transition-all"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-error-light border border-error/30 text-error text-xs">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold tracking-wider transition-all duration-150 shadow-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Continue to Profile Setup'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-6 pt-5 border-t border-border/80 text-center text-xs text-charcoal-muted">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-wine hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

