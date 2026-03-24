import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAdminSection = location.pathname.startsWith('/admin');

    const getBgClass = () => {
        if (isHomePage) return 'bg-[#f8f9fd]';
        if (isAdminSection) return 'bg-gradient-to-br from-[#f0f4ff] via-[#f8f9fd] to-[#e8edf8]';
        return 'bg-[#3f5f9f]';
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans ${getBgClass()}`}>
            <Header />
            <main className={`flex-grow ${isAdminSection ? 'px-4 md:px-12 pb-6 md:pb-10' : !isHomePage ? 'px-4 md:px-12 py-6 md:py-10' : ''}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
