'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const OwnerDashboard = () => {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
        if (!isLoading && user && user.role !== 'owner') {
            router.push(`/dashboard/${user.role}`);
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <section className="p-5 sm:px-10">
                <p>Cargando...</p>
            </section>
        );
    }

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <section className="p-5 sm:px-10">
            <div className="header">
                <h1>Bienvenido, {user.name || 'Owner'}</h1>
                <p className="mt-2">Panel de Propietario</p>
            </div>

            <div className="dashboard-content max-w-4xl mx-auto mt-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Usuarios */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Usuarios</h3>
                        <p className="text-sm opacity-70">Gestionar todos los usuarios</p>
                    </div>

                    {/* Administradores */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Administradores</h3>
                        <p className="text-sm opacity-70">Asignar roles de admin</p>
                    </div>

                    {/* Clases */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Clases</h3>
                        <p className="text-sm opacity-70">Administrar todas las clases</p>
                    </div>

                    {/* Eventos */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Eventos</h3>
                        <p className="text-sm opacity-70">Gestión completa de eventos</p>
                    </div>

                    {/* Finanzas */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Finanzas</h3>
                        <p className="text-sm opacity-70">Ingresos, gastos y balances</p>
                    </div>

                    {/* Reportes */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Reportes</h3>
                        <p className="text-sm opacity-70">Análisis y métricas</p>
                    </div>

                    {/* Configuración */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Configuración</h3>
                        <p className="text-sm opacity-70">Ajustes globales del sistema</p>
                    </div>

                    {/* Backup */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Backup</h3>
                        <p className="text-sm opacity-70">Respaldo de datos</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="button-submit mt-8"
                >
                    Cerrar Sesión
                </button>
            </div>
        </section>
    );
};

export default OwnerDashboard;
