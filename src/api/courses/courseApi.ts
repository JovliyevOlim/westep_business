import apiClient from "../apiClient.ts";
import {Course, CourseStatusHistoryItem} from "../../types/types.ts";
import {parseApiError} from "../../utils/apiError.ts";

export type CoursePayload = Pick<Course,
    | "name"
    | "description"
    | "fullDescription"
    | "primaryCategoryId"
    | "subcategoryId"
    | "skillTagIds"
    | "languageId"
    | "attachmentId"
    | "trailerVideoUrl"
    | "level"
    | "targetAudience"
    | "estimatedDurationMinutes"
    | "learningOutcomes"
    | "requirements"
    | "subscriptionTier"
> & {
    id?: string;
    businessId?: string;
};

type CourseRecord = Partial<Course> & {
    id: string;
    name: string;
    isActive?: boolean;
    active?: boolean;
    published?: boolean;
};

type CoursesResponse =
    | Course[]
    | {
        content?: Course[] | Course;
        items?: Course[] | Course;
        data?: Course[] | Course | CoursesResponse;
        courses?: Course[] | Course;
        active?: boolean;
        isActive?: boolean;
    };

const isCourseRecord = (value: unknown): value is CourseRecord => (
    Boolean(
        value
        && typeof value === "object"
        && "id" in value
        && typeof (value as {id?: unknown}).id === "string"
        && "name" in value
        && typeof (value as {name?: unknown}).name === "string",
    )
);

const normalizeCourse = (value: unknown): Course | null => {
    if (!isCourseRecord(value)) {
        return null;
    }

    return {
        ...value,
        active: Boolean(value.active ?? value.isActive),
        isPublished: Boolean(value.isPublished ?? value.published),
        description: value.description || "",
        fullDescription: value.fullDescription || "",
        publishedAt: value.publishedAt || "",
        businessId: value.businessId || "",
        languageId: value.languageId || "",
        languageName: value.languageName || "",
        languageCode: value.languageCode || "",
        createdBy: value.createdBy || "",
        createdByFullName: value.createdByFullName || "",
        skillTagIds: value.skillTagIds || [],
        learningOutcomes: value.learningOutcomes || [],
        requirements: value.requirements || [],
    } as Course;
};

const extractCourseCollection = (response: CoursesResponse | undefined): unknown[] => {
    if (!response) {
        return [];
    }

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response.content)) {
        return response.content;
    }

    if (Array.isArray(response.items)) {
        return response.items;
    }

    if (Array.isArray(response.courses)) {
        return response.courses;
    }

    if (response.data && response.data !== response) {
        return extractCourseCollection(response.data);
    }

    return [];
};

const normalizeCourseList = (response: CoursesResponse | undefined) => (
    extractCourseCollection(response)
        .map((course) => normalizeCourse(course))
        .filter((course): course is Course => Boolean(course))
);

export const addCourses = async (body: CoursePayload) => {
    try {
        const {data} = await apiClient.post("/course", body);
        return normalizeCourse(data) || normalizeCourse((data as {data?: unknown})?.data) || data;
    } catch (error) {
        throw parseApiError(error, "Kurs qo'shib bo'lmadi.");
    }
};

export const updateCourse = async (body: CoursePayload & {id: string}) => {
    try {
        await apiClient.put("/course/" + body.id, body);
    } catch (error) {
        throw parseApiError(error, "Kursni yangilab bo'lmadi.");
    }
};

export const patchCourseActive = async (id: string, value: boolean) => {
    try {
        await apiClient.patch(`/course/${id}/active?value=${value}`);
    } catch (error) {
        throw parseApiError(error, "Kurs holatini o'zgartirib bo'lmadi.");
    }
};

export const deleteCourse = async (id: string) => {
    try {
        await apiClient.delete("/course/" + id);
    } catch (error) {
        throw parseApiError(error, "Kursni o'chirib bo'lmadi.");
    }
};


export const getMyCourses = async () => {
    try {
        const {data} = await apiClient.get("/course/get");
        return normalizeCourseList(data);
    } catch (error) {
        throw parseApiError(error, "Kurslar yuklanmadi.");
    }
};

export const getBusinessCourses = async () => {
    try {
        const {data} = await apiClient.get("/course/my-business");
        return normalizeCourseList(data);
    } catch (error) {
        throw parseApiError(error, "Biznes kurslari yuklanmadi.");
    }
};

export const getInactiveBusinessCourses = async () => {
    try {
        const {data} = await apiClient.get("/course/my-business/inactive");
        return normalizeCourseList(data);
    } catch (error) {
        throw parseApiError(error, "Nofaol kurslar yuklanmadi.");
    }
};

export const getCourseById = async (id: string | undefined) => {
    try {
        const {data} = await apiClient.get("/course/get/" + id);
        return normalizeCourse(data) || normalizeCourse((data as {data?: unknown})?.data) || data;
    } catch (error) {
        throw parseApiError(error, "Kurs ma'lumotlari yuklanmadi.");
    }
};

export const submitCourseForReview = async (id: string, note?: string) => {
    try {
        const {data} = await apiClient.post(`/course/${id}/submit-review`, note ? {note} : {});
        return normalizeCourse(data) || normalizeCourse((data as {data?: unknown})?.data) || data;
    } catch (error) {
        throw parseApiError(error, "Kursni moderatsiyaga jo'natib bo'lmadi.");
    }
};

export const getCourseStatusHistory = async (id: string) => {
    try {
        const {data} = await apiClient.get(`/course/${id}/status-history`);
        if (Array.isArray(data)) return data as CourseStatusHistoryItem[];
        const inner = (data as {data?: unknown; items?: unknown; content?: unknown});
        if (Array.isArray(inner.items)) return inner.items as CourseStatusHistoryItem[];
        if (Array.isArray(inner.content)) return inner.content as CourseStatusHistoryItem[];
        if (Array.isArray(inner.data)) return inner.data as CourseStatusHistoryItem[];
        return [] as CourseStatusHistoryItem[];
    } catch (error) {
        throw parseApiError(error, "Status tarixi yuklanmadi.");
    }
};
