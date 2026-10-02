export const ROLES = ['staff', 'admin', 'super_admin'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_RANK: Record<Role, number> = { staff: 1, admin: 2, super_admin: 3};
export const ROLE_LABEL: Record<Role, string> = {
    staff: 'Staff',
    admin: 'Admin',
    super_admin: 'Super Admin',
};

export type Permission = 
    | 'orders:manage'    // view + edit orders
    | 'menu:manage'      // add / edit / delete items and categories (NOT changing a price)
    | 'menu:set_price'   // change an existing item's price
    | 'users:view'
    | 'users:create'
    | 'users:edit'       // name, email, password, approving pending requests
    | 'users:delete';

const MIN_ROLE: Record<Permission, Role> = {
    'orders:manage': 'staff',
    'menu:manage': 'admin',
    'menu:set_price': 'admin',
    'users:view': 'staff',
    'users:create': 'admin',
    'users:edit': 'admin',
    'users:delete': 'super_admin',
};

export const isRole = (v: unknown): v is Role =>
    typeof v === 'string' && (ROLES as readonly string[]).includes(v);

const rank = (role: unknown) => (isRole(role) ? ROLE_RANK[role] : 0);

export const can = (role: unknown, permission: Permission) =>
    isRole(role) && rank(role) >= rank(MIN_ROLE[permission]);

/** You can only hand out roles up to your own. Admins can't mint super admins. */
export const canAssignRole = (actor: Role, newRole: Role) => rank(newRole) <= rank(actor);

/** You can only change or delete people at or below your own rank. */
export const canManageUser = (actor: Role, targetRole: unknown) => rank(targetRole) <= rank(actor);

