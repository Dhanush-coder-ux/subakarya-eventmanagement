import React, { useState } from 'react';
import {
  Building2,
  Tag,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  FileText,
  Save,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { ServiceCategory } from '../../../types';

export const BusinessProfileSection: React.FC = () => {
  const { currentUser, updateProfessionalProfile } = useAuthStore();
  const pro = currentUser.role === 'professional' ? currentUser : null;

  const [businessName, setBusinessName] = useState(pro?.businessName || '');
  const [businessType, setBusinessType] = useState(pro?.businessType || 'Sole Proprietorship');
  const [category, setCategory] = useState<ServiceCategory>(
    pro?.category || 'Photographer & Videographer'
  );
  const [description, setDescription] = useState(pro?.description || '');
  const [coverageArea, setCoverageArea] = useState(pro?.coverageArea || '');
  const [experienceYears, setExperienceYears] = useState(pro?.experienceYears || 5);
  const [minBookingAmount, setMinBookingAmount] = useState(pro?.minBookingAmount || 25000);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories: ServiceCategory[] = [
    'Event Planner',
    'Photographer & Videographer',
    'Caterer',
    'Wedding & Party Hall',
    'Makeup Artist & Hairstylist',
    'Decorator & Florist',
    'DJ, Sound & Lighting',
    'Equipment Rental',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pro) return;

    updateProfessionalProfile({
      businessName,
      businessType,
      category,
      description,
      coverageArea,
      experienceYears: Number(experienceYears),
      minBookingAmount: Number(minBookingAmount),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (!pro) {
    return (
      <div className="p-8 text-center text-charcoal-muted">
        This section is only available for professional vendor accounts.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-charcoal">Business Profile</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Configure your commercial entity, service offerings, regional coverage, and editorial showcase bio.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-success-light border border-success/30 text-xs font-semibold text-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Business profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 bg-surface-card p-5 rounded-2xl border border-border shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Business Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>Studio / Commercial Brand Name *</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
              required
            />
          </div>

          {/* Primary Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>Primary Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Business Structure */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal">Legal Business Type</label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
          </div>

          {/* Experience Years */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>Experience (Years)</span>
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
          </div>

          {/* Min Booking Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>Minimum Booking Value (₹)</span>
            </label>
            <input
              type="number"
              min={1000}
              step={500}
              value={minBookingAmount}
              onChange={(e) => setMinBookingAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
          </div>

          {/* Coverage Area */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>Regional Coverage Area</span>
            </label>
            <input
              type="text"
              value={coverageArea}
              onChange={(e) => setCoverageArea(e.target.value)}
              placeholder="e.g. Madurai, Chennai, Coimbatore, Kerala"
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
          </div>

          {/* Bio / Description */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-charcoal-muted" />
              <span>Editorial Profile Bio</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold shadow-xs flex items-center gap-2 active:scale-95 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Business Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

