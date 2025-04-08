"use client";
import { useState } from "react";

const FinancialCalculator = () => {
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const profit = revenue - expenses;

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Financial Calculator</h3>
      <div className="space-y-2">
        <label className="block text-sm">Revenue</label>
        <input
          type="number"
          value={revenue}
          onChange={(e) => setRevenue(Number(e.target.value))}
          className="border rounded w-full p-1"
        />
      </div>

      <div className="space-y-2 mt-2">
        <label className="block text-sm">Expenses</label>
        <input
          type="number"
          value={expenses}
          onChange={(e) => setExpenses(Number(e.target.value))}
          className="border rounded w-full p-1"
        />
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium">Profit: ${profit}</h4>
      </div>
    </div>
  );
};

export default FinancialCalculator;
