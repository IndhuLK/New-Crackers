import React from "react";

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin reverse-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="mt-4 text-slate-400 animate-pulse font-medium tracking-wider">LOADING...</p>
        </div>
    );
};

export default Loading;
