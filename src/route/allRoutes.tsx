import SignIn from "../pages/AuthPages/SignIn";
import NotFound from "../pages/OtherPage/NotFound";
import Home from "../pages/Dashboard/Home.tsx";
import UserProfiles from "../pages/UserProfiles.tsx";
import AddCourse from "../pages/Courses/AddCourse.tsx";
import Logout from "../pages/AuthPages/Logout.tsx";
import SignUp from "../pages/AuthPages/SignUp.tsx";
import Password from "../pages/AuthPages/Password.tsx";
import FormElements from "../pages/Forms/FormElements.tsx";
import CreatePassword from "../pages/AuthPages/CreatePassword.tsx";
import Courses from "../pages/Courses/Courses.tsx";


export const authProtectedRoutes = [
    {index: true, element: <Home/>, path: '/'}, // index route
    {path: "/roles/update/:id", element: <AddCourse/>}, // oddiy route
    {path: "/courses/add", element: <AddCourse/>}, // oddiy route
    {path: "/courses", element: <Courses/>}, // oddiy route

    // Others Page
    {path: "/profile", element: <UserProfiles/>},
    // {path: "/calendar", element: <Calendar/>},
    // {path: "/blank", element: <Blank/>},
    //
    // // Forms
    {path: "/form-elements", element: <FormElements/>},
    //
    // // Tables
    // {path: "/basic-tables", element: <BasicTables/>},
    //
    // // UI Elements
    // {path: "/alerts", element: <Alerts/>},
    // {path: "/avatars", element: <Avatars/>},
    // {path: "/badge", element: <Badges/>},
    // {path: "/buttons", element: <Buttons/>},
    // {path: "/images", element: <Images/>},
    // {path: "/videos", element: <Videos/>},
    //
    // // Charts
    // {path: "/line-chart", element: <LineChart/>},
    // {path: "/bar-chart", element: <BarChart/>},
    // Fallback
    {path: "*", element: <NotFound/>},
];
export const publicRoutes = [
    {path: "/login", element: <SignIn/>},
    {path: "/register", element: <SignUp/>},
    {path: "/logout", element: <Logout/>},
    {path: "/password", element: <Password/>},
    {path: "/create-password", element: <CreatePassword/>},
    {path: "*", element: <NotFound/>}
]
