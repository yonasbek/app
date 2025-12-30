// Menu to Permission Mapping
// Each menu item maps to a permission that controls access to it

export interface MenuPermission {
  path: string;
  permission: string; // Permission name that controls access
  module: string; // Module name for the permission
  action: string; // Action type (usually 'view' for menu items)
}

export const menuPermissions: MenuPermission[] = [
  { path: '/dashboard', permission: 'View Dashboard', module: 'Dashboard', action: 'view' },
  { path: '/plans', permission: 'View Plans', module: 'Annual Plans', action: 'view' },
  { path: '/my-tasks', permission: 'View Tasks', module: 'My Tasks', action: 'view' },
  { path: '/budget', permission: 'View Budget', module: 'Budget', action: 'view' },
  { path: '/flagship-activities', permission: 'View Flagship Activities', module: 'Flagship Activities', action: 'view' },
  { path: '/info-desk', permission: 'View Info Desk', module: 'Info Desk', action: 'view' },
  { path: '/info-desk/ambulance', permission: 'View Ambulance Reports', module: 'Info Desk', action: 'view' },
  { path: '/info-desk/medical-service', permission: 'View Medical Service Reports', module: 'Info Desk', action: 'view' },
  { path: '/knowledge-base', permission: 'View Documents', module: 'Knowledge Base', action: 'view' },
  { path: '/memos', permission: 'View Memos', module: 'Memos', action: 'view' },
  { path: '/attendance', permission: 'View Attendance', module: 'Attendance', action: 'view' },
  { path: '/rooms', permission: 'View Rooms', module: 'Rooms', action: 'view' },
  { path: '/contacts', permission: 'View Contacts', module: 'Contacts', action: 'view' },
  { path: '/training', permission: 'View Trainings', module: 'Training', action: 'view' },
  { path: '/users', permission: 'View Users', module: 'Users', action: 'view' },
  { path: '/admin/roles', permission: 'View Roles', module: 'Role Management', action: 'view' },
  { path: '/import', permission: 'View Imports', module: 'Data Import', action: 'view' },
  { path: '/reports', permission: 'View Reports', module: 'Reports', action: 'view' },
];

/**
 * Check if user has permission to access a menu item
 * @param userPermissions - Array of permission names the user has
 * @param menuPath - The path of the menu item
 * @returns boolean - true if user has permission, false otherwise
 */
export function hasMenuPermission(userPermissions: string[], menuPath: string): boolean {
  const menuPermission = menuPermissions.find(mp => mp.path === menuPath);
  if (!menuPermission) {
    // If no permission mapping exists, allow access (backward compatibility)
    return true;
  }
  return userPermissions.includes(menuPermission.permission);
}

/**
 * Filter menu items based on user permissions
 * @param menuItems - Array of menu items
 * @param userPermissions - Array of permission names the user has
 * @returns Filtered array of menu items
 */
export function filterMenuItems(menuItems: any[], userPermissions: string[]): any[] {
  return menuItems.filter(item => {
    // Check main menu item
    if (!hasMenuPermission(userPermissions, item.path)) {
      return false;
    }
    
    // If menu has sub-items, filter them too
    if (item.subItems && item.subItems.length > 0) {
      item.subItems = item.subItems.filter((subItem: any) =>
        hasMenuPermission(userPermissions, subItem.path)
      );
      // Only show parent menu if it has at least one visible sub-item
      return item.subItems.length > 0;
    }
    
    return true;
  });
}

