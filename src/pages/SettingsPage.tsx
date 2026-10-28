import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  RotateCcw,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Palette,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    accountType,
    setAccountType,
    switchActiveUser,
    allCustomers,
    allProfessionals,
    resetAuthData,
    logout,
  } = useAuthStore();
  const { resetMarketplaceData } = useMarketplaceStore();

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleRoleToggle = (newRole: 'customer' | 'professional') => {
    setAccountType(newRole);
    if (newRole === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  const handleResetAllData = () => {
    if (
      window.confirm(
        'Are you sure you want to restore the prototype state? This will clear all locally modified posts, quotations, and bookings.'
      )
    ) {
      resetAuthData();
      resetMarketplaceData();
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        navigate('/');
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-surface-card rounded-2xl border border-border p-6 shadow-card">
        <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
          Preferences & Sandbox Controls
        </span>
        <h1 className="font-bold text-2xl sm:text-3xl font-bold text-charcoal mt-1">
          Platform Settings & Account Switcher
        </h1>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Switch between consumer discovery and vendor management modes or reset prototype seed state
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-success-light border border-success/30 flex items-center gap-3 text-xs text-success font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Demo state successfully restored to initial seed data! Redirecting...</span>
        </div>
      )}

      {/* Account Mode Switcher */}
      <div className="bg-surface-card rounded-2xl border border-border p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
          <Layers className="w-4 h-4 text-wine" />
          <span>Active Application Mode</span>
        </h2>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          Switching modes updates your navigation, capabilities, and user experience.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleRoleToggle('customer')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              accountType === 'customer'
                ? 'border-wine bg-wine-soft/40 shadow-xs'
                : 'border-border bg-surface hover:bg-sand/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-charcoal">Customer Experience</span>
              {accountType === 'customer' && <CheckCircle2 className="w-4 h-4 text-wine" />}
            </div>
            <p className="text-xs text-charcoal-muted">
              Browse posts & reels, discover event services, and request quotations.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleRoleToggle('professional')}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              accountType === 'professional'
                ? 'border-wine bg-wine-soft/40 shadow-xs'
                : 'border-border bg-surface hover:bg-sand/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-charcoal">Professional Vendor Experience</span>
              {accountType === 'professional' && <CheckCircle2 className="w-4 h-4 text-wine" />}
            </div>
            <p className="text-xs text-charcoal-muted">
              Manage equipment inventory, configure pricing, track bookings, and issue formal quotations.
            </p>
          </button>
        </div>
      </div>

      {/* Profile Switcher */}
      <div className="bg-surface-card rounded-2xl border border-border p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
          <User className="w-4 h-4 text-wine" />
          <span>Switch Sample Demo Profile</span>
        </h2>
        <p className="text-xs text-charcoal-muted">
          Test the interface through different persona accounts:
        </p>

        {/* Customer Accounts */}
        <div>
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-2">
            Customer Profiles
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {allCustomers.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  switchActiveUser(c.id);
                  navigate('/');
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  currentUser.id === c.id
                    ? 'border-wine bg-sand/60 font-semibold'
                    : 'border-border bg-surface hover:bg-sand/20'
                }`}
              >
                <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-charcoal truncate">{c.name}</p>
                  <p className="text-[10px] text-charcoal-muted truncate">{c.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Vendor Accounts */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-2">
            Vendor & Professional Profiles
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {allProfessionals.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  switchActiveUser(p.id);
                  navigate('/dashboard');
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  currentUser.id === p.id
                    ? 'border-wine bg-sand/60 font-semibold'
                    : 'border-border bg-surface hover:bg-sand/20'
                }`}
              >
                <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-charcoal truncate">{p.businessName}</p>
                  <p className="text-[10px] text-wine truncate">{p.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Design Direction Callout */}
      <div className="bg-surface-card rounded-2xl border border-border p-6 shadow-card space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
          <Palette className="w-4 h-4 text-wine" />
          <span>Editorial Design System Palette</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-wine text-white text-center">
            <span className="font-bold block">Wine Red</span>
            <span className="text-[10px] opacity-80">#7F011F</span>
          </div>
          <div className="p-3 rounded-xl bg-sand text-charcoal text-center border border-sand-dark">
            <span className="font-bold block">Light Sand</span>
            <span className="text-[10px] opacity-80">#F5EBD0</span>
          </div>
          <div className="p-3 rounded-xl bg-wine-dark text-white text-center">
            <span className="font-bold block">Deep Wine</span>
            <span className="text-[10px] opacity-80">#650019</span>
          </div>
          <div className="p-3 rounded-xl bg-surface text-charcoal text-center border border-border">
            <span className="font-bold block">Surface</span>
            <span className="text-[10px] opacity-80">#FFFCF6</span>
          </div>
          <div className="p-3 rounded-xl bg-charcoal text-white text-center">
            <span className="font-bold block">Dark Text</span>
            <span className="text-[10px] opacity-80">#282326</span>
          </div>
          <div className="p-3 rounded-xl bg-border text-charcoal text-center">
            <span className="font-bold block">Border</span>
            <span className="text-[10px] opacity-80">#E6DCCB</span>
          </div>
        </div>
      </div>

      {/* Reset Demo State & Disclaimer */}
      <div className="bg-surface-card rounded-2xl border border-border p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-wine" />
          <span>Reset Prototype State</span>
        </h2>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          Restore initial mock data (posts, reels, inventory items, conversations, and bookings) to clean seed state.
        </p>

        <div className="pt-2">
          <button
            onClick={handleResetAllData}
            className="px-4 py-2.5 rounded-xl border border-error/40 hover:bg-error-light text-error text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial State</span>
          </button>
        </div>

        <div className="mt-4 p-3 bg-sand/30 rounded-xl border border-sand-dark/50 text-[11px] text-charcoal-muted leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-wine flex-shrink-0 mt-0.5" />
          <span>
            Subakarya is a high-fidelity frontend architecture prototype. All data is persisted locally in your browser’s localStorage. No external payment processing or backend server communication occurs.
          </span>
        </div>
      </div>
    </div>
  );
};

