import {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    Briefcase,
    Check,
    Filter,
    GripVertical,
    Languages,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Trash2,
} from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import Spinner from "../../components/common/Spinner.tsx";
import {hasPermission, useUser} from "../../api/auth/useAuth.ts";
import {
    useDeleteProfession,
    useGetProfessionFields,
    useGetProfessions,
    useUpdateProfession,
} from "../../api/professions/useProfession.ts";
import type {ProfessionCreateRequest} from "../../api/professions/professionApi.ts";
import type {Profession, SupportedLanguage} from "../../types/types.ts";
import {
    type FieldOption,
    getFieldMeta,
    getToneMeta,
    getTranslation,
    isTranslationComplete,
    sortByOrder,
    supportedLanguages,
    toFieldOption,
    toneOptions,
} from "../../components/professions/professionShared.ts";
import {Badge} from "../../components/ui/badge.tsx";
import {Input} from "../../components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/ui/select.tsx";
import {cn} from "../../utils/utils.ts";

export default function Professions() {
    const navigate = useNavigate();
    const {data: user, isLoading: isUserLoading} = useUser();
    const canManageProfessions = hasPermission(user?.permissionsList, "PROFESSION_MANAGE");

    const {data: professionsData, isLoading: isProfessionsLoading} = useGetProfessions(canManageProfessions);
    const {data: fieldsData, isLoading: isFieldsLoading} = useGetProfessionFields(canManageProfessions);

    const updateProfessionMut = useUpdateProfession();
    const deleteProfessionMut = useDeleteProfession();

    const professions: Profession[] = useMemo(() => professionsData ?? [], [professionsData]);
    const fieldOptions: FieldOption[] = useMemo(
        () => (fieldsData ?? []).map(toFieldOption),
        [fieldsData],
    );

    const [search, setSearch] = useState("");
    const [fieldFilter, setFieldFilter] = useState("all");
    const [toneFilter, setToneFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const orderedProfessions = useMemo(() => sortByOrder(professions), [professions]);

    const normalizedSearch = search.trim().toLowerCase();
    const filteredProfessions = useMemo(() => {
        return orderedProfessions.filter((profession) => {
            const matchingSearch =
                !normalizedSearch
                || profession.slug.toLowerCase().includes(normalizedSearch)
                || profession.fieldLabel.toLowerCase().includes(normalizedSearch)
                || profession.translations.some((translation) =>
                    translation.title.toLowerCase().includes(normalizedSearch)
                    || translation.tagline.toLowerCase().includes(normalizedSearch),
                );

            const matchingField = fieldFilter === "all" || profession.fieldKey === fieldFilter;
            const matchingTone = toneFilter === "all" || profession.demandTone === toneFilter;
            const matchingStatus =
                statusFilter === "all"
                || (statusFilter === "active" && profession.active)
                || (statusFilter === "inactive" && !profession.active);

            return matchingSearch && matchingField && matchingTone && matchingStatus;
        });
    }, [fieldFilter, normalizedSearch, orderedProfessions, statusFilter, toneFilter]);

    const activeCount = professions.filter((profession) => profession.active && !profession.deleted).length;
    const hiddenCount = professions.filter((profession) => !profession.active || profession.deleted).length;
    const translationCompleteCount = professions.filter((profession) =>
        supportedLanguages.every((languageCode) => isTranslationComplete(getTranslation(profession, languageCode))),
    ).length;
    const totalLinkedCourses = professions.reduce((total, profession) => total + profession.courses.length, 0);

    const openCreatePage = () => {
        navigate("/professions/create");
    };

    const openEditPage = (profession: Profession, tab?: SupportedLanguage | "courses") => {
        navigate(tab ? `/professions/${profession.id}/edit?tab=${tab}` : `/professions/${profession.id}/edit`);
    };

    const openTranslatePage = (profession: Profession) => {
        const nextTab =
            supportedLanguages.find((languageCode) => !isTranslationComplete(getTranslation(profession, languageCode)))
            || "ru";
        openEditPage(profession, nextTab);
    };

    const openCoursesPage = (profession: Profession) => {
        openEditPage(profession, "courses");
    };

    const buildUpdatePayload = (profession: Profession, overrides: Partial<Profession> = {}): ProfessionCreateRequest => {
        const merged: Profession = {...profession, ...overrides};
        const uz = merged.translations.find((item) => item.languageCode === "uz");
        return {
            slug: merged.slug,
            emoji: merged.emoji,
            fieldKey: merged.fieldKey,
            gradFrom: merged.gradFrom,
            gradTo: merged.gradTo,
            demand: merged.demand || uz?.demandLabel || "",
            demandTone: merged.demandTone,
            duration: merged.duration || uz?.durationLabel || "",
            level: merged.level || uz?.levelLabel || "",
            displayOrder: merged.displayOrder,
            translations: merged.translations,
        };
    };

    const persistReorder = async (nextOrder: Profession[]) => {
        const current = new Map(professions.map((profession) => [profession.id, profession.displayOrder]));
        const changed = nextOrder.filter((profession, index) => current.get(profession.id) !== index + 1);
        for (let i = 0; i < changed.length; i++) {
            const profession = changed[i];
            const targetIndex = nextOrder.findIndex((item) => item.id === profession.id);
            const payload = buildUpdatePayload(profession, {displayOrder: targetIndex + 1});
            try {
                await updateProfessionMut.mutateAsync({id: profession.id, ...payload});
            } catch (error) {
                console.error("Reorder failed for", profession.id, error);
                return;
            }
        }
    };

    const moveProfession = (sourceId: string, targetId: string) => {
        const list = sortByOrder(professions);
        const sourceIndex = list.findIndex((profession) => profession.id === sourceId);
        const targetIndex = list.findIndex((profession) => profession.id === targetId);

        if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
            return;
        }

        const next = [...list];
        const [moved] = next.splice(sourceIndex, 1);
        next.splice(targetIndex, 0, moved);
        void persistReorder(next);
    };

    const moveProfessionByOffset = (professionId: string, offset: number) => {
        const list = sortByOrder(professions);
        const currentIndex = list.findIndex((profession) => profession.id === professionId);
        const nextIndex = currentIndex + offset;

        if (currentIndex < 0 || nextIndex < 0 || nextIndex >= list.length) {
            return;
        }

        const next = [...list];
        const [moved] = next.splice(currentIndex, 1);
        next.splice(nextIndex, 0, moved);
        void persistReorder(next);
    };

    const handleDelete = (profession: Profession) => {
        const confirmed = window.confirm("Bu kasbni yashirasizmi? Foydalanuvchilarga ko'rinmaydi, lekin saqlanadi.");
        if (!confirmed) {
            return;
        }

        deleteProfessionMut.mutate(profession.id);
    };

    if (isUserLoading || (canManageProfessions && (isProfessionsLoading || isFieldsLoading))) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!canManageProfessions) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center pb-10">
                <PageMeta title="Kasblar" description="Kasblar katalogi boshqaruv sahifasi." />
                <section className="w-full rounded-[28px] border border-rose-200 bg-rose-50/80 p-6 shadow-[0_18px_40px_rgba(244,63,94,0.08)] backdrop-blur-xl dark:border-rose-500/20 dark:bg-rose-500/10">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm dark:bg-slate-950 dark:text-rose-300">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                        Sizda `PROFESSION_MANAGE` permission yo'q
                    </h1>
                    <p className="mx-auto mt-2 max-w-2xl text-center text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Bu sahifa kasblar katalogi, tarjimalar, kurslar va tartibni boshqarish uchun mo'ljallangan.
                        Permission sizning rolingizga qo'shilgach, sahifa va menyu avtomatik ochiladi.
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1600px] space-y-5 pb-10">
            <PageMeta
                title="Kasblar"
                description="Kasblar katalogi, tarjimalar, kurslar va tartibni boshqarish sahifasi."
            />

            <section className="overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm dark:border-sky-500/20 dark:bg-slate-950/80 dark:text-sky-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            CMS workspace
                        </div>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
                            Kasblar katalogi
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                            Kasblarni yaratish, tarjima qo'shish, kurslarni biriktirish va tartibni boshqarish uchun
                            bitta panel.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreatePage}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.2)] transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                        <Plus className="h-4.5 w-4.5" />
                        Yangi kasb
                    </button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            label: "Kasblar",
                            value: professions.length,
                            helper: hiddenCount > 0 ? `${hiddenCount} yashirilgan` : "Jami katalog",
                            icon: Briefcase,
                            tone: "from-sky-500/15 via-cyan-400/10 to-white dark:from-sky-500/15 dark:via-cyan-500/10 dark:to-slate-950",
                        },
                        {
                            label: "Active",
                            value: activeCount,
                            helper: "Foydalanuvchiga ko'rinadi",
                            icon: Check,
                            tone: "from-emerald-500/15 via-teal-400/10 to-white dark:from-emerald-500/15 dark:via-teal-500/10 dark:to-slate-950",
                        },
                        {
                            label: "Tarjimalar to'liq",
                            value: translationCompleteCount,
                            helper: "UZ/RU/EN",
                            icon: Languages,
                            tone: "from-violet-500/15 via-fuchsia-400/10 to-white dark:from-violet-500/15 dark:via-fuchsia-500/10 dark:to-slate-950",
                        },
                        {
                            label: "Bog'langan kurslar",
                            value: totalLinkedCourses,
                            helper: "Kasblarga biriktirilgan",
                            icon: Sparkles,
                            tone: "from-amber-500/15 via-orange-400/10 to-white dark:from-amber-500/15 dark:via-orange-500/10 dark:to-slate-950",
                        },
                    ].map((card) => {
                        const Icon = card.icon;
                        return (
                            <article
                                key={card.label}
                                className={`rounded-[26px] border border-white/70 bg-gradient-to-br ${card.tone} p-4 shadow-[0_16px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-slate-800 sm:p-5`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-950/80 dark:text-slate-400">
                                        {card.helper}
                                    </span>
                                </div>
                                <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                                    {card.value}
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    {card.label}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-[30px] border border-white/70 bg-white/92 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/86 dark:shadow-[0_18px_45px_rgba(2,6,23,0.35)] sm:p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="grid flex-1 gap-3 lg:grid-cols-4">
                        <div className="relative lg:col-span-2">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Title, slug yoki tagline bo'yicha qidirish"
                                className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 text-sm shadow-none dark:border-slate-800 dark:bg-slate-900/70"
                            />
                        </div>

                        <Select value={fieldFilter} onValueChange={setFieldFilter}>
                            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-900/70">
                                <SelectValue placeholder="Soha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha sohalar</SelectItem>
                                {fieldOptions.map((field) => (
                                    <SelectItem key={field.key} value={field.key}>
                                        {field.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={toneFilter} onValueChange={setToneFilter}>
                            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-900/70">
                                <SelectValue placeholder="Demand" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha demandlar</SelectItem>
                                {toneOptions.map((tone) => (
                                    <SelectItem key={tone.value} value={tone.value}>
                                        {tone.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-900/70">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barchasi</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Yashirilgan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setFieldFilter("all");
                                setToneFilter("all");
                                setStatusFilter("all");
                            }}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            <Filter className="h-4 w-4" />
                            Filtrlarni tozalash
                        </button>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/86 dark:shadow-[0_18px_45px_rgba(2,6,23,0.35)]">
                <div className="flex flex-col gap-3 border-b border-slate-200/80 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                            Kasblar jadvali
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Qatorni ushlab sudrab orderni o'zgartiring yoki amallar orqali tahrir qiling.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                        <GripVertical className="h-3.5 w-3.5" />
                        Drag & drop faol
                    </div>
                </div>

                {filteredProfessions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-[1180px] w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-slate-50/80 text-left text-xs uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                                    <th className="px-5 py-4 font-semibold">Drag</th>
                                    <th className="px-5 py-4 font-semibold">Emoji</th>
                                    <th className="px-5 py-4 font-semibold">Title / Slug</th>
                                    <th className="px-5 py-4 font-semibold">Soha</th>
                                    <th className="px-5 py-4 font-semibold">Demand</th>
                                    <th className="px-5 py-4 font-semibold">Kurslar</th>
                                    <th className="px-5 py-4 font-semibold">Tartib</th>
                                    <th className="px-5 py-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProfessions.map((profession, index) => {
                                    const translation = getTranslation(profession, "uz");
                                    const toneMeta = getToneMeta(profession.demandTone);
                                    const fieldMeta = getFieldMeta(fieldOptions, profession.fieldKey);
                                    const isDragging = draggingId === profession.id;

                                    return (
                                        <tr
                                            key={profession.id}
                                            draggable
                                            onDragStart={() => setDraggingId(profession.id)}
                                            onDragEnd={() => setDraggingId(null)}
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={() => {
                                                if (draggingId && draggingId !== profession.id) {
                                                    moveProfession(draggingId, profession.id);
                                                }
                                                setDraggingId(null);
                                            }}
                                            className={cn(
                                                "border-t border-slate-100/80 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/70",
                                                isDragging && "opacity-60",
                                            )}
                                        >
                                            <td className="px-5 py-4 align-middle">
                                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-lg shadow-sm dark:bg-slate-900">
                                                    <GripVertical className="h-4.5 w-4.5 text-slate-400" />
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 align-middle text-2xl">{profession.emoji}</td>
                                            <td className="px-5 py-4 align-middle">
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                                                            {translation.title || "Untitled"}
                                                        </span>
                                                        {profession.deleted ? (
                                                            <Badge variant="outline" className="rounded-full border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                                                                Yashirilgan
                                                            </Badge>
                                                        ) : null}
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        /{profession.slug}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 align-middle">
                                                <div className="space-y-1">
                                                    <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                                        {fieldMeta.label}
                                                    </Badge>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {fieldMeta.helper}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("rounded-full border px-3 py-1 text-xs font-semibold", toneMeta.className)}
                                                >
                                                    {toneMeta.label}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4 align-middle">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                                                        {profession.courses.length} ta kurs
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {profession.courses.slice(0, 2).map((course) => course.name).join(" • ") || "Kurs biriktirilmagan"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 align-middle">
                                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                                    <span>{profession.displayOrder}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveProfessionByOffset(profession.id, -1)}
                                                        disabled={index === 0}
                                                        className="rounded-full p-1 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-white"
                                                        aria-label="Tartibni yuqoriga o'tkazish"
                                                    >
                                                        <ArrowUp className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveProfessionByOffset(profession.id, 1)}
                                                        disabled={index === filteredProfessions.length - 1}
                                                        className="rounded-full p-1 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-white"
                                                        aria-label="Tartibni pastga o'tkazish"
                                                    >
                                                        <ArrowDown className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 align-middle">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditPage(profession)}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openTranslatePage(profession)}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:bg-violet-500/15"
                                                    >
                                                        <Languages className="h-3.5 w-3.5" />
                                                        Translate
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openCoursesPage(profession)}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/15"
                                                    >
                                                        <Briefcase className="h-3.5 w-3.5" />
                                                        Courses
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(profession)}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/15"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-5 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-slate-100">
                            Kasb topilmadi
                        </h3>
                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Qidiruv yoki filter bo'yicha mos kasb topilmadi. Filtrlarni tozalab qayta urinib ko'ring.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
