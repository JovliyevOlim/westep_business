import {Link} from 'react-router-dom'

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
                            <div className="d-flex gap-3">
                                <div className={'d-none d-lg-block'}>
                                    <h5 className='m-0'>Masum Billah</h5>
                                    <p className='m-0'>UI / UX Designer</p>
                                </div>
                                <div className="avatar">
                                    <img src="assets/img/instructor/1.png" alt=""/>
                                    <ul className='avatar-menu'>
                                        <li>ewde</li>
                                        <li>ewde</li>
                                        <li>ewde</li>
                                        <li>ewde</li>
                                        <li>ewde</li>
                                    </ul>
                                </div>


                            </div>
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
