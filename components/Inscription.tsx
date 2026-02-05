'use client';


import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Inscription = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        birthDate: '',
        socialMedia: '',
        obra: '',
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('password', formData.password);
            if (formData.birthDate) {
                submitData.append('birthDate', formData.birthDate);
            }
            if (formData.socialMedia) {
                submitData.append('socialMedia', formData.socialMedia);
            }
            submitData.append('role', 'alumno');
            submitData.append('provider', 'credentials');

            if (image) {
                submitData.append('image', image);
            }

            const response = await fetch(`${BASE_URL}/api/user`, {
                method: 'POST',
                body: submitData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al registrar usuario');
            }

            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div id="inscription">
                <p className="text-sm">¡Gracias por inscribirte!</p>
            </div>
        );
    }

    return (
        <div id="inscription">
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="error-message">{error}</div>
                )}

                <div>
                    <label htmlFor="name">Nombre Completo</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ingresa tu nombre"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Correo Electrónico</label>
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

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Crea una contraseña"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="birthDate">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="image">Foto de Perfil</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                width={100}
                                height={100}
                                className="rounded-full object-cover"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="socialMedia">Redes Sociales</label>
                    <input
                        type="text"
                        id="socialMedia"
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={handleChange}
                        placeholder="Instagram, Facebook, etc."
                    />
                </div>

                <div>
                    <label htmlFor="obra">Obra:</label>
                    <textarea
                        id="obra"
                        name="obra"
                        value={formData.obra}
                        onChange={handleChange}
                        placeholder="Describe tu obra o proyecto"
                        rows={3}
                    />
                </div>

                <button type="submit" className="button-submit" disabled={loading || googleLoading}>
                    {loading ? 'Enviando...' : 'Inscribirme'}
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
                            // Usar redirect personalizado para manejar según el rol
                            await signIn("google", { callbackUrl: "/api/auth/redirect" });
                        } catch {
                            setError("Error al registrarse con Google");
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
                    {googleLoading ? 'Conectando...' : 'Registrarse con Google'}
                </button>
            </form>
        </div>
    );
};

export default Inscription;
