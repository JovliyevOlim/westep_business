import {useFormik} from "formik";
import * as Yup from "yup";
import {Module} from "../../types/types.ts";
import {useAddModule, useUpdateModule} from "../../api/module/useModule.ts";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import {Switch} from "../ui/switch.tsx";

interface ModuleFormProps {
    courseId: string;
    initialData?: Partial<Module> | null;
    suggestedOrderIndex?: number;
    onSuccess: () => void;
    onCancel: () => void;
}

type ModuleFormValues = {
    name: string;
    requiresSubscription: boolean;
    active: boolean;
};

export default function ModuleForm({courseId, initialData, suggestedOrderIndex = 0, onSuccess, onCancel}: ModuleFormProps) {
    const {mutateAsync: addModule, isPending: isAdding} = useAddModule();
    const {mutateAsync: updateModule, isPending: isUpdating} = useUpdateModule();

    const isEditing = Boolean(initialData?.id);

    const formik = useFormik<ModuleFormValues>({
        initialValues: {
            name: initialData?.name || "",
            requiresSubscription: initialData?.requiresSubscription ?? true,
            active: initialData?.active ?? false,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().trim().required("Modul nomini kiriting"),
        }),
        onSubmit: async (values) => {
            const payload = {
                name: values.name.trim(),
                description: initialData?.description?.trim() || "",
                requiresSubscription: values.requiresSubscription,
                courseId,
                orderIndex: initialData?.orderIndex ?? suggestedOrderIndex,
                active: values.active,
            };

            try {
                if (isEditing && initialData?.id) {
                    await updateModule({
                        ...payload,
                        id: initialData.id,
                    } as Module);
                } else {
                    await addModule(payload as Omit<Module, "id" | "createdAt" | "lessonCount">);
                }
                onSuccess();
            } catch (error) {
                formik.setStatus(error instanceof Error ? error.message : "Modul saqlanmadi");
            }
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="space-y-4"
        >
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <div>
                    <Label htmlFor="name">Modul nomi</Label>
                    <Input
                        type="text"
                        formik={formik}
                        name="name"
                        placeholder="Masalan: Sotuv asoslari"
                        className="rounded-2xl border-gray-300 bg-white dark:bg-slate-950"
                    />
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Faqat obuna bilan ochiladi</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Yoqilgan bo‘lsa modul faqat active obunaga ega studentlarga ochiq. O‘chirilgan bo‘lsa hammaga bepul.
                        </p>
                    </div>
                    <Switch
                        checked={formik.values.requiresSubscription}
                        onCheckedChange={(checked) => formik.setFieldValue("requiresSubscription", checked)}
                    />
                </div>

                {isEditing ? (
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Studentlarga ko‘rinishi</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tayyor bo‘lmasa switch o‘chiq qolsin.</p>
                        </div>
                        <Switch
                            checked={formik.values.active}
                            onCheckedChange={(checked) => formik.setFieldValue("active", checked)}
                        />
                    </div>
                ) : null}

                {formik.status ? <p className="text-sm font-semibold text-red-500">{formik.status}</p> : null}
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="h-11 rounded-xl px-5 text-sm font-medium"
                >
                    Bekor qilish
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isPending={isAdding || isUpdating}
                    disabled={isAdding || isUpdating}
                    className="h-11 rounded-xl px-5 text-sm font-medium"
                >
                    {isEditing ? "Saqlash" : "Yaratish"}
                </Button>
            </div>
        </form>
    );
}
