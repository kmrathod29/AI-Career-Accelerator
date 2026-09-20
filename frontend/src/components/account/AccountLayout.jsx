import { Outlet } from "react-router-dom";
import {
  AccountSidebar,
  AccountMobileNav,
  useSidebarCollapse,
} from "./AccountSidebar.jsx";
import { SectionHeader } from "./shared/SettingsCard.jsx";

export function AccountLayout({ outletContext }) {
  const { collapsed, toggleCollapse } = useSidebarCollapse();

  return (
    <div className="mx-auto min-w-0 max-w-6xl overflow-x-hidden">
      <SectionHeader
        eyebrow="Account"
        title="Account Center"
        description="Manage your profile, preferences, and account security."
      />

      <AccountMobileNav />

      <div className="mt-3 flex flex-col gap-4 md:mt-4 md:flex-row md:gap-6 lg:gap-8">
        <AccountSidebar
          collapsed={collapsed}

          onToggleCollapse={toggleCollapse}
        />

        <div className="min-w-0 flex-1">
          <Outlet context={outletContext} />
        </div>
      </div>
    </div>
  );
}
