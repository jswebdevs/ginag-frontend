// src/utils/roleRedirect.ts

export const getDashboardRedirectPath = (roles: string[]): string => {
  if (!roles || roles.length === 0) return "/dashboard";

  // The order of this array determines priority (top = highest)
  const priorityOrder = [
    "SUPER_ADMIN",
    "ADMIN",
    "PRODUCT_MANAGER",
    "ORDER_MANAGER",
    "MARKETING_SPECIALIST",
    "SUPPORT_AGENT",
    "DELIVERY_MANAGER",
    "CUSTOMER",
  ];

  // Find the first role in the priority list that the user actually has
  const highestRole = priorityOrder.find((role) => roles.includes(role));

  switch (highestRole) {
    case "SUPER_ADMIN": return "/dashboard/super-admin";
    case "ADMIN": return "/dashboard/admin";
    case "PRODUCT_MANAGER": return "/dashboard/product-manager";
    case "ORDER_MANAGER": return "/dashboard/order-manager";
    case "MARKETING_SPECIALIST": return "/dashboard/marketing-specialist";
    case "SUPPORT_AGENT": return "/dashboard/support-agent";
    case "DELIVERY_MANAGER": return "/dashboard/delivery-manager";
    case "CUSTOMER": return "/dashboard";
    default: return "/dashboard";
  }
};