import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {addBusinessTeacher, getUsersById} from "./businessUserApi.ts";
import {useNavigate} from "react-router";
import {getItem} from "../../utils/utils.ts";

export const useGetUsers = (businessId: string) =>
    useQuery({
        queryKey: ["users", businessId],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getUsersById(businessId);
        },
        retry: false,
    })


export const useAddBusinessTeacher = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addBusinessTeacher,
        onSuccess: async () => {
            // const roles = await getUsersById(data.businessId);
            qc.setQueryData(["courses"]);
            navigate("/courses");
        },
        onError: (error) => {
            alert(error);
        },
    });
};

// export const useUpdateCourse = () => {
//     const navigate = useNavigate();
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: updateCourse,
//         onSuccess: async () => {
//             const roles = await getUsersById(data.businessId);
//             qc.setQueryData(["courses"], roles);
//             navigate("/courses");
//         },
//         onError: (error) => {
//             alert(error);
//         },
//     });
// };
//
// export const useDeleteCourse = () => {
//     const navigate = useNavigate();
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: deleteCourse,
//         onSuccess: async () => {
//             const roles = await getAllCourses();
//             qc.setQueryData(["courses"], roles);
//             navigate("/courses");
//         },
//         onError: (error) => {
//             alert(error);
//         },
//     });
// };

