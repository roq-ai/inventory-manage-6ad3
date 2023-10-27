interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Business Owner'],
  customerRoles: ['Customer'],
  tenantRoles: ['Business Owner', 'Inventory Manager', 'Sales Representative'],
  tenantName: 'Company',
  applicationName: 'Inventory Management System',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: ['View inventory', 'Place an order', 'View sales', 'Update own information'],
  ownerAbilities: [
    'Manage user information',
    'Manage company details',
    'Manage inventory',
    'Manage customer data',
    'Manage sales records',
    'Manage orders',
  ],
  getQuoteUrl: 'https://app.roq.ai/proposal/6235c742-9ff0-47bf-aa1d-a7d430448540',
};
