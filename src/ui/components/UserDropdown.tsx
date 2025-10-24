import {useUser} from "../../api/auth/useAuth.ts";
import {useState} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";

function UserDropdown() {

    const {data: user} = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState)

    console.log(user)
    return (
        <div>
            <div className="d-flex align-items-center flex-fill">
                <div className={'d-none d-lg-block'}>
                    <h5 className='m-0'>{user?.firstname} {user?.lastname}</h5>
                    <p className='m-0'>{user?.roleName}</p>
                </div>

                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle className="bg-transparent border-0 d-flex align-items-center justify-content-center">
                        <img width={54} src="../src/assets/img/instructor/1.png" alt="avatar"/>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>{user?.firstname} {user?.lastname}</DropdownItem>
                        <DropdownItem>Profil</DropdownItem>
                        <DropdownItem href={"/logout"}>Chiqish</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

            </div>
        </div>

    );
}

export default UserDropdown;