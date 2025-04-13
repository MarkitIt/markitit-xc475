"use client";

import { useRouter } from 'next/navigation';
import { useBusinessBudgetContext } from '../../../context/BusinessBudgetContext';
import '../../tailwind.css';


const BusinessBudget = () => {
  const router = useRouter();
  const { maxApplicationFee, setMaxApplicationFee, maxVendorFee, setVendorFee, totalCostEstimate, setTotalCostEstimate } = useBusinessBudgetContext();



  const handleNextStepClick = () => {
    router.push('/create-profile/vendor/businessCustomer');

  };


  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Adjective section */}
        <div className="w-[50%]">
          <h2 className="text-md text-gray-500">Step 02/05</h2>
          <h1 className="text-5xl font-bold mb-8">Tell us about your budget</h1>

          {/* Maximum Application Fee */}
          <div className="mb-8">
            <label className="block text-lg font-semibold">What is the maximum application fee you would pay for a pop up?</label>
            <input
              type="number"
              className="mt-2 p-2 border border-gray-300 rounded"
              onChange={(e) => setMaxApplicationFee(Number(e.target.value))}
              required
            />
          </div>

          {/* Maximum Vendor Fee */}
          <div className="mb-8">
            <label className="block text-lg font-semibold">What is the maximum vendor fee you would pay for a pop up?</label>
            <input
              type="number"
              className="mt-2 p-2 border border-gray-300 rounded"
              onChange={(e) => setVendorFee(Number(e.target.value))}
              required
            />
          </div>

          {/* Total Cost Estimate */}
          <div className="mb-8">
            <label className="block text-lg font-semibold">What is the total cost estimate you are comfortable with to attend a pop up?</label>
            <input
              type="number"
              className="mt-2 p-2 border border-gray-300 rounded"
              onChange={(e) => setTotalCostEstimate(Number(e.target.value))}
              required
            />
          </div>

          {/* Next step click */}
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

export default BusinessBudget;