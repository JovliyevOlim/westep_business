import {Navigate} from 'react-router-dom';
import Login from "../components/login";
import Register from "../components/register";
import Error from "../components/error";
import Dashboard from "../components/dashboard";
import Users from "../components/users";
import Statistic from "../components/statistic";
import Lessons from "../components/lessons";

const authProtectedRoutes = [
    {path: "/dashboard", element: <Dashboard/>, title: "Dashboard"},
    {path: "/users", element: <Users/>, title: "Users"},
    {path: "/lessons", element: <Lessons/>, title: "Lessons"},
    {path: "/statistic", element: <Statistic/>, title: "Statistics"},

    // {path: "/home-1", element: <HomeOne/>},
    // {path: "/home-2", element: <HomeTwo/>, title: "Home 2"},
    // {path: "/about", element: <About/>, title: "About"},
    // {path: "/courses", element: <Courses/>, title: "Courses"},
    // {path: "/courses-2", element: <CoursesTwo/>, title: "Courses 2"},
    // {path: "/course-details", element: <CourseDetails/>, title: "Course Details"},
    // {path: "/grid-blog", element: <GridBlog/>, title: "Grid Blog"},
    // {path: "/standard-blog", element: <StandardBlog/>, title: "Standard Blog"},
    // {path: "/blog-details", element: <BlogDetails/>, title: "Blog Details"},
    // {path: "/cart", element: <Cart/>, title: "Cart"},
    // {path: "/checkout", element: <Checkout/>, title: "Checkout"},
    // {path: "/instructors", element: <Instructors/>, title: "Instructors"},
    // {path: "/contact", element: <Contact/>, title: "Contact"},
    {path: "*", element: <Error/>},
    {
        path: '/',
        exact: true,
        component: <Navigate to="/dashboard"/>,
    },
    {path: '*', component: <Navigate to="/dashboard"/>},
];

const publicRoutes = [
    {path: "/login", element: <Login/>},
    {path: "/register", element: <Register/>},
];

export {authProtectedRoutes, publicRoutes};
