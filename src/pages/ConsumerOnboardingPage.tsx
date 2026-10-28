import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const ConsumerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateCustomerProfile, setAccountType } = useAuthStore();

  const [name, setName] = useState('Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@example.com');
  const [phone, setPhone] = useState('+91 98450 12345');
  const [location, setLocation] = useState('Madurai, Tamil Nadu');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      name,
      email,
      phone,
      location,
      avatar,
    });
    setAccountType('customer');
    setCompleted(true);
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-sand/30 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-surface-card rounded-2xl border border-border shadow-elevated p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-wine text-sand font-serif-display font-bold text-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            S
          </div>
          <h1 className="font-serif-display text-2xl font-bold text-charcoal">
            Customer Profile Registration
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Create your event planning identity to request personalized quotes
          </p>
        </div>

        {completed ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-charcoal">Profile Created Successfully!</h3>
            <p className="text-xs text-charcoal-muted">Redirecting you to the discovery feed...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4 p-3 bg-surface-muted rounded-xl border border-border/80">
              <img
                src={avatar}
                alt="Avatar Preview"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-wine/40"
              />
              <div className="flex-1">
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
            </div>

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
                className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-wine" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-wine" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-wine" />
                <span>City / Primary Location</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold tracking-wider transition-all duration-150 shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Complete Customer Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
