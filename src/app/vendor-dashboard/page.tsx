import React from "react";
import UpcomingEvents from "./events/page";
import CalendarView from "./calendar/page";
import ProfileCompleteness from "./profile-completeness/page";
import ActionItems from "./action-items/page";
import FinancialCalculator from "@/components/FinancialCalculator";

const VendorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-black p-8">
      <h2 className="text-2xl font-semibold mb-4">Vendor Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <UpcomingEvents />
          <CalendarView />
        </div>

        {/* Middle Column */}
        <div className="space-y-4">
          <ProfileCompleteness />
          <ActionItems />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <FinancialCalculator />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;