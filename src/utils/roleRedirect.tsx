// src/utils/roleRedirect.ts

export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'CUSTOMER';

// 1. Define the power ranking (Highest to Lowest)
const ROLE_HIERARCHY: Role[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'CUSTOMER'
];

// 2. Find the user's highest role
export const getHighestRole = (userRoles: string[] | string | undefined | null): Role => {
  if (!userRoles || userRoles.length === 0) return 'CUSTOMER';

  // If it's accidentally a string, convert to array
  const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

  // Find the first role in our hierarchy that the user possesses
  for (const rank of ROLE_HIERARCHY) {
    if (rolesArray.includes(rank)) {
      return rank;
    }
  }

  return 'CUSTOMER';
};

// 3. Generate the safe redirect path
export const getDashboardRedirectPath = (userRoles: string[] | string | undefined | null): string => {
  const primaryRole = getHighestRole(userRoles);

  if (primaryRole === 'CUSTOMER') return '/dashboard/customer';

  // Converts "SUPER_ADMIN" to "/dashboard/super-admin"
  const formattedPath = primaryRole.toLowerCase().replace('_', '-');
  return `/dashboard/${formattedPath}`;
};