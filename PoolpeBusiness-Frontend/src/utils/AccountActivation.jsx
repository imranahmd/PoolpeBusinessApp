import React from "react";

const AccountActivation = () => {
  return (
    <div className="flex items-center space-x-2">
      {/* Icon Section */}
      <div className="relative">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
          {/* User Icon */}
          <span className="material-icons">person</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          {/* Check Icon */}
          <span className="material-icons text-white text-xs">check</span>
        </div>
      </div>

      {/* Text Section */}
      <span className="text-purple-700 font-bold text-lg">Need Support ?</span>
    </div>
  );
};

export default AccountActivation;
