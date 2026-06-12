'use client';

import { LocationType } from "@/types/dashboard/Location.types";
import { createContext, useContext,useState } from "react";

type LocationContextType = {
  selectedLocation: LocationType | null;
  setSelectedLocation: (loc: LocationType | null) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  

  return (
    <LocationContext.Provider
      value={{ selectedLocation, setSelectedLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error("useLocationContext must be used inside LocationProvider");
  }

  return context;
};