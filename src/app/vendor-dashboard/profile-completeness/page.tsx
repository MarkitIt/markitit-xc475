import React from "react";

const ProfileCompleteness = () => {
  const completionPercentage = 75; // Example progress

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Profile Completeness</h3>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-700 mt-2">{completionPercentage}% Complete</p>
    </div>
  );
};

export default ProfileCompleteness;
