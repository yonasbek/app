const Footer = ({ sidebarCollapsed }: { sidebarCollapsed: boolean }) => {
    return (
        <footer
            className={` fixed bottom-0 right-0 left-0 h-12 z-20 transition-all duration-300 ease-in-out
                bg-app-card border-t border-app-secondary
                ${/* Mobile: full width */ ''}
                left-0
                ${/* Desktop: adjust for sidebar */ ''}
                ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}

            `}
        >
            <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center shadow-[0_-1px_3px_0_rgba(0,0,0,0.05)]  justify-center flex-col ">
                <div className="flex items-center">
                    <p className="text-xs text-neutral-400">
                        Powered by{" "}
                        <a
                            href="https://jlinkdigital.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-app-primary font-medium hover:underline"
                        >
                            Jlink Digital Solutions
                        </a>
                    </p>
                </div>
                <div className="hidden sm:block">
                    <p className="text-xs text-neutral-400">
                        &copy; {new Date().getFullYear()} Office Management System
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
