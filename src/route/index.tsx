import React from 'react';
import {Routes, Route} from 'react-router-dom';

//routes
import {authProtectedRoutes, publicRoutes} from './allRoutes';
import AuthProtected from "./AuthProtected.tsx";
import DefaultLayout from "../layouts/DefaultLayout";
import AuthLayout from "../layouts/AuthLayout";
// import DefaultLayout from '../layout/DefaultLayout.tsx';
// import ProtectedRoute from './ProtectedRoute.tsx';

const Index = () => {
    return (
        <React.Fragment>
            <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route path={route.path} element={
                            <AuthLayout>
                                {route.element}
                            </AuthLayout>
                        } key={idx}/>
                    ))}
                </Route>

                <Route>
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    {/*<ProtectedRoute allowedRoles={route?.permission}>*/}
                                    <DefaultLayout>{route.element}</DefaultLayout>
                                    {/*</ProtectedRoute>*/}
                                </AuthProtected>
                            }
                            key={idx}
                        />
                    ))}
                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;
