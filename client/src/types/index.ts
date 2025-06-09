export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  abhaId?: string;
  phoneNumber?: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  appointments: number;
  records: number;
  notifications: number;
  queueCount?: number;
  todayAppointments?: number;
  aiScans?: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: string[];
}
