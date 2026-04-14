import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Dashboard({
    auth,
    tickets,
    stats,
    aiInsight,
    staffMembers,
    filters,
}) {
    // 1. Local states for filters
    const [search, setSearch] = useState(filters.search || "");
    const [filterMood, setFilterMood] = useState(filters.mood || "all");
    const currentStatus = filters.status || "open";

    const isAdmin = auth.user.role === "admin";

    // 🔍 2. Global Filter Function (Tabs, Mood, aur Search ko merge karta hai)
    const applyFilters = (
        newStatus = currentStatus,
        newMood = filterMood,
        newSearch = search,
    ) => {
        router.get(
            route("dashboard"),
            {
                status: newStatus,
                mood: newMood,
                search: newSearch,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    // ⏱️ Debounced Search: Jab user likhna band kare tab request jaye
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || "")) {
                applyFilters(currentStatus, filterMood, search);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const [selectedTicket, setSelectedTicket] = useState(null);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {auth.user.company?.name} Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* 📊 Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <StatCard
                            title="Total"
                            value={stats?.total || 0}
                            color="indigo"
                            icon="📊"
                        />
                        <StatCard
                            title="Open"
                            value={stats?.open || 0}
                            color="green"
                            icon="📬"
                        />
                        <StatCard
                            title="Urgent"
                            value={stats?.urgent || 0}
                            color="red"
                            pulse={stats?.urgent > 0}
                            icon="🔥"
                        />
                        <StatCard
                            title="Resolved"
                            value={stats?.resolvedToday || 0}
                            color="purple"
                            icon="✅"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* 📑 TABS: Active vs Archive */}
                                <div className="flex border-b">
                                    <button
                                        onClick={() =>
                                            applyFilters(
                                                "open",
                                                filterMood,
                                                search,
                                            )
                                        }
                                        className={`flex-1 py-4 text-sm font-bold transition-all ${currentStatus === "open" ? "border-b-2 border-indigo-600 text-indigo-600 bg-white" : "bg-gray-50 text-gray-400"}`}
                                    >
                                        📥 Active Inbox ({stats.open})
                                    </button>
                                    <button
                                        onClick={() =>
                                            applyFilters(
                                                "closed",
                                                filterMood,
                                                search,
                                            )
                                        }
                                        className={`flex-1 py-4 text-sm font-bold transition-all ${currentStatus === "closed" ? "border-b-2 border-gray-600 text-gray-600 bg-white" : "bg-gray-50 text-gray-400"}`}
                                    >
                                        📁 Closed Archive
                                    </button>
                                </div>

                                <div className="p-4 md:p-6 space-y-4">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        {/* 🔎 Search Input */}
                                        <input
                                            type="text"
                                            placeholder="Search subject, customer..."
                                            className="rounded-xl border-gray-200 w-full md:w-1/2 focus:ring-indigo-500"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />

                                        {/* 🎭 MOOD FILTER (Wapas aa gaya!) */}
                                        <div className="flex gap-1 bg-gray-100 p-1 rounded-full overflow-x-auto">
                                            {[
                                                "all",
                                                "negative",
                                                "neutral",
                                                "positive",
                                            ].map((m) => (
                                                <button
                                                    key={m}
                                                    onClick={() => {
                                                        setFilterMood(m);
                                                        applyFilters(
                                                            currentStatus,
                                                            m,
                                                            search,
                                                        );
                                                    }}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-all ${filterMood === m ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                                                >
                                                    {m === "all"
                                                        ? "All"
                                                        : m === "negative"
                                                          ? "Urgent 🔥"
                                                          : m === "neutral"
                                                            ? "Neutral 😐"
                                                            : "Happy 😊"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <TicketTable
                                    tickets={tickets}
                                    staff={staffMembers}
                                    isAdmin={isAdmin}
                                    auth={auth}
                                    onView={(ticket) =>
                                        setSelectedTicket(ticket)
                                    }
                                />
                            </div>
                        </div>

                        {/* ✨ Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <CreateTicketForm />
                            <AiInsights />
                            <AiAssistant />
                        </div>
                    </div>
                </div>
            </div>

            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
        </AuthenticatedLayout>
    );
}

// --- SUB COMPONENTS ---

function TicketTable({ tickets, staff, isAdmin, auth, onView }) {
    return (
        <div className="overflow-x-auto">
            {tickets.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center">
                    <span className="text-5xl mb-4">☕</span>
                    <p className="text-gray-500 font-medium">
                        No tickets found here.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Try changing your filters or search terms.
                    </p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 hidden md:table-row-group">
                        <tr>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">
                                Ticket Info
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">
                                Assigned To
                            </th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase">
                                Actions
                            </th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase">
                                Recieved
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <tr
                                key={ticket.id}
                                className="hover:bg-gray-50 flex flex-col md:table-row p-4 md:p-0"
                            >
                                <td className="md:px-6 md:py-4">
                                    <div className="text-sm font-bold text-gray-900">
                                        {ticket.subject}
                                    </div>
                                    <div className="text-xs text-gray-500 italic">
                                        From: {ticket.customer_name || "Guest"}
                                    </div>
                                    <div className="mt-2 flex gap-2 md:hidden">
                                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
                                            {ticket.status}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                                            {ticket.ai_sentiment}
                                        </span>
                                    </div>
                                </td>
                                <td className="md:px-6 md:py-4 mt-3 md:mt-0">
                                    {isAdmin ? (
                                        <select
                                            className="text-xs rounded-lg border-gray-300 w-full"
                                            onChange={(e) =>
                                                router.post(
                                                    route(
                                                        "tickets.assign",
                                                        ticket.id,
                                                    ),
                                                    {
                                                        staff_id:
                                                            e.target.value,
                                                    },
                                                )
                                            }
                                            defaultValue={
                                                ticket.assigned_to || ""
                                            }
                                        >
                                            <option value="">Unassigned</option>
                                            {staff?.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : ticket.assigned_to === auth.user.id ? (
                                        <span className="text-green-600 text-xs font-bold uppercase">
                                            Your Task
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                router.post(
                                                    route(
                                                        "tickets.claim",
                                                        ticket.id,
                                                    ),
                                                )
                                            }
                                            className="bg-indigo-500 text-white px-3 py-1 rounded text-[10px] font-bold"
                                        >
                                            CLAIM
                                        </button>
                                    )}
                                </td>
                                <td className="md:px-6 md:py-4 text-right mt-3 md:mt-0">
                                    <button
                                        onClick={() => onView(ticket)}
                                        className="text-indigo-600 font-bold text-xs uppercase underline"
                                    >
                                        View Details
                                    </button>
                                </td>
                                <td className="md:px-6 md:py-4 text-right mt-3 md:mt-0">
                                    <span
                                        className={
                                            ticket.is_overdue
                                                ? "text-red-600 font-bold animate-pulse"
                                                : "text-gray-500"
                                        }
                                    >
                                        {ticket.created_at_human}{" "}
                                        {/* Controller se formatted date bhejien */}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function TicketModal({ ticket, onClose }) {
    const { data, setData, post, processing } = useForm({
        reply: ticket.ai_suggestion || "",
    });

    const handleApprove = () => {
        console.log("Resolving Ticket ID:", ticket.id);
        post(route("tickets.resolve", ticket.id), {
            onSuccess: () => {
                console.log("Success!");
                onClose();
            },
            onError: (err) => console.log("Error:", err),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg">
                        Ticket Details #{ticket.id}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 text-2xl"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl italic text-gray-600 border">
                        "{ticket.message}"
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                            AI Suggested Reply
                        </label>
                        <textarea
                            className="w-full rounded-xl border-gray-200 h-40"
                            value={data.reply}
                            onChange={(e) => setData("reply", e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 font-bold text-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={processing}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold"
                    >
                        {processing ? "Sending..." : "Approve & Send Email"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color, icon, pulse }) {
    const borders = {
        indigo: "border-indigo-500",
        green: "border-green-500",
        red: "border-red-500",
        purple: "border-purple-500",
    };
    return (
        <div
            className={`bg-white p-6 rounded-2xl shadow-sm border-b-4 ${borders[color]} ${pulse ? "animate-pulse" : ""}`}
        >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {title}
            </p>
            <div className="flex items-center justify-between mt-2">
                <p
                    className={`text-3xl font-black ${color === "red" ? "text-red-600" : "text-gray-800"}`}
                >
                    {value}
                </p>
                <span className="p-2 bg-gray-50 rounded-lg">{icon}</span>
            </div>
        </div>
    );
}

function CreateTicketForm() {
    const { data, setData, post, processing, reset } = useForm({
        subject: "",
        message: "",
    });
    const submit = (e) => {
        e.preventDefault();
        post(route("tickets.store"), { onSuccess: () => reset() });
    };
    return (
        <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-800 mb-4">New Support Case</h3>
            <form onSubmit={submit} className="space-y-4">
                <input
                    className="w-full rounded-xl border-gray-200"
                    placeholder="Subject"
                    value={data.subject}
                    onChange={(e) => setData("subject", e.target.value)}
                />
                <textarea
                    className="w-full rounded-xl border-gray-200"
                    placeholder="Message"
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                />
                <button
                    disabled={processing}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                    {processing ? "AI is analyzing..." : "Create Ticket ✨"}
                </button>
            </form>
        </div>
    );
}

function AiInsights() {
    const [insight, setInsight] = useState(
        "Click refresh to analyze ticket trends...",
    );
    const [loading, setLoading] = useState(false);

    const fetchInsight = async () => {
        setLoading(true);
        try {
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const res = await fetch(route("ai.insight"), {
                method: "POST", // ✅ Method POST hona chahiye
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    // ✅ CSRF Token lazmi hai warna Laravel block kar deta hai
                    "X-CSRF-TOKEN": token,
                },
            });

            if (!res.ok) throw new Error("Server error");

            const data = await res.json();
            setInsight(data.insight);
        } catch (err) {
            console.error(err);
            setInsight("Failed to fetch analysis. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-black rounded-2xl p-6 text-white shadow-xl border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-bold flex items-center">
                    <span className="mr-2">✨</span> AI Manager Insight
                </h3>
                <button
                    onClick={fetchInsight}
                    disabled={loading}
                    className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition ${loading ? "animate-spin" : ""}`}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        ></path>
                    </svg>
                </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 min-h-[60px] flex items-center">
                <p className="text-sm leading-relaxed font-medium italic">
                    {loading ? "AI is thinking deep..." : insight}
                </p>
            </div>
            {/* ... baqi UI same ... */}
        </div>
    );
}

function AiAssistant() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const askAi = async () => {
        if (!prompt) return;

        setLoading(true);

        try {
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const res = await fetch("/ai/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": token,
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setResponse(data.response);
            setPrompt("");
        } catch (err) {
            console.error(err);
            alert("AI request failed");
        }

        setLoading(false);
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                🤖 AI Assistant (Gemini)
            </h3>

            <div className="mb-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask AI to write a reply or analyze data..."
                    className="w-full rounded-md border-gray-300"
                />
            </div>

            <button
                onClick={askAi}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
                {loading ? "Thinking..." : "Ask AI"}
            </button>

            {response && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md text-gray-800">
                    <strong>AI Response:</strong>
                    <p className="mt-2 text-sm">{response}</p>
                </div>
            )}
        </div>
    );
}
