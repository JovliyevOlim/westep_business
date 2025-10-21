import {Link} from 'react-router-dom'
import UserDropdown from "../../ui/components/UserDropdown.tsx";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
    // sidebarExpanded: boolean;
    // setSidebarExpanded: (arg: boolean) => void;
}

export default function HeaderOne({setSidebarOpen, sidebarOpen}: SidebarProps) {

    // const {currentUser} = useUser()

    // console.log(currentUser)
    return (
        <>
            <header id="navigation">
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-5 align-self-center rk_style">
                            <div className="site-logo d-none d-lg-block">
                                {
                                    !sidebarOpen && <Link to="/"><img src="assets/img/logo.svg" alt="Edumon"/></Link>

                                }
                            </div>
                        </div>
                        <div className="col-5 justify-content-end d-flex">
                                <UserDropdown/>
                        </div>

                    </div>
                </div>


                <div id="sm_menu_ham" className={`${sidebarOpen ? "open" : ""}`}
                     onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <span></span><span></span><span></span><span></span></div>

            </header>
        </>
    )
}
