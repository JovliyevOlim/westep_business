import {useEffect, useRef} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {authProtectedRoutes} from '../../route/allRoutes';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
    // sidebarExpanded: boolean;
    // setSidebarExpanded: (arg: boolean) => void;
}

const Sidebar = ({sidebarOpen, setSidebarOpen}: SidebarProps) => {
    const location = useLocation();

    const {pathname} = location;

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    // const {userPermissions} = useSelector((state: any) => state.Login);


    useEffect(() => {
        const clickHandler = ({target}: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    useEffect(() => {
        const keyHandler = ({keyCode}: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });


    return (
        <aside
            ref={sidebar}
            className={`sidebar ${
                sidebarOpen ? 'open' : 'closed'
            }`}
        >
            <div className="pt-4">
                <div className="site-logo d-flex px-4 justify-content-between align-items-center">
                    <img src="assets/img/logo.svg" alt="Edumon"/>
                    <i onClick={() => setSidebarOpen(false)} className="d-md-none fa-solid fa-xmark display-6"></i>
                </div>
            </div>

            {/* Sidebar Menu */}
            <nav className="mt-3 px-3">
                <ul className="list-unstyled">
                    {authProtectedRoutes
                        .filter((val: any) => val.title)
                        .map((item: any, index: number) => (
                            <li key={index} className="mb-1">
                                <NavLink
                                    to={item?.path}
                                    className={({isActive}) =>
                                        `d-md-flex d-none align-items-center px-3 py-2 rounded ${
                                            isActive || pathname.includes(item?.path)
                                                ? 'bg-white text-primary'
                                                : 'text-light'
                                        }`
                                    }
                                >
                                    {item?.title}
                                </NavLink>
                                <NavLink
                                    onClick={() => setSidebarOpen(false)}
                                    to={item?.path}
                                    className={({isActive}) =>
                                        `d-flex d-md-none align-items-center px-3 py-2 rounded ${
                                            isActive || pathname.includes(item?.path)
                                                ? 'bg-white text-primary'
                                                : 'text-light'
                                        }`
                                    }
                                >
                                    {item?.title}
                                </NavLink>
                            </li>
                        ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;