import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Role } from '../../types';

export interface ProtectedRouteProps {
  children: React.ReactElement;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

export interface RoleRouteGuardProps {
  children: React.ReactElement;
  allowedRoles: Role[];
  fallbackRedirect?: string;
}

export const RoleRouteGuard: React.FC<RoleRouteGuardProps> = ({
  children,
  allowedRoles,
  fallbackRedirect = '/',
}) => {
  const { accountType, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(accountType)) {
    return <Navigate to={fallbackRedirect} replace />;
  }

  return children;
};

export interface PublicOnlyRouteProps {
  children: React.ReactElement;
  redirectTo?: string;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  children,
  redirectTo = '/',
}) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

