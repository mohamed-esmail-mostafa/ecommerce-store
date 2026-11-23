import { Pagination } from './pagination';
import { Role } from './role';
import { User } from './auth';

export type { User };

export interface UserFilters {
    search?: string;
    role_id?: number | null;
}

export interface UsersPageProps {
    users: Pagination<User>;
    roles: Role[];
    filters?: UserFilters;
}

export interface UserFormValues {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    role_id: string; // 'none' or string ID for select input compatibility
}
