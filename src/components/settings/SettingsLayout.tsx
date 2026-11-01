import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, Settings as SettingsIcon } from 'lucide-react';
import { SettingsSidebar } from './SettingsSidebar';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

// Sections
import { YourActivitySection } from './sections/YourActivitySection';
import { AccountInfoSection } from './sections/AccountInfoSection';
import { BusinessProfileSection } from './sections/BusinessProfileSection';
import { AccountBankSection } from './sections/AccountBankSection';
import { OrdersManagementSection } from './sections/OrdersManagementSection';
import { BookingManagementSection } from './sections/BookingManagementSection';
import { RepostActivitySection } from './sections/RepostActivitySection';
import { ProfessionalDashboardSection } from './sections/ProfessionalDashboardSection';
import { SavedContentSection } from './sections/SavedContentSection';
import { PrivacySecuritySection } from './sections/PrivacySecuritySection';
import { NotificationsSection } from './sections/NotificationsSection';
import { HelpSupportSection } from './sections/HelpSupportSection';
import { SwitchAccountSection } from './sections/SwitchAccountSection';
import { BusinessManagementSection } from './sections/BusinessManagementSection';

interface SettingsLayoutProps {
  currentSection?: string;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  currentSection: propSection,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { section: urlSection } = useParams<{ section?: string }>();
  const { accountType, currentUser } = useAuthStore();
  const { repostRequests, orders, businessMode } = useMarketplaceStore();

  const isCustomer = accountType === 'customer';

  // Determine active section: URL param > prop > default for desktop
  // Default for customer: 'activity'
  // Default for professional: 'dashboard'
  const defaultSection = isCustomer ? 'activity' : 'dashboard';
  const rawSection = urlSection || propSection;

  // On mobile, if we are exactly on /settings with no section param, we show the category menu first
  const isMobileListOnly = !rawSection;
  const activeSection = rawSection || defaultSection;

  const pendingReposts = repostRequests.filter(
    (r) => r.professionalId === currentUser.id && r.status === 'PENDING'
  ).length;

  const unreadOrders = orders.filter(
    (o) => !isCustomer && o.professionalId === currentUser.id && o.orderStatus === 'confirmed'
  ).length;

  const handleSelectSection = (sectionId: string) => {
    if (sectionId === 'logout') {
      navigate('/settings/switch');
      return;
    }
    navigate(`/settings/${sectionId}`);
  };

  const handleMobileBack = () => {
    navigate('/settings');
  };

  // Section title mapping for mobile sub-header
  const getSectionTitle = (id: string) => {
    switch (id) {
      case 'dashboard':
        return businessMode === 'ORDER_BASED' ? 'Seller Dashboard' : 'Professional Dashboard';
      case 'business-mode':
      case 'business-management':
        return 'Business Operating Mode';
      case 'business-profile':
        return 'Business Profile';
      case 'activity':
        return 'Your Activity';
      case 'account':
        return 'Account Information';
      case 'account-bank':
        return isCustomer ? 'Payment Preferences' : 'Account & Bank Details';
      case 'orders':
        return 'Orders Management';
      case 'bookings':
        return 'Booking Management';
      case 'reposts':
      case 'repost-requests':
        return 'Repost Activity';
      case 'saved':
        return 'Saved Content';
      case 'privacy':
        return 'Privacy & Security';
      case 'notifications':
        return 'Notifications';
      case 'help':
        return 'Help & Support';
      case 'switch':
        return 'Switch Account';
      default:
        return id.replace(/-/g, ' ');
    }
  };

  // Render the selected section component
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'activity':
        return <YourActivitySection />;
      case 'dashboard':
        return isCustomer ? <YourActivitySection /> : <ProfessionalDashboardSection />;
      case 'business-mode':
      case 'business-management':
        return <BusinessManagementSection />;
      case 'business-profile':
        return <BusinessProfileSection />;
      case 'account':
        return <AccountInfoSection />;
      case 'account-bank':
        return <AccountBankSection />;
      case 'orders':
        return <OrdersManagementSection />;
      case 'bookings':
        return <BookingManagementSection />;
      case 'reposts':
      case 'repost-requests':
        return <RepostActivitySection />;
      case 'saved':
        return <SavedContentSection />;
      case 'privacy':
        return <PrivacySecuritySection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'help':
        return <HelpSupportSection />;
      case 'switch':
        return <SwitchAccountSection />;
      case 'services':
        navigate('/services');
        return null;
      case 'inventory':
        navigate('/inventory');
        return null;
      case 'availability':
        navigate('/professional/availability');
        return null;
      default:
        return isCustomer ? <YourActivitySection /> : <ProfessionalDashboardSection />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-surface overflow-hidden">
      {/* Mobile Top Header (only on mobile screens when list-only) */}
      <header className="md:hidden border-b border-border bg-surface px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sand/60 text-wine flex items-center justify-center shrink-0 border border-sand-dark">
              <SettingsIcon className="w-4 h-4 stroke-[2px]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-charcoal tracking-tight">Settings</h1>
              <p className="text-[11px] text-charcoal-muted">Preferences & Account</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sand/50 text-charcoal border border-sand-dark text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-wine" />
            <span>
              {isCustomer
                ? 'Customer View'
                : businessMode === 'ORDER_BASED'
                ? 'Seller Mode'
                : 'Booking Mode'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Settings Body */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* ========================================================= */}
        {/* DESKTOP TWO-COLUMN VIEW (md and up)                       */}
        {/* ========================================================= */}
        {/* Left Settings Sidebar: STATIC in place                    */}
        <aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-border bg-surface px-3 py-6 h-full overflow-y-auto">
          <SettingsSidebar
            accountType={accountType}
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            pendingRepostsCount={pendingReposts}
            unreadOrdersCount={unreadOrders}
          />
        </aside>

        {/* Right Settings Content Section: ONLY SCROLLABLE AREA      */}
        <main className="hidden md:block flex-1 min-w-0 h-full overflow-y-auto bg-surface px-6 py-6 lg:px-10 lg:py-8">
          {renderSectionContent()}
        </main>

        {/* ========================================================= */}
        {/* MOBILE VIEW (less than md)                                */}
        {/* ========================================================= */}
        <div className="md:hidden flex-1 flex flex-col min-h-0 overflow-hidden">
          {isMobileListOnly ? (
            /* Mobile Category List Screen */
            <div className="p-4 bg-surface flex-1 overflow-y-auto pb-20">
              <SettingsSidebar
                accountType={accountType}
                activeSection=""
                onSelectSection={handleSelectSection}
                pendingRepostsCount={pendingReposts}
                unreadOrdersCount={unreadOrders}
              />
            </div>
          ) : (
            /* Mobile Detail Screen with Back Navigation */
            <div className="flex-1 flex flex-col bg-surface min-h-0 overflow-hidden">
              <div className="sticky top-0 z-20 px-4 py-3 bg-surface border-b border-border flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={handleMobileBack}
                  className="flex items-center gap-1.5 text-xs font-semibold text-wine hover:text-wine-dark transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <span className="text-xs font-semibold text-charcoal truncate max-w-[200px]">
                  {getSectionTitle(activeSection)}
                </span>
              </div>

              <div className="p-4 flex-1 overflow-y-auto pb-10">
                {renderSectionContent()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
