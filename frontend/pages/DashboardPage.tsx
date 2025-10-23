import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
);
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const navItems = [
    { to: 'listings', icon: ListIcon, label: 'My Listings' },
    { to: 'searches', icon: SearchIcon, label: 'My Searches' },
    { to: 'documents', icon: FileTextIcon, label: 'My Documents' },
    { to: 'profile', icon: UserIcon, label: 'My Profile' },
];

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    
    const navLinkClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-700 transition-all hover:text-primary hover:bg-primary/10";
    const activeNavLinkClasses = "bg-primary/10 text-primary font-semibold";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-8">
                <aside className="hidden md:block">
                    <div className="flex flex-col gap-2 sticky top-24">
                         <div className="p-4 rounded-lg bg-neutral-100 mb-4">
                            <h3 className="font-bold text-lg">{user?.username}</h3>
                            <p className="text-sm text-neutral-500">{user?.email}</p>
                        </div>
                        <nav className="grid items-start text-sm font-medium">
                            {navItems.map(item => (
                                <NavLink 
                                    key={item.to} 
                                    to={item.to}
                                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </aside>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;