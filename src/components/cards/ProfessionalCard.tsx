import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { ProfessionalProfile } from '../../types';
import { formatINR } from '../../utils';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';
import { useAuthStore } from '../../store/useAuthStore';

interface ProfessionalCardProps {
  professional: ProfessionalProfile;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const navigate = useNavigate();
  const { initiateBookingChat } = useMarketplaceStore();
  const { currentUser } = useAuthStore();

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateBookingChat(professional.id, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      phone: currentUser.phone,
    });
    navigate('/chat');
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card hover:border-wine/40 hover:shadow-elevated transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-3 sm:gap-3.5 mb-3 sm:mb-3.5">
          <img
            src={professional.avatar}
            alt={professional.businessName}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover ring-2 ring-sand-dark shrink-0 group-hover:scale-102 transition-transform"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base text-charcoal truncate group-hover:text-wine transition-colors">
                {professional.businessName}
              </h3>
              {professional.isVerified && (
                <span title="Verified Professional" className="shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-wine fill-sand shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5 truncate">{professional.category}</p>
            <div className="flex items-center gap-1 text-[11px] text-charcoal-light mt-1">
              <MapPin className="w-3 h-3 text-wine shrink-0" />
              <span className="truncate">{professional.location}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed mb-3 sm:mb-4">
          {professional.description}
        </p>

        <div className="grid grid-cols-2 gap-2 p-2.5 bg-sand/30 rounded-xl mb-3.5 sm:mb-4 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">Experience</span>
            <span className="font-semibold text-charcoal truncate block">{professional.experienceYears} Years</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">Starts From</span>
            <span className="font-semibold text-wine truncate block">
              {professional.minBookingAmount ? formatINR(professional.minBookingAmount) : 'Custom Quote'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
        <Link
          to={`/profile/${professional.id}`}
          className="flex-1 py-2 text-center rounded-lg border border-border hover:bg-sand/40 text-xs font-semibold text-charcoal transition-colors truncate active:scale-95"
        >
          View Profile
        </Link>
        <button
          onClick={handleBookNow}
          className="flex-1 py-2 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-semibold tracking-wide transition-all duration-150 flex items-center justify-center gap-1 shadow-xs active:scale-95 truncate"
        >
          <span>Book Now</span>
          <ArrowRight className="w-3 h-3 shrink-0" />
        </button>
      </div>
    </div>
  );
};
