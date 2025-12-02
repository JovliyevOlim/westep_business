import {SidebarProvider, useSidebar} from "../context/SidebarContext";
import {Outlet, useLocation} from "react-router";
import AppHeader from "./AppHeader";
import MobileNavigation from "./MobileNavigation.tsx";

const LayoutContent: React.FC = () => {
    const {isExpanded, isHovered, isMobileOpen} = useSidebar();
    const location = useLocation();

    return (
        <div className="min-h-screen">
            {/*<div>*/}
            {/*  <AppSidebar />*/}
            {/*  <Backdrop />*/}
            {/*</div>*/}
            <div
                className={`flex-1 transition-all max-w-(--breakpoint-2xl) mx-auto  duration-300 ease-in-out ${
                    isExpanded || isHovered ? "" : ""
                } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <AppHeader/>
                <div className="bg-white  h-[calc(100vh-64px)]">
                    <Outlet/>
                </div>
            </div>
            {
                location.pathname === "/" && <MobileNavigation/>
            }

        </div>
    );
};

const AppLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <LayoutContent/>
        </SidebarProvider>
    );
};

export default AppLayout;
