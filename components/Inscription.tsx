'use client';

import { useState } from "react";
import Image from "next/image";

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

                <button type="submit" className="button-submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Inscribirme'}
                </button>
            </form>
        </div>
    );
};

export default Inscription;
