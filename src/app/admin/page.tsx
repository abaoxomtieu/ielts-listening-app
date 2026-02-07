import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/admin/completion"
                        className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <h2 className="text-xl font-semibold text-blue-600 mb-2">Completion Type Editor</h2>
                        <p className="text-gray-600">
                            Quickly create standalone completion exercises.
                        </p>
                    </Link>

                    <Link
                        href="/admin/matching"
                        className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <h2 className="text-xl font-semibold text-green-600 mb-2">Matching Type Editor</h2>
                        <p className="text-gray-600">
                            Quickly create standalone matching exercises.
                        </p>
                    </Link>

                    <Link
                        href="/admin/test-builder"
                        className="block p-6 bg-white rounded-lg border-2 border-blue-100 shadow-sm hover:shadow-md hover:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <span>Full Test Builder</span>
                            <span className="bg-blue-600 text-white text-[10px] uppercase px-1.5 py-0.5 rounded">New</span>
                        </h2>
                        <p className="text-gray-600">
                            Build complete IELTS tests with multiple sections and question types.
                        </p>
                    </Link>

                    {/* Add more admin tools here in the future */}
                </div>
            </div>
        </div>
    );
}
