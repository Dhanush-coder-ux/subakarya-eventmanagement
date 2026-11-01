import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  RefreshCw,
  User,
  Building2,
  CheckCircle2,
  RotateCcw,
  LogOut,
  AlertCircle,
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';

export const SwitchAccountSection: React.FC = () => {
  const navigate = useNavigate();
  const {
    userAccount,
    activeExperience,
    switchExperience,
    currentUser,
    switchActiveUser,
    allCustomers,
    allProfessionals,
    resetAuthData,
    logout,
  } = useAuthStore();
  const { resetMarketplaceData } = useMarketplaceStore();

  const [resetSuccess, setResetSuccess] = useState(false);
  const isPersonal = activeExperience === 'PERSONAL';
  const hasProProfile = Boolean(userAccount.professionalProfile);

  const handleExperienceToggle = (exp: 'PERSONAL' | 'PROFESSIONAL') => {
    switchExperience(exp);
    if (exp === 'PERSONAL') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Restore the prototype seed state? This will reset all demo repost requests, orders, and local interactions.'
      )
    ) {
      resetAuthData();
      resetMarketplaceData();
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        navigate('/');
      }, 1200);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of your session?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-charcoal">Account Experience & Sandbox Controls</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Seamlessly transition between personal browsing and professional business management with your single unified identity.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3.5 rounded-xl bg-success-light border border-success/30 text-xs font-semibold text-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Demo state successfully restored to initial seed data! Redirecting...</span>
        </div>
      )}

      {/* Account Experience Switcher */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
            <Layers className="w-4 h-4 text-wine" />
            <span>Active Account Experience</span>
          </h3>
          <span className="text-[11px] text-charcoal-muted">
            Preserves 100% of data across both modes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Personal Experience */}
          <button
            type="button"
            onClick={() => handleExperienceToggle('PERSONAL')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              isPersonal
                ? 'border-wine bg-wine-soft/40 shadow-xs'
                : 'border-border bg-surface hover:bg-sand/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-charcoal flex items-center gap-1.5">
                <User className="w-4 h-4 text-wine" />
                <span>Personal Experience</span>
              </span>
              {isPersonal && <CheckCircle2 className="w-4 h-4 text-wine" />}
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Browse reels, discover verified event vendors, save moodboard inspiration, chat, and book services.
            </p>
          </button>

          {/* Professional Experience */}
          <button
            type="button"
            onClick={() => {
              if (hasProProfile) {
                handleExperienceToggle('PROFESSIONAL');
              } else {
                navigate('/onboarding/professional');
              }
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              !isPersonal
                ? 'border-wine bg-wine-soft/40 shadow-xs'
                : 'border-border bg-surface hover:bg-sand/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-charcoal flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-wine" />
                <span>Professional Experience</span>
              </span>
              {!isPersonal && <CheckCircle2 className="w-4 h-4 text-wine" />}
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {hasProProfile
                ? 'Access your vendor dashboard, schedule slots, manage bookings, catalogue inventory, and track financial earnings.'
                : 'Click to start professional onboarding, submit KYC credentials, and activate commercial tools.'}
            </p>
          </button>
        </div>

        {!hasProProfile && (
          <div className="p-3 rounded-xl bg-sand/60 border border-sand-dark flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-wine shrink-0" />
              <span className="text-charcoal font-medium">
                Want to list your photography, catering, or event gear?
              </span>
            </div>
            <Link
              to="/onboarding/professional"
              className="px-3 py-1.5 rounded-lg bg-wine hover:bg-wine-dark text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs"
            >
              <span>Become a Professional</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Persona Quick Switcher */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
        <div>
          <h3 className="font-bold text-sm text-charcoal">Quick Switch Demo Persona</h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Test interactions between customer accounts and vendor studios.
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-2">
            Customer Personas
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {allCustomers.map((c) => (
              <button
                key={c.id}
                onClick={() => switchActiveUser(c.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  currentUser.id === c.id
                    ? 'border-wine bg-sand/60 font-bold'
                    : 'border-border bg-surface hover:bg-sand/30'
                }`}
              >
                <img src={c.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-charcoal truncate font-semibold">{c.name}</p>
                  <p className="text-[10px] text-charcoal-muted truncate">{c.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-2">
            Professional Studio Personas
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allProfessionals.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => switchActiveUser(p.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  currentUser.id === p.id
                    ? 'border-wine bg-sand/60 font-bold'
                    : 'border-border bg-surface hover:bg-sand/30'
                }`}
              >
                <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-charcoal truncate font-semibold">{p.businessName}</p>
                  <p className="text-[10px] text-charcoal-muted truncate">{p.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sandbox Reset & Log out */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-3">
        <h3 className="font-bold text-sm text-charcoal">Demo Sandbox Utilities</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-sand-dark bg-sand/50 hover:bg-sand text-charcoal text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-wine" />
            <span>Reset Prototype State</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-error/30 bg-error-light/40 hover:bg-error-light text-error text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
