export interface Common {
    id: string;
    createdAt: string
}

export interface BusinessType {
    firstname: string,
    lastname: string,
    businessName: string,
    ownerBirthDate: string,
    ownerGender: string,
    address?: string,
    description?: string,
    password: string,
    phone: string
}

export interface User {
    birthDate?: string;
    businessId?: string;
    createdAt?: string;
    firstname: string;
    gender: string;
    id: string;
    lastname: string
    permissionsList: string[];
    phoneNumber: string
    roleName: string
}

export interface Course extends Common {
    name: string,
    description: string,
    isPublished: boolean,
    publishedAt: string,
    businessId: string
}
