export type AdminUserRow = {
    _id: string;
    name: string;
    email: string;
    role: string; // checked with isRole() where it's displayed
    approved: boolean;
    requestedAt?: string;
    approvedAt?: string;
};