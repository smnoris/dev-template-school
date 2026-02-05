'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LogIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            if (result?.ok) {
                // La sesión de NextAuth se sincronizará automáticamente con el contexto
                // Redirigir según el rol del usuario
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                
                if (session?.user?.role) {
                    router.push(`/dashboard/${session.user.role}`);
                } else {
                    router.push('/dashboard/alumno');
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center  flex-col" id="login">
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="error-message">{error}</div>
                )}

                <div>
                    <label htmlFor="email">Correo Electrónico</label><br />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ingresa tu correo"
                        required
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="password">Contraseña</label><br />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>
                <br />
                <button type="submit" className="button-submit" disabled={loading || googleLoading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>

                <div className="divider my-4 flex items-center gap-4">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-gray-500 text-sm">o</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <button
                    type="button"
                    onClick={async () => {
                        setGoogleLoading(true);
                        setError(null);
                        try {
                            // Usar redirect: false para manejar la redirección manualmente según el rol
                            await signIn("google", { callbackUrl: "/api/auth/redirect" });
                        } catch {
                            setError("Error al iniciar sesión con Google");
                            setGoogleLoading(false);
                        }
                    }}
                    className="button-google w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading || googleLoading}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    {googleLoading ? 'Conectando...' : 'Continuar con Google'}
                </button>
            </form>
        </div>
    );
};

export default LogIn;
