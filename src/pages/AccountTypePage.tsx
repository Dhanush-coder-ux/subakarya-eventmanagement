import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Sparkles, Check, ArrowRight, ShieldCheck, HeartHandshake, Briefcase } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Role } from '../types';

export const AccountTypePage: React.FC = () => {
  const navigate = useNavigate();
  const { setAccountType } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<Role>('customer');

  const handleConfirm = () => {
    setAccountType(selectedRole);
    if (selectedRole === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-sand/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-surface-card rounded-2xl border border-border shadow-elevated p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-10 h-10 rounded-xl bg-wine items-center justify-center text-sand font-serif-display text-xl font-bold shadow-sm mb-2">
            S
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-charcoal">
            Choose Your Account Experience
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2 max-w-md mx-auto">
            Select how you would like to explore the Soirée platform. You can seamlessly switch between roles at any time in Settings.
          </p>
        </div>

        {/* Account Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Customer Selection Card */}
          <div
            onClick={() => setSelectedRole('customer')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              selectedRole === 'customer'
                ? 'border-wine bg-wine-soft/40 shadow-card'
                : 'border-border bg-surface hover:border-sand-dark hover:bg-sand/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedRole === 'customer' ? 'bg-wine text-white' : 'bg-sand text-charcoal'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                  selectedRole === 'customer' ? 'bg-wine border-wine text-white' : 'border-border-dark'
                }`}>
                  {selectedRole === 'customer' && <Check className="w-3 h-3" />}
                </div>
              </div>

              <h3 className="font-serif-display text-xl font-bold text-charcoal mb-1">
                Customer
              </h3>
              <p className="text-xs text-charcoal-muted mb-4 leading-relaxed">
                Plan, browse, and book premium professionals for weddings, parties, and private celebrations.
              </p>

              <ul className="space-y-2 text-xs text-charcoal">
                <li className="flex items-start gap-2">
                  <span className="text-wine font-bold">•</span>
                  <span>Discover verified photographers, caterers, halls, and decor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-wine font-bold">•</span>
                  <span>Browse high-definition video reels and portfolio works</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-wine font-bold">•</span>
                  <span>Request itemized quotations via structured chat</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60">
              <span className="text-[11px] font-semibold text-wine">
                {selectedRole === 'customer' ? 'Active Selection' : 'Click to select'}
              </span>
            </div>
          </div>

          {/* Professional / Vendor Selection Card */}
          <div
            onClick={() => setSelectedRole('professional')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              selectedRole === 'professional'
                ? 'border-wine bg-wine-soft/40 shadow-card'
                : 'border-border bg-surface hover:border-sand-dark hover:bg-sand/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedRole === 'professional' ? 'bg-wine text-white' : 'bg-sand text-charcoal'
                }`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                  selectedRole === 'professional' ? 'bg-wine border-wine text-white' : 'border-border-dark'
                }`}>
                  {selectedRole === 'professional' && <Check className="w-3 h-3" />}
                </div>
              </div>

              <h3 className="font-serif-display text-xl font-bold text-charcoal mb-1">
                Professional / Vendor
              </h3>
              <p className="text-xs text-charcoal-muted mb-4 leading-relaxed">
                Showcase your business, publish content, manage pricing packages, track inventory, and send quotations.
              </p>

              <ul className="space-y-2 text-xs text-charcoal">
                <li className="flex items-start gap-2">
                  <span className="text-wine font-bold">•</span>
                  <span>Promote services and publish reels to customer feeds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-wine font-bold">•</span>
                  <span>Manage equipment inventory, rental units, and stock</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-wine font-bold">•</span>
                  <span>Generate instant invoice quotations from customer enquiries</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60">
              <span className="text-[11px] font-semibold text-wine">
                {selectedRole === 'professional' ? 'Active Selection' : 'Click to select'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold tracking-wider transition-all duration-150 shadow-sm flex items-center justify-center gap-2 active:scale-98"
          >
            <span>Proceed as {selectedRole === 'customer' ? 'Customer' : 'Professional'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <Link
              to={selectedRole === 'customer' ? '/onboarding/customer' : '/onboarding/professional'}
              className="text-xs text-charcoal-muted hover:text-wine font-medium underline"
            >
              Or complete guided onboarding wizard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
