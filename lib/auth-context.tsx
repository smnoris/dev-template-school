'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

interface User {
    _id: string;
    name?: string;
    email: string;
    role: 'alumno' | 'profesor' | 'admin' | 'owner';
    image?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        // Sincronizar con sesión de NextAuth (Google login)
        if (status === 'authenticated' && session?.user) {
            const sessionUser: User = {
                _id: session.user.id || '',
                name: session.user.name || undefined,
                email: session.user.email || '',
                role: (session.user.role as User['role']) || 'alumno',
                image: session.user.image || undefined,
            };
            setUser(sessionUser);
            localStorage.setItem('user', JSON.stringify(sessionUser));
            setIsLoading(false);
        } else if (status === 'unauthenticated') {
            // Si no hay sesión de NextAuth, intentar cargar desde localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        } else if (status === 'loading') {
            setIsLoading(true);
        }
    }, [session, status]);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
        // También cerrar sesión de NextAuth si existe
        if (status === 'authenticated') {
            await nextAuthSignOut({ redirect: false });
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}
