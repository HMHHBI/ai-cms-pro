import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function Dashboard({ auth, companies, pendingUsers }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-indigo-600">
                    Super Admin Control Center
                </h2>
            }
        >
            <Head title="Super Admin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Pending Approvals */}
                    <div className="bg-white p-6 shadow sm:rounded-lg border-l-4 border-yellow-400">
                        <h3 className="text-lg font-bold mb-4">
                            Pending Company Approvals ⏳
                        </h3>
                        <div className="space-y-4">
                            {pendingUsers.length === 0 && (
                                <p className="text-gray-500 italic">
                                    No pending requests.
                                </p>
                            )}
                            {pendingUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                                >
                                    <div>
                                        <div className="font-bold text-gray-800">
                                            {user.company?.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Admin: {user.name} ({user.email})
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            router.post(
                                                route(
                                                    "super-admin.approve",
                                                    user.id,
                                                ),
                                            )
                                        }
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700"
                                    >
                                        Approve & Activate
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* All Companies Stats */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 font-bold">
                            Registered Companies
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                                        Company Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                                        Users Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {companies.map((company) => (
                                    <tr key={company.id}>
                                        <td className="px-6 py-4">
                                            {company.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {company.users_count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
