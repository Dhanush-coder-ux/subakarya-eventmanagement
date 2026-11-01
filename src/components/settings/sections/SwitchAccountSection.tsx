import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  User,
  Building2,
  CheckCircle2,
  RotateCcw,
  LogOut,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';

export const SwitchAccountSection: React.FC = () => {
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
  const isCustomer = accountType === 'customer';

  const handleRoleToggle = (newRole: 'customer' | 'professional') => {
    setAccountType(newRole);
    if (newRole === 'customer') {
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
        <h2 className="text-xl font-bold text-charcoal">Switch Account Type & Sandbox Controls</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Toggle between customer discovery and vendor management modes, test different personas, or reset the sandbox state.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3.5 rounded-xl bg-success-light border border-success/30 text-xs font-semibold text-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Demo state successfully restored to initial seed data! Redirecting...</span>
        </div>
      )}

      {/* Account Mode Switcher */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
          <Layers className="w-4 h-4 text-wine" />
          <span>Active Application Role</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleRoleToggle('customer')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              isCustomer
                ? 'border-wine bg-wine-soft/40 shadow-xs'
                : 'border-border bg-surface hover:bg-sand/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-charcoal flex items-center gap-1.5">
                <User className="w-4 h-4 text-wine" />
                <span>Customer Account</span>
              </span>
              {isCustomer && <CheckCircle2 className="w-4 h-4 text-wine" />}
            </div>
            <p className="text-xs text-charcoal-muted">
              Browse reels, discover event vendors, submit repost requests with reviews, and manage bookings.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleRoleToggle('professional')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              !isCustomer
                ? 'border-wine bg-wine-soft/40 shadow-xs'
                : 'border-border bg-surface hover:bg-sand/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-charcoal flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-wine" />
                <span>Professional / Vendor</span>
              </span>
              {!isCustomer && <CheckCircle2 className="w-4 h-4 text-wine" />}
            </div>
            <p className="text-xs text-charcoal-muted">
              Access the separate Repost Requests Inbox, approve client syndication, manage inventory gear and quotes.
            </p>
          </button>
        </div>
      </div>

      {/* Persona Quick Switcher */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
        <div>
          <h3 className="font-bold text-sm text-charcoal">Quick Switch Persona</h3>
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
            <RotateCcw className="w-4 h-4 text-wine" />
            <span>Restore Initial Demo Data</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-error hover:bg-error-dark text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

