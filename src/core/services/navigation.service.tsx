import {
  BiHome,
  BiData,
  BiCog,
  BiBell,
  BiBook,
  BiNetworkChart,
  BiBrain,
  BiBuilding,
  BiSolidContact,
} from 'react-icons/bi';
import type { NavItem, RoleName } from '../types/navigation/navigation.types';

const knowledgeGroup: NavItem = {
  id: 'knowledge-group',
  label: 'Configuración del Agente',
  icon: <BiBook className="text-xl" />,
  children: [
    {
      id: 'contexts',
      label: 'Contextos Temporales',
      icon: <BiNetworkChart className="text-xl" />,
      path: '/dashboard/temporal-contexts',
    },
    {
      id: 'rules',
      label: 'Reglas de Negocio',
      icon: <BiData className="text-xl" />,
      path: '/dashboard/rules',
    },
    {
      id: 'documentation',
      label: 'Documentación',
      icon: <BiBook className="text-xl" />,
      path: '/dashboard/documentation',
    },
    {
      id: 'ai-config',
      label: 'Personalidad IA',
      icon: <BiBrain className="text-xl" />,
      path: '/dashboard/ai-config',
    },
  ],
};

const navigationConfig: Record<RoleName, NavItem[]> = {
  super_admin: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BiHome className="text-xl" />,
      path: '/dashboard',
    },
    {
      id: 'organizations',
      label: 'Organizaciones',
      icon: <BiBuilding className="text-xl" />,
      path: '/dashboard/organizations',
    },
  ],
  admin: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BiHome className="text-xl" />,
      path: '/dashboard',
    },

    {
      id: 'contacts',
      label: 'Contactos',
      icon: <BiSolidContact className="text-xl" />,
      path: '/dashboard/contacts',
    },
    {
      id: 'monitoring',
      label: 'Monitoreo de Alertas',
      icon: <BiBell className="text-xl" />,
      path: '/dashboard/monitoring-alerts',
    },
    knowledgeGroup,

    {
      id: 'settings',
      label: 'Configuración',
      icon: <BiCog className="text-xl" />,
      path: '/dashboard/settings',
    },
  ],
  client: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BiHome className="text-xl" />,
      path: '/dashboard',
    },
    {
      id: 'ai-agents',
      label: 'Agentes IA',
      icon: <BiBrain className="text-xl" />,
      path: '/dashboard/ai-agents',
    },
    {
      id: 'topology',
      label: 'Topología de Red',
      icon: <BiNetworkChart className="text-xl" />,
      path: '/dashboard/topology',
    },
    {
      id: 'monitoring-alerts',
      label: 'Monitoreo de Alertas',
      icon: <BiBell className="text-xl" />,
      path: '/dashboard/monitoring-alerts',
    },
  ],
  user: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BiHome className="text-xl" />,
      path: '/dashboard',
    },
    {
      id: 'knowledge',
      label: 'Base de Conocimientos',
      icon: <BiBook className="text-xl" />,
      path: '/dashboard/knowledge',
    },
    {
      id: 'monitoring-alerts',
      label: 'Monitoreo de Alertas',
      icon: <BiBell className="text-xl" />,
      path: '/dashboard/monitoring-alerts',
    },
  ],
};

const defaultNavigation: NavItem[] = navigationConfig.user;

export const navigationService = {
  getNavigationByRole(roleName: RoleName | undefined | null): NavItem[] {
    if (!roleName || !navigationConfig[roleName]) {
      return defaultNavigation;
    }
    return navigationConfig[roleName];
  },
};
