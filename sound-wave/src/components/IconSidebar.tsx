'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Icon Components
const LogoIcon = () => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const HomeIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
);

const SearchIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"}>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const DiscoverIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
);

const HeartIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? "#1ed760" : "none"} stroke={active ? "#1ed760" : "currentColor"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const LibraryIcon = ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const navItems = [
    { href: '/', icon: HomeIcon, label: 'Home' },
    { href: '/search', icon: SearchIcon, label: 'Search' },
    { href: '/library', icon: LibraryIcon, label: 'Library' },
    { href: '/liked', icon: HeartIcon, label: 'Liked' },
];

export default function IconSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-6 flex-shrink-0">
            {/* Logo */}
            <Link href="/" className="mb-8 text-[#1ed760] hover:scale-110 transition-transform">
                <LogoIcon />
            </Link>

            {/* Navigation Icons */}
            <nav className="flex-1 flex flex-col items-center gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isActive
                                    ? 'bg-[#1ed760] text-white shadow-lg shadow-green-200'
                                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                }`}
                            title={item.label}
                        >
                            <Icon active={isActive} />
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Icons */}
            <div className="flex flex-col items-center gap-2">
                <button className="w-11 h-11 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                    <SettingsIcon />
                </button>
                <button className="w-11 h-11 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                    <LogoutIcon />
                </button>
            </div>
        </aside>
    );
}
