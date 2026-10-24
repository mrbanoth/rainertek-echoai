export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Operator' | 'Read-only viewer';
  departments: string[];
  avatarUrl: string;
}

export const DEMO_CREDENTIALS = {
  email: 'praveenmanne@yopmail.com',
  password: 'PraveenManne@2026',
};

export const DEMO_USER: AuthUser = {
  id: 'usr_praveen_2026',
  name: 'Praveen Manne',
  email: 'praveenmanne@yopmail.com',
  role: 'Administrator',
  departments: ['Executive', 'Voice Operations', 'IT & Security', 'Engineering'],
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
};

export const AUTH_COOKIE_NAME = 'echoai_session';
