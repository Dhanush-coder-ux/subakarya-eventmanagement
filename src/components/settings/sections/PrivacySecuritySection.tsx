import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserX,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';

export const PrivacySecuritySection: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const {
    isPrivateProfile,
    toggleProfilePrivacy,
    blockedUserIds,
    mutedUserIds,
    toggleBlockUser,
    toggleMuteUser,
  } = useMarketplaceStore();

  // Change Password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Deactivate modal state
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateConfirmed, setDeactivateConfirmed] = useState(false);

  const mockUsersMap: Record<string, { name: string; avatar: string }> = {
    'cust-2': { name: 'Rohan Mehta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    'cust-3': { name: 'Ananya Reddy', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    'pro-3': { name: 'Saffron Royal Feast Caterers', avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=150' },
    'pro-5': { name: 'Royal Mandapam Decors', avatar: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=150' },
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please enter your current demo password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-charcoal">Privacy and Security</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Control account visibility, manage restricted profiles, update security keys, or deactivate your profile.
        </p>
      </div>

      {/* Profile Visibility Toggle */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-charcoal">Private Account Mode</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sand text-charcoal border border-sand-dark">
                {isPrivateProfile ? 'Private' : 'Public'}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              When your account is private, only clients and vendors you approve can see your inquiries and posted reels.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleProfilePrivacy}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isPrivateProfile ? 'bg-wine' : 'bg-border'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isPrivateProfile ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security & Password */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
        <div>
          <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
            <Lock className="w-4 h-4 text-wine" />
            <span>Login Security</span>
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Two-factor authentication and session credential management.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface border border-border">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-charcoal-muted" />
            <div>
              <p className="text-xs font-bold text-charcoal">Account Password</p>
              <p className="text-[11px] text-charcoal-muted">Last changed 2 months ago</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="px-3.5 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal transition-colors self-end sm:self-auto"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Blocked Accounts */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-3">
        <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
          <UserX className="w-4 h-4 text-wine" />
          <span>Blocked Accounts ({blockedUserIds.length})</span>
        </h3>
        <p className="text-xs text-charcoal-muted">
          Blocked profiles cannot message you, view your calendar, or submit repost inquiries.
        </p>

        {blockedUserIds.length === 0 ? (
          <p className="text-xs text-charcoal-muted/70 italic py-2">No blocked accounts.</p>
        ) : (
          <div className="space-y-2 pt-1">
            {blockedUserIds.map((uid) => {
              const u = mockUsersMap[uid] || { name: 'Blocked User', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' };
              return (
                <div
                  key={uid}
                  className="p-2.5 rounded-xl border border-border bg-surface flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-xs font-bold text-charcoal">{u.name}</span>
                  </div>
                  <button
                    onClick={() => toggleBlockUser(uid)}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold text-wine hover:bg-wine-soft transition-colors"
                  >
                    Unblock
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Muted Accounts */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-3">
        <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
          <VolumeX className="w-4 h-4 text-wine" />
          <span>Muted Accounts ({mutedUserIds.length})</span>
        </h3>
        <p className="text-xs text-charcoal-muted">
          Muted accounts remain connected but their posts will not appear in your home feed alerts.
        </p>

        {mutedUserIds.length === 0 ? (
          <p className="text-xs text-charcoal-muted/70 italic py-2">No muted accounts.</p>
        ) : (
          <div className="space-y-2 pt-1">
            {mutedUserIds.map((uid) => {
              const u = mockUsersMap[uid] || { name: 'Muted User', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' };
              return (
                <div
                  key={uid}
                  className="p-2.5 rounded-xl border border-border bg-surface flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-xs font-bold text-charcoal">{u.name}</span>
                  </div>
                  <button
                    onClick={() => toggleMuteUser(uid)}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold text-charcoal hover:bg-sand/40 transition-colors"
                  >
                    Unmute
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Destructive Zone: Deactivation */}
      <div className="bg-error-light/30 rounded-2xl border border-error/30 p-5 space-y-3">
        <div className="flex items-center gap-2 text-error font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Deactivate Account (Demo Prototype)</span>
        </div>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          Temporarily pause your presence on Subakarya. Your quotations, saved reels, and portfolio showcase will be hidden from public search until you log back in.
        </p>
        <button
          type="button"
          onClick={() => setShowDeactivateModal(true)}
          className="px-4 py-2 rounded-xl bg-error hover:bg-error-dark text-white text-xs font-bold shadow-xs transition-colors"
        >
          Deactivate Profile
        </button>
      </div>

      {/* Change Password Dialog */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl border border-border shadow-elevated z-10 p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h4 className="font-bold text-sm text-charcoal">Change Demo Password</h4>
              <button onClick={() => setShowPasswordModal(false)} className="text-charcoal-muted hover:text-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="p-4 rounded-xl bg-success-light text-xs font-semibold text-success flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Password updated successfully!</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
                {passwordError && (
                  <div className="p-2.5 rounded-lg bg-error-light text-error text-[11px] font-medium">
                    {passwordError}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="font-bold text-charcoal">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-charcoal">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-charcoal">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-3 py-1.5 rounded-lg text-charcoal-muted font-semibold hover:bg-sand/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-wine text-white font-bold shadow-xs hover:bg-wine-dark"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Deactivate Account Dialog */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setShowDeactivateModal(false)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl border border-border shadow-elevated z-10 p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-error">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-sm text-charcoal">Confirm Account Deactivation</h4>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Are you sure you want to temporarily deactivate your profile? You will be signed out, and your public reels will be hidden until your next sign in.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-charcoal hover:bg-sand/30"
              >
                Nevermind
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeactivateModal(false);
                  logout();
                }}
                className="px-4 py-1.5 rounded-lg bg-error hover:bg-error-dark text-white text-xs font-bold shadow-xs"
              >
                Yes, Deactivate Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

