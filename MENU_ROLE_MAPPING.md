# Menu Role Mapping Implementation

## Overview
The menu role mapping system controls which menu items are visible to users based on their role's permissions.

## How It Works

### 1. **Backend - Login Response**
When a user logs in, the backend returns:
- User's role information
- **Array of permission names** that the user's role has

**Location**: `api/src/auth/auth.service.ts`
- The login method now loads the user with their role and permissions
- Returns `permissions: string[]` array with permission names

### 2. **Frontend - Permission Storage**
After login, permissions are stored in localStorage:
```typescript
localStorage.setItem('permissions', JSON.stringify(response.data?.permissions || []));
```

**Location**: `app/src/app/(public)/login/page.tsx`

### 3. **Menu Permission Mapping**
Each menu item is mapped to a specific permission that controls access.

**Location**: `app/src/utils/menuPermissions.ts`

**Structure**:
```typescript
{
  path: '/plans',                    // Menu path
  permission: 'View Plans',          // Permission name (must match DB)
  module: 'Annual Plans',            // Module name
  action: 'view'                     // Action type
}
```

### 4. **Menu Filtering**
The Sidebar component:
1. Loads user permissions from localStorage on mount
2. Filters menu items using `filterMenuItems()` function
3. Only shows menu items where the user has the required permission

**Location**: `app/src/components/layout/Sidebar.tsx`

**Key Code**:
```typescript
useEffect(() => {
  const permissionsStr = localStorage.getItem('permissions');
  if (permissionsStr) {
    const permissions = JSON.parse(permissionsStr);
    setUserPermissions(permissions);
    // Filter menu items based on permissions
    const filtered = filterMenuItems([...allMenuItems], permissions);
    setMenuItems(filtered);
  }
}, []);
```

## Permission Naming Convention

Permissions in the database should follow this pattern:
- **Name**: Descriptive name (e.g., "View Plans", "Create User", "Delete Contact")
- **Module**: Module name (e.g., "Annual Plans", "Users", "Contacts")
- **Action**: Action type (e.g., "view", "create", "update", "delete")
- **Resource**: Optional resource name (e.g., "plan", "user", "contact")

## Adding New Menu Items

To add a new menu item with permission control:

1. **Add to menu items array** in `Sidebar.tsx`:
```typescript
{ path: '/new-feature', name: 'New Feature', icon: IconName }
```

2. **Add permission mapping** in `menuPermissions.ts`:
```typescript
{ 
  path: '/new-feature', 
  permission: 'View New Feature', 
  module: 'New Feature Module', 
  action: 'view' 
}
```

3. **Create permission in database**:
```sql
INSERT INTO permissions (name, description, module, action, resource)
VALUES ('View New Feature', 'View new feature menu', 'New Feature Module', 'view', 'new-feature');
```

4. **Assign permission to roles** via the Role Management UI (`/admin/roles`)

## How Menu Filtering Works

1. **User logs in** → Backend returns role with permissions
2. **Permissions stored** → Saved to localStorage as JSON array
3. **Sidebar loads** → Reads permissions from localStorage
4. **Menu filtering** → `filterMenuItems()` checks each menu item:
   - Looks up permission mapping for menu path
   - Checks if user has that permission
   - If yes → menu item is shown
   - If no → menu item is hidden
5. **Sub-menu filtering** → Sub-items are also filtered, parent only shows if it has visible children

## Example Flow

**User with "View Plans" permission:**
- ✅ Can see "Annual Plans" menu
- ❌ Cannot see "Users" menu (if they don't have "View Users" permission)

**User with "View Info Desk" permission but not sub-items:**
- ✅ Can see "Info Desk" parent menu
- ❌ Cannot see "Ambulance Reports" sub-menu (if they don't have permission)

## Backward Compatibility

- If no permissions are stored → All menus are shown (backward compatible)
- If menu item has no permission mapping → Menu is shown (backward compatible)
- This ensures existing functionality continues to work

## Database Structure

The permissions are stored in the `permissions` table:
- `name`: Unique permission name (e.g., "View Plans")
- `module`: Module grouping (e.g., "Annual Plans")
- `action`: Action type (e.g., "view", "create", "update", "delete")
- `resource`: Optional resource identifier

Roles are linked to permissions via the `role_permissions` join table.

