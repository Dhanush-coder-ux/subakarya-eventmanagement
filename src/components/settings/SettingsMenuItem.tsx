import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface SettingsItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  category?: string;
  badge?: string | number;
  badgeVariant?: 'wine' | 'sand' | 'success';
  description?: string;
}

interface SettingsMenuItemProps {
  item: SettingsItemConfig;
  isActive: boolean;
  onClick: () => void;
}

export const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({
  item,
  isActive,
  onClick,
}) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
        isActive
          ? 'bg-sand/70 text-wine font-semibold border-l-2 border-wine pl-2.5'
          : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30 font-medium'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon
          className={`w-4 h-4 shrink-0 stroke-[1.75] ${
            isActive ? 'text-wine' : 'text-charcoal-muted'
          }`}
        />
        <span className={`text-xs truncate ${isActive ? 'text-wine' : 'text-charcoal'}`}>
          {item.label}
        </span>
      </div>

      {item.badge !== undefined && (
        <span
          className={`ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded shrink-0 ${
            item.badgeVariant === 'wine'
              ? 'bg-wine text-white'
              : item.badgeVariant === 'success'
              ? 'bg-success text-white'
              : 'bg-sand text-charcoal border border-sand-dark'
          }`}
        >
          {item.badge}
        </span>
      )}
    </button>
  );
};
