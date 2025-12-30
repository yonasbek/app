# How to Assign Menu Permissions to Roles

## Step-by-Step Guide

### Step 1: Add Permissions to Database

First, you need to add permissions to the `permissions` table. You can do this via:

**Option A: SQL Script**
Run the SQL script: `api/migrations/add-menu-permissions.sql`

**Option B: Direct Database Insert**
Insert permissions directly into your PostgreSQL database:

```sql
INSERT INTO permissions (name, description, module, action, resource)
VALUES 
  ('View Dashboard', 'Access to dashboard page', 'Dashboard', 'view', 'dashboard'),
  ('View Plans', 'Access to annual plans menu', 'Annual Plans', 'view', 'plans'),
  ('View Users', 'Access to user management', 'Users', 'view', 'users'),
  -- ... add all permissions
ON CONFLICT (name) DO NOTHING;
```

**Option C: Via API** (if you create an endpoint)
Use POST `/permissions` endpoint to create permissions programmatically.

### Step 2: Assign Permissions to ADMIN Role

1. **Navigate to Role Management**
   - Go to `/admin/roles` in your application
   - You should see the ADMIN role in the left panel

2. **Select the ADMIN Role**
   - Click on "ADMIN" in the roles list
   - The right panel will show role details

3. **View Permissions by Module**
   - You'll see module tabs at the top (e.g., "Dashboard", "Annual Plans", "Users", etc.)
   - Click on each module tab to see available permissions

4. **Check the Permissions You Want**
   - For each permission you want to assign to ADMIN, check the checkbox
   - The permission will be saved automatically when you check it
   - You'll see a checkmark (✓) appear when selected

5. **Verify Assignment**
   - The role card will show the count of assigned permissions
   - Example: "5 permissions" instead of "0 permissions"

### Step 3: Menu Items Will Appear Automatically

Once permissions are assigned:
1. **User logs in** → Backend returns permissions for their role
2. **Permissions stored** → Saved to localStorage
3. **Sidebar filters menus** → Only shows menus where user has permission
4. **Menu appears** → User can see and access the menu item

## Example: Giving ADMIN Access to All Menus

To give ADMIN access to all menu items:

1. Select "ADMIN" role
2. Go through each module tab:
   - **Dashboard** → Check "View Dashboard"
   - **Annual Plans** → Check "View Plans"
   - **My Tasks** → Check "View Tasks"
   - **Budget** → Check "View Budget"
   - **Flagship Activities** → Check "View Flagship Activities"
   - **Info Desk** → Check "View Info Desk", "View Ambulance Reports", "View Medical Service Reports"
   - **Knowledge Base** → Check "View Documents"
   - **Memos** → Check "View Memos"
   - **Attendance** → Check "View Attendance"
   - **Rooms** → Check "View Rooms"
   - **Contacts** → Check "View Contacts"
   - **Training** → Check "View Trainings"
   - **Users** → Check "View Users"
   - **Role Management** → Check "View Roles"
   - **Data Import** → Check "View Imports"
   - **Reports** → Check "View Reports"

3. After checking all permissions, the ADMIN user will see all menu items in the sidebar.

## Permission Name Matching

**IMPORTANT**: The permission `name` in the database must **exactly match** the permission name in `menuPermissions.ts`:

```typescript
// In menuPermissions.ts
{ path: '/plans', permission: 'View Plans', ... }

// In database
name: 'View Plans'  ✅ Correct
name: 'view plans'  ❌ Wrong (case sensitive)
name: 'View Plan'   ❌ Wrong (missing 's')
```

## Quick Check: Why No Permissions Show?

If you don't see any permissions in the UI:

1. **Check Database**: Are permissions added to the `permissions` table?
2. **Check API**: Does `GET /permissions` return permissions?
3. **Check Console**: Are there any errors in browser console?
4. **Refresh**: Try refreshing the page after adding permissions

## Testing

After assigning permissions:
1. Log out and log back in as a user with the ADMIN role
2. Check the sidebar - menu items should appear based on assigned permissions
3. Menu items without permissions will be hidden

