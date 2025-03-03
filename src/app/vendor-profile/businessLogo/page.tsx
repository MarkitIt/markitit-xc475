"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useBusinessLogoContext } from '../../../context/BusinessLogoContext';
import '../../tailwind.css';

const UploadImagesPage = () => {
    const router = useRouter();
    const { images, setImages } = useBusinessLogoContext();

    const handleNextStepClick = () => {
        router.push('/vendor-profile/businessPastPopup');

    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          setImages([...images, ...Array.from(event.target.files)]);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <main className="p-16 flex space-x-16">
                {/* Large Placeholder Image */}
                <div className="w-[50%] h-[450px] bg-gray-300"></div>

                {/* Upload Section */}
                <div className="w-[50%]">
                    <h2 className="text-md text-gray-500">Step 03/05</h2>
                    <h1 className="text-5xl font-bold mb-8">Upload images of your product:</h1>
                            
                    {/* First Upload Box */}
                    <div className="mb-6">
                        <p className="text-gray-600 text-sm mb-2">
                        Luptas della con pel et aut audae porest faccus cim int, quis cum res et evendae explab ipsam utempore cumet.
                        </p>
                        <label className="flex items-center gap-2 border-2 border-black px-4 py-2 rounded-md cursor-pointer w-48">
                        <span className="text-xl">&#10515;</span>
                        Upload Image
                        <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                    
                    {/* Second Upload Box */}
                    <div className="mb-6">
                        <p className="text-gray-600 text-sm mb-2">
                        Luptas della con pel et aut audae porest faccus cim int, quis cum res et evendae explab ipsam utempore cumet.
                        </p>
                        <label className="flex items-center gap-2 border-2 border-black px-4 py-2 rounded-md cursor-pointer w-48">
                        <span className="text-xl">&#10515;</span>
                        Upload Image
                        <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>

                    {/* Display uploaded images */}
                    <div className="grid grid-cols-3 gap-4">
                        {images.map((image, index) => (
                        <div key={index} className="w-full h-32 bg-gray-200 flex items-center justify-center">
                            <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} className="max-h-full max-w-full" />
                        </div>
                        ))}
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

export default UploadImagesPage;