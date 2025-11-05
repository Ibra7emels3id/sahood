import React from 'react';

const Loading = () => {
    return (
        <div className="bg-white/5 fixed inset-0  backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg">
            <div className='fixed inset-0 flex items-center justify-center bg-[#00000038] bg-opacity-50'>
                <div class="flex flex-row gap-2">
                    <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                    <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
                    <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                </div>
            </div>
        </div>
    );
}

export default Loading;
