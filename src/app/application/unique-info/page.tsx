"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../tailwind.css";

export default function UniqueInfoPage() {
  const router = useRouter();
  const [submit, setSubmit] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);

    // mock, replace api later
    setTimeout(() => {
      router.push("/vendor-dashboard");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-white">
      <div className="w-full max-w-md" style={{ width: "40%" }}>
        <h1 className="text-3xl font-bold text-center mb-4 text-black">
          Unique Info Required
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          This popup requires additional information before we can process your
          application.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="mb-6">
            <label
              className="block text-xl mb-3 text-center text-black font-semibold"
              htmlFor="specialRequirements"
            >
              Special Requirements
            </label>
            <textarea
              id="specialRequirements"
              name="specialRequirements"
              rows={6}
              placeholder="Describe any special requirements for your popup..."
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-xl mb-3 text-center text-black font-semibold"
              htmlFor="healthPermit"
            >
              Food Permit Number
            </label>
            <input
              type="text"
              id="healthPermit"
              name="healthPermit"
              placeholder="Enter your permit number"
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-xl mb-3 text-center text-black font-semibold"
              htmlFor="healthPermit"
            >
              Have you attended this event before? *Required
            </label>
            <input
              type="text"
              id="healthPermit"
              name="healthPermit"
              placeholder="Enter your permit number"
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white"
            />
          </div>

          <div
            className="flex flex-col items-center mt-8"
            style={{ width: "50%", margin: "0 auto" }}
          >
            <button
              type="submit"
              disabled={submit}
              className="py-4 bg-[#f15152] text-white text-xl font-semibold rounded-lg hover:bg-red-600 transition"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              Submit Application
            </button>

            <Link href="/application" className="w-full">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-4 border-2 border-gray-300 text-black text-xl font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Skip for now
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
