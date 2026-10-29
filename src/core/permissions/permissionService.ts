import { Role } from '../../types';
import { profileFeatureConfig, AppFeature } from './permissionConfig';
import { routePolicies, RoutePolicy } from './accessPolicy';

export const permissionService = {
  canAccessFeature(role: Role, feature: AppFeature): boolean {
    return profileFeatureConfig[role]?.[feature] ?? false;
  },

  getRoutePolicy(path: string): RoutePolicy | undefined {
    return routePolicies.find((policy) => {
      if (policy.path === path) return true;
      // Handle dynamic parameters e.g. /profile/:id
      const regexPattern = '^' + policy.path.replace(/:[a-zA-Z]+/g, '[^/]+') + '$';
      return new RegExp(regexPattern).test(path);
    });
  },

  canAccessRoute(role: Role, path: string, isAuthenticated: boolean): { allowed: boolean; redirectTo?: string } {
    const policy = this.getRoutePolicy(path);
    if (!policy) {
      return { allowed: true };
    }

    if (policy.requiresAuth && !isAuthenticated) {
      return { allowed: false, redirectTo: '/login' };
    }

    if (!policy.allowedRoles.includes(role)) {
      return { allowed: false, redirectTo: policy.redirectTo || '/' };
    }

    return { allowed: true };
  },
};
