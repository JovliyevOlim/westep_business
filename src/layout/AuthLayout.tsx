import React, {ReactNode} from 'react';
import logo from '../assets/logo.svg';

const AuthLayout: React.FC<{ children: ReactNode }> = ({children}) => {
    return (
        <div className='auth-back'>
            <div className='auth-glass'>
                <div className='w-full md:w-4/5 lg:w-3/5 mx-auto'>
                    <div className='flex justify-center'>
                        <img src={logo} alt="logo"/>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;