import {useMemo} from "react";
import {useQueries} from "@tanstack/react-query";
import {
    Activity,
    AlertCircle,
    ArrowUpRight,
    BookOpen,
    CheckCircle2,
    GraduationCap,
    Layers3,
    LoaderCircle,
    MousePointerClick,
    RefreshCcw,
    Sparkles,
    Users,
} from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import {useUser} from "../../api/auth/useAuth.ts";
import {useGetBusinessCourses, useGetInactiveBusinessCourses, useGetMyCourses} from "../../api/courses/useCourse.ts";
import {useGetUsers} from "../../api/businessUser/useBusinessUser.ts";
import {getCourseStudents} from "../../api/courseStudents/courseStudentsApi.ts";
import {getCourseTrackingAnalytics} from "../../api/trackingLinks/trackingLinkApi.ts";
import {parseApiError} from "../../utils/apiError.ts";
import type {Course, TrackingLinkAnalytics} from "../../types/types.ts";

const emptyAnalytics: TrackingLinkAnalytics = {
    clicks: 0,
    uniqueClicks: 0,
    leads: 0,
    checkoutStarted: 0,
    paidPurchases: 0,
    freeEnrolls: 0,
    paidAmount: 0,
    appliedFeeAmount: 0,
    netAmount: 0,
    failedOrAbandoned: 0,
    refunded: 0,
    refundedAmount: 0,
    revenue: 0,
    conversionRate: 0,
    lastActivityAt: null,
};

const formatNumber = (value: number) => new Intl.NumberFormat("uz-UZ").format(Math.round(value));

const formatMoney = (value: number) => `${new Intl.NumberFormat("uz-UZ").format(Math.round(value))} so‘m`;

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const formatDateTime = (value?: string | null) => {
    if (!value) return "Hali faollik qayd etilmagan";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const getStudentProgressPercent = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

export default function Analytics() {
    const {data: user, isLoading: isUserLoading} = useUser();
    const myCoursesQuery = useGetMyCourses();
    const businessCoursesQuery = useGetBusinessCourses();
    const inactiveCoursesQuery = useGetInactiveBusinessCourses();
    const membersQuery = useGetUsers(user?.businessId);

    const allCourses = useMemo(() => {
        const uniqueCourses = new Map<string, Course>();

        [
            ...(myCoursesQuery.data || []),
            ...(businessCoursesQuery.data || []),
            ...(inactiveCoursesQuery.data || []),
        ].forEach((course) => {
            uniqueCourses.set(course.id, course);
        });

        return Array.from(uniqueCourses.values());
    }, [businessCoursesQuery.data, inactiveCoursesQuery.data, myCoursesQuery.data]);

    const studentQueries = useQueries({
        queries: allCourses.map((course) => ({
            queryKey: ["analytics-course-students", course.id],
            queryFn: () => getCourseStudents(course.id),
            enabled: !!course.id,
            staleTime: 1000 * 30,
        })),
    });

    const analyticsQueries = useQueries({
        queries: allCourses.map((course) => ({
            queryKey: ["analytics-course-summary", course.id],
            queryFn: () => getCourseTrackingAnalytics(course.id),
            enabled: !!course.id,
            staleTime: 1000 * 30,
        })),
    });

    const isLoading =
        isUserLoading ||
        myCoursesQuery.isLoading ||
        businessCoursesQuery.isLoading ||
        inactiveCoursesQuery.isLoading ||
        membersQuery.isLoading ||
        studentQueries.some((query) => query.isLoading) ||
        analyticsQueries.some((query) => query.isLoading);

    const queryError =
        myCoursesQuery.error ||
        businessCoursesQuery.error ||
        inactiveCoursesQuery.error ||
        membersQuery.error ||
        studentQueries.find((query) => query.error)?.error ||
        analyticsQueries.find((query) => query.error)?.error ||
        null;

    const parsedError = queryError ? parseApiError(queryError, "Tahlillarni yuklab bo‘lmadi.") : null;

    const teamMembers = membersQuery.data || [];
    const teachersCount = teamMembers.filter((member) => member.role === "TEACHER").length;
    const assistantsCount = teamMembers.filter((member) => member.role === "ASSISTANT").length;

    const studentPortfolio = useMemo(() => {
        const uniqueStudents = new Map<string, {progress: number}>();

        studentQueries.forEach((query) => {
            (query.data || []).forEach((student) => {
                const current = uniqueStudents.get(student.studentId);
                const nextProgress = student.progressPercentage || 0;

                if (!current || nextProgress > current.progress) {
                    uniqueStudents.set(student.studentId, {progress: nextProgress});
                }
            });
        });

        const students = Array.from(uniqueStudents.values());
        const studyingCount = students.filter((student) => student.progress > 0 && student.progress < 100).length;
        const completedCount = students.filter((student) => student.progress >= 100).length;

        return {
            totalStudents: students.length,
            studyingCount,
            completedCount,
        };
    }, [studentQueries]);

    const aggregateAnalytics = useMemo(() => {
        const aggregated = analyticsQueries.reduce<TrackingLinkAnalytics>(
            (accumulator, query) => {
                const data = query.data || emptyAnalytics;
                const accumulatorDate = accumulator.lastActivityAt ? new Date(accumulator.lastActivityAt).getTime() : 0;
                const nextDate = data.lastActivityAt ? new Date(data.lastActivityAt).getTime() : 0;

                return {
                    ...accumulator,
                    clicks: accumulator.clicks + (data.clicks || 0),
                    uniqueClicks: accumulator.uniqueClicks + (data.uniqueClicks || 0),
                    leads: accumulator.leads + (data.leads || 0),
                    checkoutStarted: accumulator.checkoutStarted + (data.checkoutStarted || 0),
                    paidPurchases: accumulator.paidPurchases + (data.paidPurchases || 0),
                    freeEnrolls: (accumulator.freeEnrolls || 0) + (data.freeEnrolls || 0),
                    paidAmount: (accumulator.paidAmount || 0) + (data.paidAmount || 0),
                    appliedFeeAmount: (accumulator.appliedFeeAmount || 0) + (data.appliedFeeAmount || 0),
                    netAmount: (accumulator.netAmount || 0) + (data.netAmount || 0),
                    failedOrAbandoned: accumulator.failedOrAbandoned + (data.failedOrAbandoned || 0),
                    refunded: accumulator.refunded + (data.refunded || 0),
                    refundedAmount: (accumulator.refundedAmount || 0) + (data.refundedAmount || 0),
                    revenue: accumulator.revenue + (data.revenue || 0),
                    conversionRate: 0,
                    lastActivityAt: nextDate >= accumulatorDate ? data.lastActivityAt : accumulator.lastActivityAt,
                };
            },
            {...emptyAnalytics},
        );

        return {
            ...aggregated,
            conversionRate: aggregated.clicks > 0 ? (aggregated.paidPurchases / aggregated.clicks) * 100 : 0,
        };
    }, [analyticsQueries]);

    const totalCourses = allCourses.length;
    const activeCourses = allCourses.filter((course) => course.active).length;
    const inactiveCourses = allCourses.filter((course) => !course.active).length;
    const publishedCourses = allCourses.filter((course) => course.isPublished).length;
    const draftCoursesCount = allCourses.filter((course) => !course.isPublished).length;

    const studyingRate = getStudentProgressPercent(studentPortfolio.studyingCount, studentPortfolio.totalStudents);
    const completedRate = getStudentProgressPercent(studentPortfolio.completedCount, studentPortfolio.totalStudents);
    const publishedRate = getStudentProgressPercent(publishedCourses, totalCourses);

    const topMetrics = [
        {
            label: "Noyob bosishlar",
            value: formatNumber(aggregateAnalytics.uniqueClicks),
            helper: "Takrorlanmagan tashriflar",
            icon: MousePointerClick,
            tone: "from-sky-500/18 via-cyan-400/12 to-white dark:from-sky-500/18 dark:via-cyan-500/10 dark:to-slate-950",
            iconTone: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
        },
        {
            label: "Lidlar",
            value: formatNumber(aggregateAnalytics.leads),
            helper: "Ro‘yxatdan o‘tgan qiziqishlar",
            icon: Sparkles,
            tone: "from-emerald-500/18 via-teal-400/12 to-white dark:from-emerald-500/18 dark:via-teal-500/10 dark:to-slate-950",
            iconTone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
        },
        {
            label: "To‘langan summa",
            value: formatMoney(aggregateAnalytics.paidAmount || 0),
            helper: "Kurs sotuvlaridan tushum",
            icon: ArrowUpRight,
            tone: "from-amber-500/18 via-orange-400/12 to-white dark:from-amber-500/18 dark:via-orange-500/10 dark:to-slate-950",
            iconTone: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
        },
        {
            label: "Sof summa",
            value: formatMoney(aggregateAnalytics.netAmount || 0),
            helper: "Komissiyadan keyingi natija",
            icon: CheckCircle2,
            tone: "from-violet-500/18 via-fuchsia-400/12 to-white dark:from-violet-500/18 dark:via-fuchsia-500/10 dark:to-slate-950",
            iconTone: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
        },
    ];

    const portfolioMetrics = [
        {
            label: "Barcha kurslar",
            value: totalCourses,
            helper: `${activeCourses} ta faol, ${inactiveCourses} ta nofaol`,
            icon: BookOpen,
        },
        {
            label: "Jamoa qamrovi",
            value: teamMembers.length,
            helper: `${teachersCount} ta o‘qituvchi, ${assistantsCount} ta assistent`,
            icon: Users,
        },
        {
            label: "Talabalar oqimi",
            value: studentPortfolio.totalStudents,
            helper: `${studentPortfolio.studyingCount} o‘qiyotgan, ${studentPortfolio.completedCount} tugallagan`,
            icon: GraduationCap,
        },
    ];

    const signalBoard = [
        {label: "Bosishlar", value: formatNumber(aggregateAnalytics.clicks), helper: "Jami trafik"},
        {label: "Checkout boshlangan", value: formatNumber(aggregateAnalytics.checkoutStarted), helper: "To‘lovni boshlaganlar"},
        {label: "To‘langan xaridlar", value: formatNumber(aggregateAnalytics.paidPurchases), helper: "Muvaffaqiyatli sotuvlar"},
        {label: "Tekin modullar", value: formatNumber(aggregateAnalytics.freeEnrolls || 0), helper: "Bepul enroll holatlari"},
        {label: "Komissiya", value: formatMoney(aggregateAnalytics.appliedFeeAmount || 0), helper: "Platforma komissiyasi"},
        {label: "Refund summasi", value: formatMoney(aggregateAnalytics.refundedAmount || 0), helper: `${formatNumber(aggregateAnalytics.refunded)} ta refund`},
    ];

    const operatingFeed = [
        {
            title: "So‘nggi faollik",
            description: formatDateTime(aggregateAnalytics.lastActivityAt),
        },
        {
            title: "Konversiya darajasi",
            description: formatPercent(aggregateAnalytics.conversionRate),
        },
        {
            title: "Nashrdagi kurslar ulushi",
            description: `${publishedRate}% (${publishedCourses}/${totalCourses || 0})`,
        },
        {
            title: "Qoralama kurslar",
            description: `${draftCoursesCount} ta kurs hali tayyorlanmoqda`,
        },
        {
            title: "O‘qiyotgan studentlar",
            description: `${studyingRate}% faol o‘quv oqimi`,
        },
        {
            title: "Tugallash darajasi",
            description: `${completedRate}% kursni yakunlagan`,
        },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/60 bg-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/75 dark:shadow-[0_24px_60px_rgba(2,6,23,0.45)]">
                        <LoaderCircle className="h-10 w-10 animate-spin text-sky-600" />
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">Tahlillar</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Ma’lumotlar yuklanmoqda</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (parsedError) {
        return (
            <div className="mx-auto max-w-[1560px] pb-8">
                <PageMeta title="Tahlillar" description="Biznes kurslari analitikasi" />
                <div className="rounded-[32px] border border-rose-200 bg-rose-50/80 px-6 py-14 text-center shadow-[0_24px_70px_rgba(15,23,42,0.06)] dark:border-rose-500/20 dark:bg-rose-500/10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm dark:bg-slate-950 dark:text-rose-300">
                        <AlertCircle className="h-7 w-7" />
                    </div>
                    <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">Tahlillarni yuklab bo‘lmadi</h2>
                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{parsedError.message}</p>
                    <button
                        type="button"
                        onClick={() => {
                            void Promise.all([
                                myCoursesQuery.refetch(),
                                businessCoursesQuery.refetch(),
                                inactiveCoursesQuery.refetch(),
                                membersQuery.refetch(),
                                ...studentQueries.map((query) => query.refetch()),
                                ...analyticsQueries.map((query) => query.refetch()),
                            ]);
                        }}
                        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Qayta urinish
                    </button>
                </div>
            </div>
        );
    }

    if (allCourses.length === 0) {
        return (
            <div className="mx-auto max-w-[1560px] pb-8">
                <PageMeta title="Tahlillar" description="Biznes kurslari analitikasi" />
                <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/85 px-6 py-16 text-center shadow-[0_24px_70px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/75">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                        <Activity className="h-7 w-7" />
                    </div>
                    <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">Tahlillar uchun kurs topilmadi</h2>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Analytics ko‘rinishi chiqishi uchun avval kamida bitta kurs business workspace ichida bo‘lishi kerak.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1560px] space-y-6 pb-8">
            <PageMeta title="Tahlillar" description="Biznes kurslari analitikasi va konversiya holati" />

            <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.97),_rgba(248,250,252,0.9))] shadow-[0_32px_90px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(135deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.92))] dark:shadow-[0_32px_90px_rgba(2,6,23,0.45)]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:150px_150px] opacity-40 dark:opacity-20" />
                <div className="relative grid gap-6 px-6 py-6 md:px-8 xl:grid-cols-[minmax(0,1.2fr)_360px]">
                    <div className="rounded-[30px] border border-white/75 bg-white/82 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/75 dark:shadow-[0_24px_60px_rgba(2,6,23,0.35)]">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
                                Tahlillar markazi
                            </span>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                                {user?.roleName || "Biznes workspace"}
                            </span>
                        </div>

                        <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-[2.7rem]">
                            Kurslar, lidlar va sotuv signallari bitta panelda
                        </h1>
                        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-slate-500 dark:text-slate-300 md:text-base">
                            Bu sahifa kurs portfeli, jamoa va tracking analytics oqimlarini bir joyga yig‘ib, qaysi tomonda o‘sish va qaysi joyda sustlik borligini tez ko‘rsatadi.
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {topMetrics.map((card) => (
                                <article
                                    key={card.label}
                                    className={`overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-br ${card.tone} p-4 shadow-[0_14px_32px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-slate-800`}
                                >
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-[16px] shadow-sm ${card.iconTone}`}>
                                        <card.icon className="h-5 w-5" />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">{card.value}</p>
                                        <p className="mt-1.5 text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">{card.label}</p>
                                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{card.helper}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-blue-100 bg-[linear-gradient(180deg,rgba(239,246,255,0.98),rgba(255,255,255,0.98))] p-5 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] dark:text-slate-100 dark:shadow-[0_24px_60px_rgba(2,6,23,0.45)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-500/70 dark:text-slate-500">Operatsion holat</p>
                                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">Joriy signal</h2>
                            </div>
                            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-200" />
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            {operatingFeed.map((item) => (
                                <div key={item.title} className="rounded-[22px] border border-blue-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                    <p className="text-sm font-black text-slate-900 dark:text-slate-100">{item.title}</p>
                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_420px]">
                <div className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.07)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/75 dark:shadow-[0_28px_80px_rgba(2,6,23,0.45)]">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Biznes ko‘rinishi</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">Portfel holati</h2>
                        </div>
                        <div className="rounded-2xl bg-sky-50 p-3 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                            <Layers3 className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {portfolioMetrics.map((card) => (
                            <div key={card.label} className="rounded-[24px] border border-slate-200 bg-slate-50/75 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                                <div className="inline-flex rounded-2xl bg-white p-3 text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300 dark:shadow-none">
                                    <card.icon className="h-5 w-5" />
                                </div>
                                <p className="mt-4 text-sm font-black text-slate-950 dark:text-slate-100">{card.label}</p>
                                <div className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">{card.value}</div>
                                <p className="mt-2 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">{card.helper}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.07)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/75 dark:shadow-[0_28px_80px_rgba(2,6,23,0.45)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Talaba oqimi</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">Progress paneli</h2>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="rounded-[24px] border border-blue-200/80 bg-blue-50/70 p-5 dark:border-blue-500/20 dark:bg-blue-500/10">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-black text-slate-950 dark:text-slate-100">O‘qiyotgan student</p>
                                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Progress 1% - 99%</p>
                                </div>
                                <div className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">{studentPortfolio.studyingCount}</div>
                            </div>
                            <div className="mt-4 h-2 rounded-full bg-white/70 dark:bg-slate-900/70">
                                <div className="h-2 rounded-full bg-blue-500" style={{width: `${studyingRate}%`}} />
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-emerald-200/80 bg-emerald-50/70 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-black text-slate-950 dark:text-slate-100">Tugallagan student</p>
                                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Progress 100%</p>
                                </div>
                                <div className="text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">{studentPortfolio.completedCount}</div>
                            </div>
                            <div className="mt-4 h-2 rounded-full bg-white/70 dark:bg-slate-900/70">
                                <div className="h-2 rounded-full bg-emerald-500" style={{width: `${completedRate}%`}} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.07)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/75 dark:shadow-[0_28px_80px_rgba(2,6,23,0.45)]">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Savdo signallari</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">Konversiya paneli</h2>
                    </div>
                    <div className="rounded-2xl bg-violet-50 p-3 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {signalBoard.map((item) => (
                        <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{item.label}</p>
                            <div className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100">{item.value}</div>
                            <p className="mt-2 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">{item.helper}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
