import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Camera,
  AlertCircle,
  Save,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

export const AccountInfoSection: React.FC = () => {
  const { currentUser, accountType, updateCustomerProfile, updateProfessionalProfile } = useAuthStore();

  const isCustomer = accountType === 'customer';

  const [name, setName] = useState(currentUser.name || '');
  const [username, setUsername] = useState(
    'email' in currentUser ? currentUser.email.split('@')[0] : 'user'
  );
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isVerified = 'isVerified' in currentUser ? currentUser.isVerified : true;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!location.trim()) newErrors.location = 'City / Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (isCustomer) {
      updateCustomerProfile({
        name,
        email,
        phone,
        location,
        avatar,
      });
    } else {
      updateProfessionalProfile({
        name,
        email,
        phone,
        location,
        avatar,
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-charcoal">Account Information</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Manage your personal details, profile image, contact number and regional presence.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-success-light border border-success/30 text-xs font-semibold text-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Account changes saved and persisted successfully!</span>
        </div>
      )}

      {/* Avatar & Verification Status Header */}
      <div className="p-4 rounded-2xl bg-surface-card border border-border flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="relative group shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-wine shadow-sm"
          />
          <button
            type="button"
            onClick={() => {
              const url = window.prompt('Enter new avatar image URL:', avatar);
              if (url && url.trim()) setAvatar(url.trim());
            }}
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-wine text-white shadow-md hover:scale-110 transition-transform"
            title="Change avatar photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="font-bold text-base text-charcoal">{name}</h3>
            {isVerified && (
              <span title="Verified Account">
                <CheckCircle2 className="w-4 h-4 text-wine fill-sand shrink-0" />
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-muted">@{username}</p>
          <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand text-charcoal border border-sand-dark">
              {isCustomer ? 'Customer Account' : 'Verified Vendor'}
            </span>
            <span className="text-[10px] text-charcoal-muted">
              Member since {new Date(currentUser.createdAt || '2026-01-01').getFullYear()}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-4 bg-surface-card p-5 rounded-2xl border border-border shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
            {errors.name && <p className="text-[10px] text-error font-medium">{errors.name}</p>}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-charcoal-muted">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
            {errors.email && <p className="text-[10px] text-error font-medium">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
            {errors.phone && <p className="text-[10px] text-error font-medium">{errors.phone}</p>}
          </div>

          {/* City / Location */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>City / Base Location</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Madurai, Tamil Nadu"
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
            {errors.location && <p className="text-[10px] text-error font-medium">{errors.location}</p>}
          </div>
        </div>

        {/* Verification indicator */}
        <div className="p-3 rounded-xl bg-sand/35 border border-sand-dark flex items-start gap-2 text-xs text-charcoal">
          <ShieldCheck className="w-4 h-4 text-wine shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-charcoal">Official Marketplace Identity Status: Active</p>
            <p className="text-[11px] text-charcoal-muted">
              Phone and email verified. Financial payouts and booking guarantees are active for this profile.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold shadow-xs flex items-center gap-2 active:scale-95 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Account Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

