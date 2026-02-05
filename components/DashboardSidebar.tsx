'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from '@/lib/auth-context';

const DashboardSidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const role = user?.role ?? 'alumno';
    const menuItems = [
        { href: `/dashboard/${role}`, label: 'Dashboard', icon: '📊' },
        { href: `/dashboard/${role}/usuarios`, label: 'Usuarios', icon: '👥' },
        { href: `/dashboard/${role}/clases`, label: 'Clases', icon: '📚' },
        { href: `/dashboard/${role}/eventos`, label: 'Eventos', icon: '🎭' },
        { href: `/dashboard/${role}/cuotas`, label: 'Cuotas', icon: '💰' },
        { href: `/dashboard/${role}/reportes`, label: 'Reportes', icon: '📈' },
        { href: `/dashboard/${role}/configuracion`, label: 'Configuración', icon: '⚙️' },
    ];

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <Link href="/" className="sidebar-logo" title="AndieSay">
                    <Image src="/icons/logo.png" alt="logo" width={28} height={28} />
                </Link>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={pathname === item.href ? 'active' : ''}
                                title={item.label}
                            >
                                <span className="icon">{item.icon}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button
                    onClick={async () => {
                        await logout();
                        window.location.href = '/';
                    }}
                    className="logout-btn"
                    title="Cerrar Sesión"
                >
                    🚪
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
