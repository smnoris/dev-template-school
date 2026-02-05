'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProfesorDashboard = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
        if (!isLoading && user && user.role !== 'profesor') {
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
                <h1>Bienvenido, {user.name || 'Profesor'}</h1>
                <p className="mt-2">Panel de Profesor</p>
            </div>

            <div className="dashboard-content max-w-6xl mx-auto mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Mis Clases */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Mis Clases</h3>
                        <p className="text-sm opacity-70">Gestionar clases asignadas</p>
                    </div>

                    {/* Alumnos */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Alumnos</h3>
                        <p className="text-sm opacity-70">Ver listado de alumnos</p>
                    </div>

                    {/* Asistencia */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Asistencia</h3>
                        <p className="text-sm opacity-70">Registrar asistencia</p>
                    </div>

                    {/* Calendario */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Calendario</h3>
                        <p className="text-sm opacity-70">Ver horarios y eventos</p>
                    </div>

                    {/* Mi Perfil */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Mi Perfil</h3>
                        <p className="text-sm opacity-70">Editar información personal</p>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default ProfesorDashboard;
