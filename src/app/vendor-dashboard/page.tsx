import React from 'react';
import Link from 'next/link';

const VendorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <main className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome to your dashboard</h2>
        <p className="mb-4">Here you can manage your vendor profile, view applications, and more.</p>
        <nav className="space-y-2">
        </nav>
      </main>
    </div>
  );
};

export default VendorDashboard;