import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { PERMISSIONS } from '@/lib/permissions';

type PermissionProps = {
  /**
   * The permission required to view the content
   */
  permission?: keyof typeof PERMISSIONS | (keyof typeof PERMISSIONS)[];
  /**
   * Content to show if the user has the required permission
   */
  children: ReactNode;
  /**
   * Content to show if the user doesn't have the required permission
   * If not provided, nothing will be shown
   */
  fallback?: ReactNode;
  /**
   * If true, the user must have all of the specified permissions
   * If false, the user must have at least one of the specified permissions
   * Default is false (any permission is sufficient)
   */
  requireAll?: boolean;
};

/**
 * Component that conditionally renders content based on user permissions
 */
export function Permission({ permission, children, fallback, requireAll = false }: PermissionProps) {
  const { data: session } = useSession();
  const userPermissions = session?.user?.permissions || [];
  const isAdmin = userPermissions.includes(PERMISSIONS.ADMIN);
  
  // Admins always have access to everything
  if (isAdmin) {
    return <>{children}</>;
  }
  
  // No permission required, or no specific permission check needed
  if (!permission) {
    return <>{children}</>;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];
  
  // Check if the user has the required permissions
  let hasPermission = false;
  
  if (requireAll) {
    // User must have ALL specified permissions
    hasPermission = permissions.every(p => userPermissions.includes(PERMISSIONS[p]));
  } else {
    // User must have AT LEAST ONE of the specified permissions
    hasPermission = permissions.some(p => userPermissions.includes(PERMISSIONS[p]));
  }
  
  if (hasPermission) {
    return <>{children}</>;
  }
  
  // User doesn't have permission, show fallback or nothing
  return fallback ? <>{fallback}</> : null;
}

/**
 * Component that only renders content for admin users
 */
export function AdminOnly({ children, fallback }: Omit<PermissionProps, 'permission'>) {
  return (
    <Permission permission="ADMIN" fallback={fallback}>
      {children}
    </Permission>
  );
}

/**
 * Component that only renders content for tutorial validators
 */
export function TutorialValidatorOnly({ children, fallback }: Omit<PermissionProps, 'permission'>) {
  return (
    <Permission 
      permission={["VALIDATE_TUTORIAL", "ADMIN"]} 
      fallback={fallback}
    >
      {children}
    </Permission>
  );
}

/**
 * Component that only renders content for users who can bypass tutorial validation
 */
export function BypassTutorialValidationOnly({ children, fallback }: Omit<PermissionProps, 'permission'>) {
  return (
    <Permission 
      permission={["BYPASS_TUTORIAL_VALIDATION", "ADMIN"]} 
      fallback={fallback}
    >
      {children}
    </Permission>
  );
}