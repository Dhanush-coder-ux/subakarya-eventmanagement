import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  CalendarCheck,
  Package,
  FileCheck,
  CreditCard,
  Image as ImageIcon,
  Check,
  Briefcase,
  Store,
  Upload,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { KYCStatus, ProfessionalCategory } from '../types';
import { calculateDetailedProfessionalCompleteness } from '../utils';

const BUSINESS_CATEGORIES: ProfessionalCategory[] = [
  'Event Organizer',
  'Photographer',
  'Videographer',
  'Makeup Artist',
  'Caterer',
  'Wedding Decorator',
  'Event Hall',
  'DJ and Entertainment',
  'Event Equipment Supplier',
  'Furniture and Rental Supplier',
  'Other',
];

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Individual',
  'Partnership',
  'Private Limited',
  'LLP',
];

const DEFAULT_PORTFOLIO_PRESETS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
];

export const ProfessionalOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount, activateProfessionalProfile } = useAuthStore();
  const {
    businessMode: initialBusinessMode,
    setBusinessMode,
    addService,
    addInventoryItem,
  } = useMarketplaceStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1: Professional Information
  const [businessName, setBusinessName] = useState(
    userAccount.professionalProfile?.businessName || `${userAccount.fullName} Studios`
  );
  const [professionalUsername, setProfessionalUsername] = useState(
    userAccount.professionalProfile?.username ||
      `${userAccount.fullName.toLowerCase().replace(/\s+/g, '_')}_pro`
  );
  const [category, setCategory] = useState<ProfessionalCategory>(
    (userAccount.professionalProfile?.category as ProfessionalCategory) || 'Photographer'
  );
  const [description, setDescription] = useState(
    userAccount.professionalProfile?.description ||
      'Award-winning visual storytellers specializing in cinematic wedding films, candid celebrations, and luxury event production.'
  );
  const [location, setLocation] = useState(
    userAccount.professionalProfile?.location || userAccount.personalProfile.location || 'Madurai, Tamil Nadu'
  );
  const [contactNumber, setContactNumber] = useState(
    userAccount.professionalProfile?.contact || userAccount.phone || '+91 94432 87654'
  );
  const [businessEmail, setBusinessEmail] = useState(
    userAccount.professionalProfile?.businessEmail || userAccount.email
  );
  const [portfolioImages, setPortfolioImages] = useState<string[]>(
    userAccount.professionalProfile?.portfolioImages || DEFAULT_PORTFOLIO_PRESETS
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // STEP 2: Identity & KYC
  const [panNumber, setPanNumber] = useState(
    userAccount.professionalProfile?.panNumber || 'AAAPL1234K'
  );
  const [panHolderName, setPanHolderName] = useState(
    userAccount.professionalProfile?.panHolderName || userAccount.fullName
  );
  const [businessType, setBusinessType] = useState(
    userAccount.professionalProfile?.businessType || 'Sole Proprietorship'
  );
  const [legalBusinessName, setLegalBusinessName] = useState(
    userAccount.professionalProfile?.legalBusinessName || businessName
  );
  const [gstin, setGstin] = useState(
    userAccount.professionalProfile?.gstin || '33AAAPL1234K1Z5'
  );
  const [kycStatus, setKycStatus] = useState<KYCStatus>(
    userAccount.professionalProfile?.kycStatus || 'VERIFIED'
  );
  const [mockDocumentName, setMockDocumentName] = useState('PAN_Card_Scanned_Copy.pdf');

  // STEP 3: Business Operating Mode
  const [businessMode, setLocalBusinessMode] = useState<'BOOKING_BASED' | 'ORDER_BASED'>(
    (userAccount.professionalProfile?.businessMode as 'BOOKING_BASED' | 'ORDER_BASED') ||
      initialBusinessMode ||
      'BOOKING_BASED'
  );

  // STEP 4: Configuration & Completeness
  const [starterItemTitle, setStarterItemTitle] = useState(
    businessMode === 'ORDER_BASED'
      ? 'Royal Brass Floral Mandap Props'
      : 'Full Day Cinematic Wedding Package'
  );
  const [starterPrice, setStarterPrice] = useState(
    businessMode === 'ORDER_BASED' ? 12000 : 35000
  );
  const [bankAccountHolder, setBankAccountHolder] = useState(userAccount.fullName);
  const [bankAccountNumber, setBankAccountNumber] = useState('987654321098');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [bankName, setBankName] = useState('HDFC Bank - Heritage Branch');
  const [hasAvailabilitySlots, setHasAvailabilitySlots] = useState(true);

  // Dynamic Profile Completeness Calculation
  const completeness = calculateDetailedProfessionalCompleteness({
    businessName,
    category,
    location,
    avatar: userAccount.personalProfile.avatar,
    description,
    contact: contactNumber,
    businessEmail,
    portfolioImages,
    portfolioCount: portfolioImages.length,
    servicesCount: businessMode === 'BOOKING_BASED' && starterItemTitle ? 1 : 0,
    productsCount: businessMode === 'ORDER_BASED' && starterItemTitle ? 1 : 0,
    pricingConfigured: starterPrice > 0,
    businessMode,
    hasAvailabilitySlots: businessMode === 'BOOKING_BASED' ? hasAvailabilitySlots : undefined,
    hasInventoryItems: businessMode === 'ORDER_BASED' ? true : undefined,
    bankAccountConfigured: Boolean(bankAccountNumber && ifscCode),
  });

  const handleAddPortfolioImage = () => {
    if (!newImageUrl.trim()) return;
    setPortfolioImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemovePortfolioImage = (index: number) => {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinishActivation = () => {
    // 1. Sync operating mode in marketplace store
    setBusinessMode(businessMode);

    // 2. Add sample starter service or product
    const proId = `pro-${userAccount.id}`;
    if (businessMode === 'BOOKING_BASED' && starterItemTitle) {
      addService({
        professionalId: proId,
        name: starterItemTitle,
        category,
        description: description.slice(0, 100),
        pricingModel: 'fixed',
        basePrice: starterPrice,
        inclusions: [
          'Pre-event consultation',
          'Standard coverage deliverables',
          'Digital master delivery',
        ],
        isActive: true,
      });
    } else if (businessMode === 'ORDER_BASED' && starterItemTitle) {
      addInventoryItem({
        professionalId: proId,
        name: starterItemTitle,
        sku: `SKU-${Date.now().toString().slice(-5)}`,
        category,
        description: description.slice(0, 100),
        inventoryType: 'asset',
        classification: 'rental',
        totalQuantity: 5,
        availableQuantity: 5,
        allocatedQuantity: 0,
        damagedQuantity: 0,
        lowStockThreshold: 1,
        rentalRate: starterPrice,
        unit: 'sets',
        productStatus: 'active',
        image: portfolioImages[0] || '',
        images: portfolioImages.slice(0, 2),
      });
    }

    // 3. Activate professional profile on unified user account
    activateProfessionalProfile({
      professionalId: proId,
      businessName,
      username: professionalUsername,
      category,
      description,
      location,
      coverageArea: location,
      contact: contactNumber,
      businessEmail,
      portfolioImages,
      kycStatus,
      panNumber,
      panHolderName,
      businessType,
      legalBusinessName,
      gstin,
      verificationStatus: kycStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
      businessMode,
      profileCompletion: completeness.percentage,
      isActive: true,
      bankDetails: {
        accountHolderName: bankAccountHolder,
        accountNumber: bankAccountNumber,
        ifscCode,
        bankName,
      },
    });

    // 4. Navigate directly to professional dashboard
    navigate('/dashboard');
  };

  const steps = [
    { num: 1, title: 'Business Information' },
    { num: 2, title: 'Identity & KYC' },
    { num: 3, title: 'Business Mode' },
    { num: 4, title: 'Profile Completion' },
  ];

  return (
    <div className="min-h-screen bg-sand/15 flex flex-col text-charcoal">
      {/* 1. SaaS Top Bar */}
      <header className="border-b border-border bg-surface px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/crimson-ribbon-s-logo.png"
              alt="Subakarya"
              className="w-7 h-7 object-contain"
            />
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div>
              <h1 className="text-sm font-bold text-charcoal leading-none">
                Set Up Your Professional Account
              </h1>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                Configure your commercial profile and business tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-charcoal-muted hidden md:inline">
              Step <strong className="text-charcoal font-semibold">{currentStep}</strong> of 4
            </span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-charcoal-muted hover:text-charcoal px-2.5 py-1.5 rounded-lg border border-border hover:bg-sand/30 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Slim Horizontal Progress Indicator */}
      <div className="border-b border-border bg-surface-card px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between w-full">
              {steps.map((stepItem, idx) => {
                const isCompleted = currentStep > stepItem.num;
                const isCurrent = currentStep === stepItem.num;
                return (
                  <li
                    key={stepItem.num}
                    className={`flex items-center ${idx !== steps.length - 1 ? 'flex-1' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => setCurrentStep(stepItem.num as 1 | 2 | 3 | 4)}
                      className="group flex items-center gap-2.5 text-left focus:outline-none"
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors ${
                          isCurrent
                            ? 'bg-wine text-white border-wine'
                            : isCompleted
                            ? 'bg-sand text-wine border-wine'
                            : 'bg-surface text-charcoal-muted border-border group-hover:border-sand-dark'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          stepItem.num
                        )}
                      </span>
                      <div className="hidden sm:block">
                        <span
                          className={`text-xs block font-semibold transition-colors ${
                            isCurrent
                              ? 'text-wine font-bold'
                              : isCompleted
                              ? 'text-charcoal'
                              : 'text-charcoal-muted'
                          }`}
                        >
                          {stepItem.title}
                        </span>
                      </div>
                    </button>

                    {idx !== steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2.5 sm:mx-4 transition-colors ${
                          currentStep > idx + 1 ? 'bg-wine' : 'bg-border'
                        }`}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* 3. Main Onboarding Form Canvas (Full viewport width with natural page scroll) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-surface rounded-xl border border-border">
          {/* STEP 1: Business Information */}
          {currentStep === 1 && (
            <div className="p-5 sm:p-7 space-y-6 animate-in fade-in duration-150">
              {/* Section Header */}
              <div className="border-b border-border/80 pb-4">
                <h2 className="text-base font-bold text-charcoal">1. Business Information</h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Provide commercial details about your brand, specialty, and services location.
                </p>
              </div>

              {/* Form Grid */}
              <div className="space-y-4">
                {/* Row 1: Business Name & Username */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Business or Studio Name <span className="text-wine">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Lumière Cinematic Studios"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Professional Username <span className="text-wine">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-charcoal-muted">@</span>
                      <input
                        type="text"
                        required
                        value={professionalUsername}
                        onChange={(e) => setProfessionalUsername(e.target.value)}
                        placeholder="lumiere_studios"
                        className="w-full text-xs pl-7 pr-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Category & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Business Category <span className="text-wine">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProfessionalCategory)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    >
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Primary Location & City <span className="text-wine">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Madurai, Tamil Nadu"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Business Description (Full Width) */}
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    Business Description <span className="text-wine">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Highlight your signature style, background, and what clients can expect..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-charcoal-muted mt-1">
                    Minimum 15 characters. This summary will appear on your professional profile.
                  </p>
                </div>

                {/* Row 4: Contact Number & Business Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Direct Contact Phone <span className="text-wine">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+91 94432 87654"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Business Email Address <span className="text-wine">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder="contact@lumierecinema.com"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 5: Compact Portfolio Media Gallery */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-charcoal block mb-1.5">
                    Portfolio Gallery ({portfolioImages.length})
                  </label>
                  <p className="text-[11px] text-charcoal-muted mb-2">
                    Showcase samples of your previous work or product inventory images.
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 mb-2.5">
                    {portfolioImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-lg overflow-hidden border border-border bg-sand/30 group"
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add URL field */}
                  <div className="flex items-center gap-2 max-w-lg">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Add image URL (Unsplash or direct image link)..."
                      className="flex-1 text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddPortfolioImage}
                      className="px-3.5 py-2 rounded-lg border border-border bg-surface hover:bg-sand/30 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="text-xs text-charcoal-muted">All marked fields (*) are required.</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Continue to Step 2: Identity & KYC</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Identity & KYC */}
          {currentStep === 2 && (
            <div className="p-5 sm:p-7 space-y-6 animate-in fade-in duration-150">
              {/* Section Header */}
              <div className="border-b border-border/80 pb-4">
                <h2 className="text-base font-bold text-charcoal">2. Identity & Business KYC Verification</h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Submit required identity and tax credentials to qualify for verified merchant status.
                </p>
              </div>

              {/* Security Banner */}
              <div className="p-3 rounded-lg bg-sand/40 border border-sand-dark flex items-start gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-wine shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-charcoal">Prototype Verification Notice</p>
                  <p className="text-[11px] text-charcoal-muted mt-0.5 leading-relaxed">
                    Sensitive verification data is simulated for this demonstration. Real identity documents are never transmitted or stored in browser storage.
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Permanent Account Number (PAN) <span className="text-wine">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. AAAPL1234K"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal font-mono uppercase focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      PAN Card Holder Name <span className="text-wine">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={panHolderName}
                      onChange={(e) => setPanHolderName(e.target.value)}
                      placeholder="Matching legal PAN records"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Business Entity Type <span className="text-wine">*</span>
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    >
                      {BUSINESS_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Legal Business Name (if applicable)
                    </label>
                    <input
                      type="text"
                      value={legalBusinessName}
                      onChange={(e) => setLegalBusinessName(e.target.value)}
                      placeholder="e.g. Lumiere Cinematic LLP"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      GSTIN Identification <span className="text-charcoal-muted font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 33AAAPL1234K1Z5"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal font-mono uppercase focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Required Identity Document
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-surface">
                      <FileCheck className="w-4 h-4 text-wine shrink-0" />
                      <span className="text-xs text-charcoal truncate flex-1">{mockDocumentName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sand/70 font-semibold text-wine border border-sand-dark">
                        Uploaded
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mock KYC Verification State Switcher */}
                <div className="p-3.5 rounded-lg border border-border bg-surface-card space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-charcoal">Simulated Verification Status</p>
                      <p className="text-[11px] text-charcoal-muted">
                        Test and evaluate merchant states in this prototype
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
                        kycStatus === 'VERIFIED'
                          ? 'bg-success-light text-success border-success/30'
                          : kycStatus === 'PENDING'
                          ? 'bg-sand text-wine border-sand-dark'
                          : kycStatus === 'REJECTED'
                          ? 'bg-error-light text-error border-error/30'
                          : 'bg-surface text-charcoal-muted border-border'
                      }`}
                    >
                      {kycStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(['NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED'] as KYCStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setKycStatus(status)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                            kycStatus === status
                              ? 'bg-wine text-white border-wine'
                              : 'bg-surface hover:bg-sand/30 border-border text-charcoal'
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Continue to Step 3: Business Mode</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Business Operating Mode */}
          {currentStep === 3 && (
            <div className="p-5 sm:p-7 space-y-6 animate-in fade-in duration-150">
              {/* Section Header */}
              <div className="border-b border-border/80 pb-4">
                <h2 className="text-base font-bold text-charcoal">3. Business Operating Mode</h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Select your core business model. You can switch between these modes at any time in Settings.
                </p>
              </div>

              {/* Mode Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mode 1: Booking Management Mode */}
                <div
                  onClick={() => setLocalBusinessMode('BOOKING_BASED')}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    businessMode === 'BOOKING_BASED'
                      ? 'border-wine bg-wine-soft/25'
                      : 'border-border bg-surface hover:border-sand-dark hover:bg-sand/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-sand/70 text-wine flex items-center justify-center border border-sand-dark">
                        <CalendarCheck className="w-4 h-4" />
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          businessMode === 'BOOKING_BASED'
                            ? 'bg-wine border-wine text-white'
                            : 'border-border'
                        }`}
                      >
                        {businessMode === 'BOOKING_BASED' && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-charcoal">Booking Management Mode</h3>
                      <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                        For service professionals who provide event services, manage schedule dates, and accept appointments.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/60">
                      <p className="text-[11px] font-semibold text-wine mb-1.5 uppercase tracking-wider">
                        Features Enabled
                      </p>
                      <ul className="text-xs text-charcoal space-y-1">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                          <span>Availability calendar & slot scheduling</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                          <span>Itemized quotation proposals</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                          <span>Service packages & tiered pricing</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                          <span>Repost submissions & customer reviews</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-border/50">
                    <span className="text-xs font-semibold text-wine">
                      {businessMode === 'BOOKING_BASED' ? '✓ Selected Mode' : 'Click to Select'}
                    </span>
                  </div>
                </div>

                {/* Mode 2: Order Management Mode */}
                <div
                  onClick={() => setLocalBusinessMode('ORDER_BASED')}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    businessMode === 'ORDER_BASED'
                      ? 'border-wine bg-wine-soft/25'
                      : 'border-border bg-surface hover:border-sand-dark hover:bg-sand/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-sand/70 text-wine flex items-center justify-center border border-sand-dark">
                        <Package className="w-4 h-4" />
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          businessMode === 'ORDER_BASED'
                            ? 'bg-wine border-wine text-white'
                            : 'border-border'
                        }`}
                      >
                        {businessMode === 'ORDER_BASED' && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-charcoal">Order Management Mode</h3>
                      <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                        For vendors selling physical products, audio/visual rentals, decorations, and rental gear.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/60">
                      <p className="text-[11px] font-semibold text-wine mb-1.5 uppercase tracking-wider">
                        Features Enabled
                      </p>
                      <ul className="text-xs text-charcoal space-y-1">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                          <span>Product catalog & SKU inventory</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                          <span>Stock tracking & warehouse allocation</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                          <span>Order delivery & dispatch status</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                          <span>Rental returns & deposit management</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-border/50">
                    <span className="text-xs font-semibold text-wine">
                      {businessMode === 'ORDER_BASED' ? '✓ Selected Mode' : 'Click to Select'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Continue to Step 4: Profile Completion</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Profile Completion & Readiness */}
          {currentStep === 4 && (
            <div className="p-5 sm:p-7 space-y-6 animate-in fade-in duration-150">
              {/* Section Header */}
              <div className="border-b border-border/80 pb-4">
                <h2 className="text-base font-bold text-charcoal">4. Professional Profile Completion</h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Verify profile readiness score and configure initial commercial details before workspace activation.
                </p>
              </div>

              {/* Completion Progress Gauge */}
              <div className="p-4 rounded-lg bg-surface-card border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      Overall Completion Readiness
                    </span>
                    <p className="text-[11px] text-charcoal-muted mt-0.5">
                      {completeness.percentage === 100
                        ? 'All mandatory and optional sections are complete.'
                        : completeness.isReadyForActivation
                        ? 'All mandatory sections are satisfied. Ready to activate.'
                        : `Mandatory sections missing: ${completeness.missingMandatory.join(', ')}`}
                    </p>
                  </div>
                  <span className="text-xl font-bold text-wine">{completeness.percentage}%</span>
                </div>

                <div className="w-full h-2 bg-sand/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      completeness.percentage >= 90
                        ? 'bg-success'
                        : completeness.percentage >= 60
                        ? 'bg-wine'
                        : 'bg-sand-dark'
                    }`}
                    style={{ width: `${completeness.percentage}%` }}
                  />
                </div>
              </div>

              {/* 9-Section Checklist Grid */}
              <div>
                <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                  Section Checklist (9 Requirements)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {completeness.breakdown.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                        item.completed
                          ? 'border-success/30 bg-success-light/20 text-charcoal'
                          : item.isMandatory
                          ? 'border-error/30 bg-error-light/20 text-charcoal'
                          : 'border-border bg-surface text-charcoal-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        ) : (
                          <AlertCircle
                            className={`w-4 h-4 shrink-0 ${
                              item.isMandatory ? 'text-error' : 'text-charcoal-muted'
                            }`}
                          />
                        )}
                        <div className="truncate">
                          <span className="font-semibold block truncate text-xs">{item.section}</span>
                          <span className="text-[10px] text-charcoal-muted truncate block">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-wine pl-2 shrink-0">
                        +{item.weight}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Starter Item & Bank Details Configuration Form */}
              <div className="pt-2 border-t border-border/70 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                    Starter Package & Payout Details
                  </h3>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                    Configure your initial item and payout credentials to reach full 100% profile completeness.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      {businessMode === 'ORDER_BASED'
                        ? 'First Catalog Product Name'
                        : 'Primary Service Package Name'} <span className="text-wine">*</span>
                    </label>
                    <input
                      type="text"
                      value={starterItemTitle}
                      onChange={(e) => setStarterItemTitle(e.target.value)}
                      placeholder="e.g. Royal Wedding Package"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Base Price (INR ₹) <span className="text-wine">*</span>
                    </label>
                    <input
                      type="number"
                      value={starterPrice}
                      onChange={(e) => setStarterPrice(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="987654321098"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="HDFC0001234"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal font-mono uppercase focus:border-wine focus:ring-1 focus:ring-wine/20 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {completeness.missingMandatory.length > 0 && (
                <div className="p-3 rounded-lg bg-error-light/40 border border-error/30 text-xs text-error flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Please complete all mandatory sections before activation: {completeness.missingMandatory.join(', ')}
                  </span>
                </div>
              )}

              {/* Actions Footer */}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={!completeness.isReadyForActivation}
                  onClick={handleFinishActivation}
                  className="px-6 py-2.5 rounded-lg bg-wine hover:bg-wine-dark disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Activate Professional Account</span>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
