import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs text-charcoal-muted ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.path && !isLast ? (
              <Link to={item.path} className="hover:text-wine hover:underline truncate">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-semibold text-charcoal truncate' : 'truncate'}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="w-3 h-3 text-charcoal-muted/60 shrink-0" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
