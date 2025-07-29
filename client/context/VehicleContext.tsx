import React, { createContext, useContext, useState, ReactNode } from "react";
import { Vehicle, VehicleFilters, mockVehicles } from "@shared/vehicles";

interface VehicleContextType {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  filters: VehicleFilters;
  setFilters: React.Dispatch<React.SetStateAction<VehicleFilters>>;
  filteredVehicles: Vehicle[];
  updateVehicleVisibility: (vehicleId: string, isVisible: boolean) => void;
  updateVehicleFeatured: (vehicleId: string, isFeatured: boolean) => void;
  toggleAllVehiclesVisibility: (isVisible: boolean) => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicles must be used within a VehicleProvider");
  }
  return context;
};

interface VehicleProviderProps {
  children: ReactNode;
}

export const VehicleProvider: React.FC<VehicleProviderProps> = ({
  children,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [filters, setFilters] = useState<VehicleFilters>({});

  // Filter vehicles based on current filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (
      filters.make &&
      vehicle.make.toLowerCase() !== filters.make.toLowerCase()
    ) {
      return false;
    }
    if (
      filters.model &&
      vehicle.model.toLowerCase() !== filters.model.toLowerCase()
    ) {
      return false;
    }
    if (filters.year && vehicle.year !== filters.year) {
      return false;
    }
    if (filters.condition && vehicle.condition !== filters.condition) {
      return false;
    }
    if (filters.vehicleType && vehicle.vehicleType !== filters.vehicleType) {
      return false;
    }
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const matchesMake = vehicle.make.toLowerCase().includes(searchLower);
      const matchesModel = vehicle.model.toLowerCase().includes(searchLower);
      const matchesDescription = vehicle.description.toLowerCase().includes(searchLower);
      const matchesFeatures = vehicle.features.some(feature =>
        feature.toLowerCase().includes(searchLower)
      );

      if (!matchesMake && !matchesModel && !matchesDescription && !matchesFeatures) {
        return false;
      }
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (vehicle.price < min || vehicle.price > max) {
        return false;
      }
    }
    return true;
  });

  const updateVehicleVisibility = (vehicleId: string, isVisible: boolean) => {
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, isVisible } : vehicle,
      ),
    );
  };

  const updateVehicleFeatured = (vehicleId: string, isFeatured: boolean) => {
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, isFeatured } : vehicle,
      ),
    );
  };

  const toggleAllVehiclesVisibility = (isVisible: boolean) => {
    setVehicles((prev) =>
      prev.map((vehicle) => ({
        ...vehicle,
        isVisible,
      })),
    );
  };

  const addVehicle = (vehicleData: Omit<Vehicle, "id">) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now().toString(), // Simple ID generation
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const value: VehicleContextType = {
    vehicles,
    setVehicles,
    filters,
    setFilters,
    filteredVehicles,
    updateVehicleVisibility,
    updateVehicleFeatured,
    toggleAllVehiclesVisibility,
    addVehicle,
  };

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
};
