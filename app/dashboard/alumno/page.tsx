'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const AlumnoDashboard = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
        // Redirigir si no es alumno
        if (!isLoading && user && user.role !== 'alumno') {
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
                <h1>Bienvenido, {user.name || 'Alumno'}</h1>
                <p className="mt-2">Panel de Alumno</p>
            </div>

            <div className="dashboard-content max-w-6xl mx-auto mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Mis Clases */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Mis Clases</h3>
                        <p className="text-sm opacity-70">Ver tus clases inscriptas</p>
                    </div>

                    {/* Próximos Eventos */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Próximos Eventos</h3>
                        <p className="text-sm opacity-70">Talleres y eventos disponibles</p>
                    </div>

                    {/* Mi Perfil */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Mi Perfil</h3>
                        <p className="text-sm opacity-70">Editar información personal</p>
                    </div>

                    {/* Estado de Cuotas */}
                    <div className="signup-card p-6">
                        <h3 className="text-lg font-semibold mb-2">Estado de Cuotas</h3>
                        <p className="text-sm opacity-70">
                            {user.feesUpToDate ? '✅ Al día' : '⚠️ Pendiente'}
                        </p>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default AlumnoDashboard;
