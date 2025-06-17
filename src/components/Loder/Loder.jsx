import React from 'react';

export const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="flex space-x-2">
        <div className="w-2 h-8 bg-purple-400  dark:bg-purple-400 animate-bounce delay-100"></div>
        <div className="w-2 h-8 bg-blue-500 dark:bg-blue-400 animate-bounce delay-200"></div>
        <div className="w-2 h-8 bg-purple-400  dark:bg-purple-400 animate-bounce delay-300"></div>
        <div className="w-2 h-8 bg-blue-500 dark:bg-blue-400 animate-bounce delay-200"></div>

      </div>
    </div>
  );
};

export default Loader;
