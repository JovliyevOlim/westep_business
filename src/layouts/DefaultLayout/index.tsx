import React, {useState, ReactNode} from 'react';
import Header from "../headers/HeaderOne";
import Sidebar from '../../components/sidebar/index';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({children}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="text-light min-vh-100 d-flex flex-column">
            <div className="d-flex flex-grow-1 overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

                <div className={`d-flex flex-column flex-fill overflow-auto transition-all ${sidebarOpen && 'sidebar-open'}`}>
                    <Header
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    <main className="flex-grow-1">
                        <div className="container-fluid py-4 px-md-3">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
