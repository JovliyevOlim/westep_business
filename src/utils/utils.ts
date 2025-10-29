export const setItem = <T>(name: string, data: T): void => {
    localStorage.setItem(name, JSON.stringify(data));
};

export const getItem = <T>(name: string): T | null => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) as T : null;
};


export const removeItem = (name: string): void => {
    localStorage.removeItem(name);
};

export function getSelectOptions<T extends Record<string, any>>(
    data: T[] | undefined | null,
    valueKey: keyof T = "id",
    labelKey: keyof T = "name"
): { value: string; label: string }[] {
    if (!data) return [];
    return data.map((item) => ({
        value: String(item[valueKey]),
        label: String(item[labelKey]),
    }));
}