import { Outlet, useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { Sidebar } from '../../../../core/presentation/components/ui/Sidebar';
import { Topbar } from '../../../../core/presentation/components/ui/Topbar';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { authService } from '../../../auth/infrastructure/services/auth.service';
import { organizationService } from '../../../organizations/infrastructure/services/organization.service';
import { navigationService } from '../../../../core/services/navigation.service';
import type {
  RoleName,
  OrganizationOption,
} from '../../../../core/types/navigation/navigation.types';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    logout: clearAuth,
    selectedOrganization,
    setSelectedOrganization,
    hideTopbar,
    setHideTopbar,
  } = useAuthStore();
  const [activeNavId, setActiveNavId] = useState('dashboard');
  const [orgOptions, setOrgOptions] = useState<OrganizationOption[]>([]);

  const roleName = user?.role?.name as RoleName | undefined;
  const navItems = navigationService.getNavigationByRole(roleName);

  useEffect(() => {
    const path = location.pathname;
    const findActiveId = (items: typeof navItems): string | undefined => {
      for (const item of items) {
        if (item.path && path.startsWith(item.path)) {
          if (item.children) {
            const childMatch = item.children.find((c) =>
              path.startsWith(c.path || '')
            );
            return childMatch ? childMatch.id : item.id;
          }
          return item.id;
        }
      }
      return undefined;
    };
    const newActiveId = findActiveId(navItems);
    if (newActiveId && newActiveId !== activeNavId) {
      setActiveNavId(newActiveId);
    }
  }, [location.pathname, navItems, activeNavId]);

  const isOrganizationsPage = location.pathname.startsWith(
    '/dashboard/organizations'
  );

  useEffect(() => {
    const loadOrganizations = async () => {
      if (!user?.organizationId) return;

      try {
        const currentOrgId = user.organizationId;
        const currentOrgName = user.organization?.name || 'Interno';

        const childrenOrgsData =
          await organizationService.getOrganizationsByParent(currentOrgId);

        const orgChildrenOptions: OrganizationOption[] = childrenOrgsData.map(
          (org) => ({
            value: org.id,
            label: org.name,
            description: org.slug,
          })
        );

        const options: OrganizationOption[] = [
          {
            value: currentOrgId,
            label: 'Interno',
            description: currentOrgName,
          },
          ...orgChildrenOptions,
        ];

        setOrgOptions(options);

        if (!selectedOrganization) {
          setSelectedOrganization({
            id: currentOrgId,
            name: currentOrgName,
            slug: options[0].description,
            isInternal: true,
          });
        }
      } catch (error) {
        console.error('Error loading organizations:', error);
      }
    };

    loadOrganizations();
  }, [roleName, user, selectedOrganization, setSelectedOrganization]);

  useEffect(() => {
    if (isOrganizationsPage) {
      const shouldHide = selectedOrganization?.isInternal;
      setHideTopbar(shouldHide || false);
    } else {
      setHideTopbar(false);
    }
  }, [isOrganizationsPage, selectedOrganization?.isInternal, setHideTopbar]);

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split('@')[0] || 'Usuario';

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    clearAuth();
    navigate('/login');
  };

  const handleNavigate = (id: string, path: string) => {
    setActiveNavId(id);
    navigate(path);
  };

  const handleOrgChange = (value: string | number) => {
    const org = orgOptions.find((o) => o.value === value);
    if (org) {
      const isInterno = org.value === user?.organizationId;
      setSelectedOrganization({
        id: org.value,
        name: org.label,
        slug: org.description,
        isInternal: isInterno,
      });
    }
  };

  return (
    <div className="flex h-screen bg-bg-main text-text-main overflow-hidden">
      <Sidebar
        navItems={navItems}
        userName={userName}
        userRole={user?.role?.name || 'user'}
        userCompany={user?.organization?.name || 'NeuroNOC'}
        activeId={activeNavId}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {!hideTopbar && (
          <Topbar
            envOptions={orgOptions}
            currentEnv={selectedOrganization?.id}
            onEnvChange={handleOrgChange}
            userName={userName}
            userRole={user?.role?.name || 'user'}
          />
        )}
        <main className="flex-1 overflow-y-auto p-6 bg-bg-surface">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};