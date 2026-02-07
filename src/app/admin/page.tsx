import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/admin/completion"
                        className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-xl font-semibold text-blue-600 mb-2">Completion Type Editor</h2>
                        <p className="text-gray-600">
                            Create and manage sentence completion exercises with JSON export.
                        </p>
                    </Link>

                    {/* Add more admin tools here in the future */}
                </div>
            </div>
        </div>
    );
}
