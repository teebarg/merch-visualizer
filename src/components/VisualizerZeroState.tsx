import React from "react";

const VisualizerZeroState = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex-1">
            <div className="text-center max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
                <div className="flex justify-center mb-6">
                    {/* <ChartBar className="text-indigo-600 opacity-80" size={64} strokeWidth={1.5} /> */}
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Visualization Awaits</h2>

                <p className="text-gray-600 mb-6">Start your data journey by uploading your first dataset or creating a new visualization.</p>

                <div className="space-y-4">
                    <button className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors group">
                        {/* <CloudUpload className="mr-3 group-hover:animate-bounce" size={24} /> */}
                        Upload Dataset
                    </button>

                    <button className="w-full flex items-center justify-center border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition-colors group">
                        {/* <PlusCircle className="mr-3 group-hover:rotate-180 transition-transform" size={24} /> */}
                        Create New Visualization
                    </button>
                </div>

                <div className="mt-6 text-sm text-gray-500">Tip: Drag and drop files or connect to data sources</div>
            </div>
        </div>
    );
};

export {VisualizerZeroState} ;
