import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  IndianRupee,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { ServiceCategory, PricingModel } from '../types';
import { calculateProfileCompleteness, formatINR } from '../utils';

export const ProfessionalOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfessionalProfile, setAccountType } = useAuthStore();
  const { addService, createWork } = useMarketplaceStore();

  const [step, setStep] = useState(1);

  // Step 1: Personal Info
  const [name, setName] = useState(currentUser.name || 'Karthik Raja');
  const [email, setEmail] = useState(currentUser.email || 'karthik@lumierecinema.com');
  const [phone, setPhone] = useState(currentUser.phone || '+91 94432 87654');
  const [avatar, setAvatar] = useState(
    currentUser.avatar ||
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  );

  // Step 2: Business Info
  const [businessName, setBusinessName] = useState('Lumière Cinematic Studios');
  const [businessType, setBusinessType] = useState('Sole Proprietorship');
  const [category, setCategory] = useState<ServiceCategory>('Photographer & Videographer');
  const [description, setDescription] = useState(
    'Award-winning visual storytellers specializing in cinematic wedding films, royal portraits, and candid celebrations.'
  );
  const [location, setLocation] = useState('Madurai, Tamil Nadu');
  const [coverageArea, setCoverageArea] = useState('Madurai, Chennai, Coimbatore, Kerala');
  const [experienceYears, setExperienceYears] = useState(9);
  const [minBookingAmount, setMinBookingAmount] = useState(25000);

  // Step 3: Services & Pricing
  const [servicesList, setServicesList] = useState<
    { name: string; price: number; model: PricingModel; inclusions: string }[]
  >([
    {
      name: 'Signature Royal Wedding Cinema & Album',
      price: 25000,
      model: 'fixed',
      inclusions: '2 Senior Photographers, 4K Cinema Teaser, 1 Embossed Leather Album',
    },
  ]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(15000);
  const [newServiceModel, setNewServiceModel] = useState<PricingModel>('fixed');

  // Step 4: Verification (Simulated KYC/PAN)
  const [panNumber, setPanNumber] = useState('AAAPL1234K');
  const [documentType, setDocumentType] = useState<
    'PAN Card' | 'GST Certificate' | 'Business License' | 'Trade Certificate'
  >('PAN Card');
  const [businessRegNumber, setBusinessRegNumber] = useState('TN-MDU-2024-8841');

  // Step 5: Portfolio
  const [workTitle, setWorkTitle] = useState('The Royal Chettinad Wedding');
  const [workEventType, setWorkEventType] = useState('Heritage Wedding');
  const [workDescription, setWorkDescription] = useState(
    'A three-day heritage celebration featuring traditional rituals, candid moments, and 4K cinema.'
  );
  const [workGalleryUrl, setWorkGalleryUrl] = useState(
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
  );

  // Dynamic Profile Completeness Computation
  const dynamicProfileDraft = {
    name,
    email,
    phone,
    avatar,
    businessName,
    category,
    description,
    coverageArea,
    experienceYears,
    location,
    verificationInfo: {
      panNumber,
      documentType,
      verificationStatus: 'verified' as const,
      businessRegNumber,
    },
  };

  const { percentage, breakdown } = calculateProfileCompleteness(
    dynamicProfileDraft,
    servicesList.length,
    workTitle ? 1 : 0
  );

  const handleAddService = () => {
    if (!newServiceName.trim()) return;
    setServicesList((prev) => [
      ...prev,
      {
        name: newServiceName,
        price: newServicePrice,
        model: newServiceModel,
        inclusions: 'Standard package deliverables',
      },
    ]);
    setNewServiceName('');
    setNewServicePrice(10000);
  };

  const handleRemoveService = (index: number) => {
    setServicesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinishOnboarding = () => {
    updateProfessionalProfile({
      name,
      email,
      phone,
      avatar,
      businessName,
      businessType,
      category,
      description,
      location,
      coverageArea,
      experienceYears,
      minBookingAmount,
      verificationInfo: {
        panNumber,
        documentType,
        verificationStatus: 'verified',
        businessRegNumber,
      },
      profileCompleteness: percentage,
      hasPersonalDone: true,
      hasBusinessDone: true,
      hasServicesDone: servicesList.length > 0,
      hasVerificationDone: Boolean(panNumber),
      hasPortfolioDone: Boolean(workTitle),
      hasAvailabilityDone: Boolean(location),
    });

    // Add configured service
    if (servicesList.length > 0) {
      servicesList.forEach((s) => {
        addService({
          professionalId: currentUser.id,
          name: s.name,
          category,
          description: s.inclusions,
          pricingModel: s.model,
          basePrice: s.price,
          inclusions: s.inclusions.split(','),
          isActive: true,
        });
      });
    }

    // Add portfolio sample
    if (workTitle) {
      createWork({
        professionalId: currentUser.id,
        title: workTitle,
        eventType: workEventType,
        eventDate: '2026-10-15',
        location,
        description: workDescription,
        galleryUrls: [workGalleryUrl],
        servicesDelivered: [category],
      });
    }

    setAccountType('professional');
    navigate('/dashboard');
  };

  const stepsList = [
    { num: 1, title: 'Personal', icon: User },
    { num: 2, title: 'Business', icon: Building2 },
    { num: 3, title: 'Pricing', icon: Sparkles },
    { num: 4, title: 'Verification', icon: ShieldCheck },
    { num: 5, title: 'Portfolio', icon: ImageIcon },
    { num: 6, title: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-sand/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Dynamic Completeness Banner */}
        <div className="bg-surface-card rounded-2xl border border-border shadow-card p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-wine">
                Dynamic Profile Completeness
              </span>
              <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
                <span>{percentage}% Complete</span>
                {percentage === 100 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success-light text-success font-semibold border border-success/30">
                    All Sections Verified
                  </span>
                )}
              </h2>
            </div>
            <div className="text-xs text-charcoal-muted">
              Step {step} of 6: <span className="font-semibold text-charcoal">{stepsList[step - 1].title}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-sand/60 h-2.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-wine h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Dynamic Section Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-3 pt-2">
            {breakdown.map((item) => (
              <div
                key={item.section}
                className={`text-[11px] flex items-center gap-1.5 p-1.5 rounded-lg ${
                  item.completed ? 'text-charcoal bg-sand/40 font-medium' : 'text-charcoal-muted bg-surface-muted'
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-wine flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-charcoal-light flex-shrink-0" />
                )}
                <span className="truncate">{item.section} ({item.weight}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Container */}
        <div className="bg-surface-card rounded-2xl border border-border shadow-elevated p-4 sm:p-8">
          {/* Stepper Tabs */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 border-b border-border">
            {stepsList.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-wine text-white shadow-xs'
                      : isPast
                      ? 'text-wine hover:bg-wine-soft'
                      : 'text-charcoal-muted hover:text-charcoal'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.num}. {s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-charcoal">Step 1: Personal & Contact Information</h3>
              <p className="text-xs text-charcoal-muted">
                Your direct contact details are shared only when booking requests are initiated.
              </p>

              <div className="flex items-center gap-4 p-3 bg-surface-muted rounded-xl border border-border">
                <img src={avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover ring-2 ring-wine/30" />
                <div className="flex-1">
                  <label className="text-xs font-semibold text-charcoal block mb-1">Photo / Logo URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-charcoal">Step 2: Business & Service Details</h3>
              <p className="text-xs text-charcoal-muted">
                Describe your commercial entity and primary service capabilities.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Business Structure</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  >
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="LLP">Limited Liability Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">Primary Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                >
                  <option value="Photographer & Videographer">Photographer & Videographer</option>
                  <option value="Wedding & Party Hall">Wedding & Party Hall</option>
                  <option value="Caterer">Caterer</option>
                  <option value="Makeup Artist & Hairstylist">Makeup Artist & Hairstylist</option>
                  <option value="Decorator & Florist">Decorator & Florist</option>
                  <option value="DJ, Sound & Lighting">DJ, Sound & Lighting</option>
                  <option value="Event Planner">Event Planner</option>
                  <option value="Equipment Rental">Equipment Rental</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">Business Description / Bio</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">City / Base Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Coverage Area</label>
                  <input
                    type="text"
                    value={coverageArea}
                    onChange={(e) => setCoverageArea(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="1"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Minimum Booking Amount (INR)</label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={minBookingAmount}
                    onChange={(e) => setMinBookingAmount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Services & Pricing */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-charcoal">Step 3: Services & Pricing Models</h3>
              <p className="text-xs text-charcoal-muted">
                Add reusable service packages and pricing formulas to automatically calculate customer quotations.
              </p>

              {/* Current Services List */}
              <div className="space-y-2">
                {servicesList.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-surface-muted border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-charcoal">{s.name}</p>
                      <p className="text-[11px] text-charcoal-muted">{s.inclusions}</p>
                      <span className="text-[10px] text-wine font-semibold">Pricing Model: {s.model}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-wine text-sm">{formatINR(s.price)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        className="text-charcoal-light hover:text-error transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Service Inline Form */}
              <div className="p-4 bg-sand/30 rounded-xl border border-sand-dark space-y-3 text-xs">
                <span className="font-bold text-charcoal block">Add Service Package</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Service / Package Name"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Base Price (INR)"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-semibold text-charcoal">Pricing Model:</label>
                  <select
                    value={newServiceModel}
                    onChange={(e) => setNewServiceModel(e.target.value as PricingModel)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  >
                    <option value="fixed">Fixed Package</option>
                    <option value="per_person">Per Person / Guest</option>
                    <option value="per_day">Per Day Rental</option>
                    <option value="per_hour">Per Hour</option>
                    <option value="per_item">Per Item</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="ml-auto px-3 py-1.5 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Verification / Simulated KYC */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-charcoal">Step 4: Business Verification (Simulated KYC)</h3>
              
              {/* Important Prototype Notice */}
              <div className="p-3.5 rounded-xl bg-sand/60 border border-sand-dark text-xs text-charcoal leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-wine flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-wine">Frontend Prototype Simulation Notice</p>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                    PAN and KYC documents are simulated locally for demonstration. Never enter real confidential identifiers or identity cards. Production implementation requires an authorized, secure KYC verification vendor.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Permanent Account Number (PAN) / Tax ID (Simulated)
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. AAAPL1234K"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal font-mono uppercase outline-none focus:border-wine"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Verification Document Type</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  >
                    <option value="PAN Card">PAN Card</option>
                    <option value="GST Certificate">GST Certificate</option>
                    <option value="Business License">Business License</option>
                    <option value="Trade Certificate">Trade Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Registration Reference</label>
                  <input
                    type="text"
                    value={businessRegNumber}
                    onChange={(e) => setBusinessRegNumber(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>

              {/* Status UI */}
              <div className="p-3 bg-surface-muted rounded-xl border border-border flex items-center justify-between text-xs">
                <span className="text-charcoal-muted">Current Verification Status</span>
                <span className="font-semibold text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified (Prototype State)</span>
                </span>
              </div>
            </div>
          )}

          {/* Step 5: Portfolio */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-charcoal">Step 5: Portfolio Project Sample</h3>
              <p className="text-xs text-charcoal-muted">
                Add an exemplary completed event to display on your public profile under "Our Works".
              </p>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">Project / Wedding Title</label>
                <input
                  type="text"
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Event Type</label>
                  <input
                    type="text"
                    value={workEventType}
                    onChange={(e) => setWorkEventType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Sample Gallery Image URL</label>
                  <input
                    type="text"
                    value={workGalleryUrl}
                    onChange={(e) => setWorkGalleryUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">Project Summary</label>
                <textarea
                  rows={2}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
            </div>
          )}

          {/* Step 6: Review and Complete */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-charcoal">Step 6: Review & Publish Profile</h3>
              <p className="text-xs text-charcoal-muted">
                Review your profile information before launching your professional dashboard.
              </p>

              <div className="divide-y divide-border/60 text-xs bg-surface-muted rounded-xl p-4 border border-border space-y-2">
                <div className="flex justify-between pb-2">
                  <span className="text-charcoal-muted">Business Name:</span>
                  <span className="font-semibold text-charcoal">{businessName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-charcoal-muted">Category:</span>
                  <span className="font-semibold text-charcoal">{category}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-charcoal-muted">Location & Coverage:</span>
                  <span className="font-semibold text-charcoal">{location} ({coverageArea})</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-charcoal-muted">Services Configured:</span>
                  <span className="font-semibold text-charcoal">{servicesList.length} Package(s)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-charcoal-muted">Verification Status:</span>
                  <span className="font-semibold text-success">{panNumber ? 'Verified Demo KYC' : 'Pending'}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-charcoal-muted">Dynamic Profile Score:</span>
                  <span className="font-bold text-wine">{percentage}%</span>
                </div>
              </div>

              <div className="p-3 bg-sand/30 rounded-xl border border-sand-dark text-[11px] text-charcoal-muted">
                Your vendor portal will now be activated. You will be able to manage inventory, track bookings, and respond to customer chat enquiries immediately.
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl border border-border hover:bg-sand/40 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-6 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Business Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

