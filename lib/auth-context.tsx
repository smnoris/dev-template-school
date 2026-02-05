'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

interface User {
    _id: string;
    name?: string;
    email: string;
    role: 'alumno' | 'profesor' | 'admin' | 'owner';
    image?: string;
    feesUpToDate?: boolean;
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

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        // Sincronizar con sesión de NextAuth (Google login)
        if (status === 'authenticated' && session?.user) {
            const sessionUser: User = {
                _id: session.user.id || '',
                name: session.user.name || undefined,
                email: session.user.email || '',
                role: (session.user.role as User['role']) || 'alumno',
                image: session.user.image || undefined,
                feesUpToDate: session.user.feesUpToDate,
            };
            setUser(sessionUser);
            localStorage.setItem('user', JSON.stringify(sessionUser));
        } else if (status === 'unauthenticated') {
            // Limpiar cualquier dato de sesión almacenado localmente
            localStorage.removeItem('user');
            setUser(null);
        }
    }, [session, status]);

    useEffect(() => {
        if (status !== 'loading') {
            setIsLoading(false);
        }
    }, [status]);
    /* eslint-enable react-hooks/set-state-in-effect */

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
