'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

const ConditionalNavbar = () => {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');

    // Don't render navbar on dashboard pages
    if (isDashboard) {
        return null;
    }

    return <Navbar />;
};

export default ConditionalNavbar;
