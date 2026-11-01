import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, MapPin, Globe, FileText, CheckCircle2, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
];

export const ConsumerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userAccount, updatePersonalProfile, switchExperience } = useAuthStore();

  const [name, setName] = useState(userAccount.fullName || 'Priya Sharma');
  const [username, setUsername] = useState(
    userAccount.personalProfile.username ||
      (userAccount.fullName ? userAccount.fullName.toLowerCase().replace(/\s+/g, '_') : 'priya_events')
  );
  const [bio, setBio] = useState(
    userAccount.personalProfile.bio || 'Event curator & aesthetic wedding enthusiast | Planning dream family milestones ✨'
  );
  const [location, setLocation] = useState(userAccount.personalProfile.location || 'Madurai, Tamil Nadu');
  const [website, setWebsite] = useState(userAccount.personalProfile.website || 'https://priyasharma.me');
  const [avatar, setAvatar] = useState(userAccount.personalProfile.avatar || AVATAR_PRESETS[0]);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalProfile({
      fullName: name.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
      bio: bio.trim(),
      location: location.trim(),
      website: website.trim() || undefined,
      avatar,
    });
    switchExperience('PERSONAL');
    setCompleted(true);
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-sand/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-surface-card rounded-2xl border border-border shadow-elevated p-6 sm:p-8">
        <div className="text-center mb-6">
          <img
            src="/subakarya-logo.png"
            alt="Subakarya Logo"
            className="w-16 h-16 mx-auto object-contain mb-3 drop-shadow-md"
          />
          <h1 className="font-bold text-2xl text-charcoal">
            Personal Profile Setup
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Customize your public presence to follow artists, save reels, and book event services
          </p>
        </div>

        {completed ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-charcoal">Profile Ready!</h3>
            <p className="text-xs text-charcoal-muted">Redirecting you to the discovery feed...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Selection & Preview */}
            <div className="p-4 bg-surface-muted rounded-xl border border-border/80 space-y-3">
              <label className="text-xs font-semibold text-charcoal block">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-wine/40 shadow-xs"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <span className="text-[11px] text-charcoal-muted block">Choose an avatar preset or paste image URL:</span>
                  <div className="flex items-center gap-2">
                    {AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(p)}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                          avatar === p ? 'border-wine scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>
            </div>

            {/* Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-wine" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                  <AtSign className="w-3.5 h-3.5 text-wine" />
                  <span>Unique Username</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="priya_events"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-wine" />
                <span>Bio / Description</span>
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others what you love or what celebrations you're planning..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine resize-none"
              />
            </div>

            {/* Location & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-wine" />
                  <span>Location</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Madurai, Tamil Nadu"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                  <Globe className="w-3.5 h-3.5 text-wine" />
                  <span>Website <span className="text-charcoal-muted font-normal">(Optional)</span></span>
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold tracking-wider transition-all duration-150 shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>Save Profile & Explore Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
