import { Head, useForm } from "@inertiajs/react";

export default function Support({ company, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("public.support.store", company.slug), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <Head title={`Support - ${company.name}`} />

            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                {/* HEADER */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Contact Support
                    </h2>
                    <p className="text-indigo-600 font-medium mt-2">
                        {company.name}
                    </p>
                </div>

                {/* SUCCESS MESSAGE */}
                {status && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                        {status}
                    </div>
                )}

                {/* GLOBAL ERRORS (Blade wala behavior) */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 text-red-700 p-4 mb-4 rounded-lg text-sm border border-red-200">
                        <ul className="list-disc list-inside">
                            {Object.values(errors).map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    {/* NAME */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`mt-1 w-full rounded-lg p-2.5 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={`mt-1 w-full rounded-lg p-2.5 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    </div>

                    {/* SUBJECT */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData("subject", e.target.value)}
                            className={`mt-1 w-full rounded-lg p-2.5 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                errors.subject
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    </div>

                    {/* MESSAGE */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Message
                        </label>
                        <textarea
                            rows="4"
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            className={`mt-1 w-full rounded-lg p-2.5 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                errors.message
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50"
                    >
                        {processing ? "Sending..." : "Submit Support Request"}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-gray-400 italic">
                    Powered by Hassan AI-CMS & Gemini
                </p>
            </div>
        </div>
    );
}
