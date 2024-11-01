const Loading = () => {
    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <div className="text-center space-y-6 p-8 bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Main Message */}
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Processing your data...</h2>

                {/* Subtle Sub-Message */}
                <p className="text-gray-500 text-lg animate-pulse">This might take a moment</p>

                {/* Progress Indicators */}
                <div className="flex justify-center space-x-2 mt-6">
                    {[1, 2, 3, 4].map((dot) => (
                        <div
                            key={dot}
                            className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce"
                            style={{
                                animationDelay: `${dot * 0.1}s`,
                                animationDuration: "0.6s",
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Background Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <div className="absolute -top-10 -right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>
        </div>
    );
};

export default Loading;
