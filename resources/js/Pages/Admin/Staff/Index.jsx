import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Index({ auth, staff }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("staff.store"), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">
                    Manage Staff
                </h2>
            }
        >
            <Head title="Staff Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Add Staff Form */}
                    <div className="p-6 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium mb-4">
                            Add New Staff Member
                        </h3>
                        <form
                            onSubmit={submit}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            <div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full rounded-md border-gray-300"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full rounded-md border-gray-300"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full rounded-md border-gray-300"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                {errors.password && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {errors.password}
                                    </div>
                                )}
                            </div>
                            <button
                                disabled={processing}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Add Staff
                            </button>
                        </form>
                    </div>

                    {/* Staff List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {staff.map((s) => (
                                    <tr key={s.id}>
                                        <td className="px-6 py-4">{s.name}</td>
                                        <td className="px-6 py-4">{s.email}</td>
                                        <td
                                            className="px-6 py-4 text-right text-red-600 cursor-pointer"
                                            onClick={() => {
                                                if (confirm("Delete staff?"))
                                                    router.delete(
                                                        route(
                                                            "staff.destroy",
                                                            s.id,
                                                        ),
                                                    );
                                            }}
                                        >
                                            Delete
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
