'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminDashboard = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
        if (!isLoading && user && user.role !== 'admin') {
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

    return (
        <section className="p-3 sm:p-5">
            <div className="header">
                <h1>Bienvenido, {user.name || 'Admin'}</h1>
                <p className="mt-2">Panel de Administración</p>
            </div>

            <div className="dashboard-content max-w-6xl mx-auto mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Usuarios */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Usuarios</h3>
                        <p className="text-sm opacity-70">Gestionar alumnos y profesores</p>
                    </div>

                    {/* Clases */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Clases</h3>
                        <p className="text-sm opacity-70">Administrar clases y horarios</p>
                    </div>

                    {/* Eventos */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Eventos</h3>
                        <p className="text-sm opacity-70">Crear y editar eventos</p>
                    </div>

                    {/* Cuotas */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Cuotas</h3>
                        <p className="text-sm opacity-70">Control de pagos</p>
                    </div>

                    {/* Reportes */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Reportes</h3>
                        <p className="text-sm opacity-70">Estadísticas y reportes</p>
                    </div>

                    {/* Configuración */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Configuración</h3>
                        <p className="text-sm opacity-70">Ajustes del sistema</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;
