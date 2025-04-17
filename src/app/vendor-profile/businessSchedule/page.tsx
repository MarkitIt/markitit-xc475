"use client";

import { useRouter } from 'next/navigation';
import { useBusinessScheduleContext } from '../../../context/BusinessScheduleContext';
import '../../tailwind.css';

const BusinessSchedule = () => {
  const router = useRouter();
  const { 
    preferredDays, 
    setPreferredDays, 
    eveningMarketPreference, 
    setEveningMarketPreference 
  } = useBusinessScheduleContext();

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
    'Weekdays Only',
    'Weekends Only'
  ];

  const handleDaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setPreferredDays(selected);
  };

  const handleNextStepClick = () => {
    router.push('/create-profile/vendor/businessLogo');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Schedule section */}
        <div className="w-[50%]">
          <h2 className="text-md text-gray-500">Step 04/05</h2>
          <h1 className="text-5xl font-bold mb-8">Tell us about your schedule</h1>

          {/* Preferred Days */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Which days of the week do you prefer to vend?</h2>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded"
              value={preferredDays}
              onChange={handleDaysChange}
              size={5}
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          {/* Evening/Night Market Preference */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Do you prefer evening/night markets?</h2>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="eveningMarket"
                  value="Yes"
                  checked={eveningMarketPreference === 'Yes'}
                  onChange={(e) => setEveningMarketPreference(e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="eveningMarket"
                  value="No"
                  checked={eveningMarketPreference === 'No'}
                  onChange={(e) => setEveningMarketPreference(e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex space-x-6 mt-8">
            <div className="w-36 h-14 bg-gray-300 flex items-center justify-center">Help</div>
            <div
              className="w-48 h-14 bg-gray-300 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer flex items-center justify-center"
              onClick={handleNextStepClick}
            >
              Next Step
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessSchedule;
