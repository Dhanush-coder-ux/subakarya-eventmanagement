import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AccountTypePage: React.FC = () => {
  const navigate = useNavigate();
  const { switchExperience } = useAuthStore();

  const handleContinuePersonal = () => {
    switchExperience('PERSONAL');
    navigate('/');
  };

  const handleBecomeProfessional = () => {
    navigate('/onboarding/professional');
  };

  return (
    <div className="min-h-screen bg-sand/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl bg-surface-card rounded-2xl border border-border shadow-elevated p-6 sm:p-8">
        <div className="text-center mb-6">
          <img
            src="/subakarya-logo.png"
            alt="Subakarya Logo"
            className="w-16 h-16 mx-auto object-contain mb-3 drop-shadow-md"
          />
          <h1 className="text-2xl font-bold text-charcoal">
            Unified Account Model
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2 max-w-md mx-auto">
            Subakarya provides all users with a single personal account. You can discover and book services immediately, or activate your professional profile at any time without creating another account.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Option 1: Personal Experience */}
          <div className="p-5 rounded-2xl border-2 border-wine bg-wine-soft/30 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-wine text-white flex items-center justify-center mb-3">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-charcoal mb-1">Personal Account</h3>
              <p className="text-xs text-charcoal-muted mb-3">
                Plan, browse, and book verified event professionals, save reels, and chat with vendors.
              </p>
              <ul className="text-[11px] text-charcoal space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-wine shrink-0" />
                  <span>Discover top-rated vendors</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-wine shrink-0" />
                  <span>Manage private event bookings</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={handleContinuePersonal}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Option 2: Become a Professional */}
          <div className="p-5 rounded-2xl border border-border bg-surface hover:border-wine/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sand text-wine flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-charcoal mb-1">Become a Professional</h3>
              <p className="text-xs text-charcoal-muted mb-3">
                Showcase portfolio, list services or products, accept bookings, and manage earnings.
              </p>
              <ul className="text-[11px] text-charcoal space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-wine shrink-0" />
                  <span>Verified KYC credentialing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-wine shrink-0" />
                  <span>Booking or Order operating mode</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={handleBecomeProfessional}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-surface border border-wine text-wine hover:bg-wine-soft/40 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Start Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[11px] text-charcoal-muted flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-wine" />
            <span>Switch back and forth between personal and professional anytime in Settings.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
