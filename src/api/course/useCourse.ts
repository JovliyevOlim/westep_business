import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getAllCourses} from "./courseApi.ts";
import {useNavigate} from "react-router-dom";
import {getItem} from "../../utils/utils.ts";

export const useAllCourse = () =>
    useQuery({
        queryKey: ["courses"],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            console.log(token, 'token');
            if (!token) throw new Error("No token");
            return await getAllCourses();
        },
        retry: false,
    });
//
// export const useLogin = () => {
//     const navigate = useNavigate();
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: login,
//         onSuccess: async () => {
//             const user = await getCurrentUser();
//             qc.setQueryData(["currentUser"], user);
//             navigate("/");
//         },
//         onError: (error) => {
//             alert(error);
//         },
//     });
// };
//
// export const useRegister = () => {
//     const navigate = useNavigate();
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: register,
//         onSuccess: async () => {
//             const user = await getCurrentUser();
//             qc.setQueryData(["currentUser"], user);
//             navigate("/");
//         },
//         onError: (error) => {
//             alert(error.message);
//         }
//     });
// };
//
//
// export const useCheckPhoneNumber = () => {
//         const navigate = useNavigate();
//         return useMutation({
//             mutationFn: checkPhoneNumber,
//             onSuccess: (_, body: { phone: string }) => {
//                 navigate("/password", {state: {phone: body.phone}});
//             },
//             onError: (error, body: { phone: string }) => {
//                 console.log(error);
//                 navigate("/register", {state: {phone: body.phone}}); // success -> password sahifasiga o‘tish
//             },
//         });
//     }
// ;
//
//
// export const useLogout = () => {
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: logout,
//         onSuccess: () => {
//             qc.removeQueries({queryKey: ["currentUser"]});
//         },
//     });
// };
//
