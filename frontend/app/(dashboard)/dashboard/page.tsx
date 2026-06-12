'use client'
import { useLocationContext } from "@/context/selectedLocation.context";
import LocationCard from "@/components/dashboard/location/location-card";




const Page = () => {
  const { selectedLocation } = useLocationContext();

  if (!selectedLocation) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:border-black hover:shadow-md cursor-pointer">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          📍
        </div>

        <h3 className="text-lg font-semibold text-gray-900">
          Add Location
        </h3>

        <p className="mt-2 max-w-xs text-sm text-gray-500">
          Add your business location to help customers find you easily.
        </p>

        <button className="mt-5 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800">
          Add Location
        </button>
        
      </div>
    );
  }
  return (
    <>
      <LocationCard selectedLocation={selectedLocation} />
    </>


  );
};

export default Page;