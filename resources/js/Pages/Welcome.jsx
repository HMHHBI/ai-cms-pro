import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="AI-CMS | Smart Support System" />

            <div className="antialiased bg-white text-gray-900 font-sans">
                {/* NAVBAR */}
                <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                    <div className="text-2xl font-extrabold text-indigo-600 tracking-tighter">
                        AI-CMS.
                    </div>

                    <div className="space-x-4">
                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="font-bold text-gray-700 hover:text-indigo-600"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="font-bold text-gray-700 hover:text-indigo-600"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={route("register")}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* HERO */}
                <header className="max-w-7xl mx-auto px-8 py-20 text-center">
                    <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
                        Powered by Gemini 2.5 Flash
                    </span>

                    <h1 className="text-6xl md:text-7xl font-extrabold mt-8 leading-tight tracking-tighter">
                        Smart Support for <br />
                        <span className="text-indigo-600">
                            Modern Businesses.
                        </span>
                    </h1>

                    <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
                        Automatic AI replies, sentiment analysis, and business
                        insights—all in one place. Scale your customer support
                        without the headache.
                    </p>

                    <div className="mt-10 flex justify-center space-x-4">
                        <Link
                            href={route("register")}
                            className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform"
                        >
                            Start Free Trial
                        </Link>

                        <button className="border border-gray-300 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50">
                            View Demo
                        </button>
                    </div>
                </header>

                {/* FEATURES */}
                <section className="bg-gray-50 py-24">
                    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="text-4xl mb-4">🤖</div>
                            <h3 className="text-xl font-bold mb-2">
                                AI Auto-Reply
                            </h3>
                            <p className="text-gray-500">
                                Gemini analyzes tickets and drafts professional
                                replies in seconds.
                            </p>
                        </div>

                        <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="text-4xl mb-4">🎭</div>
                            <h3 className="text-xl font-bold mb-2">
                                Sentiment Analysis
                            </h3>
                            <p className="text-gray-500">
                                Know your customer's mood (Angry, Happy,
                                Neutral) before you even open the ticket.
                            </p>
                        </div>

                        <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="text-xl font-bold mb-2">
                                Business Insights
                            </h3>
                            <p className="text-gray-500">
                                Get weekly AI reports on common issues and
                                product improvements.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} AI-CMS Developed by HMHHBI.
                    Built with Laravel, Inertia & Gemini.
                </footer>
            </div>
        </>
    );
}
