export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: "Gasolina" | "Diesel" | "Híbrido" | "Eléctrico";
  transmission: "Automatico" | "Mecanico";
  description: string;
  image: string;
  features: string[];
  isVisible: boolean;
  condition: "Nuevo" | "Usado";
  priceType: "Contado" | "Financiado";
  vehicleType: "SUV" | "Sedan" | "Pickup";
  // Admin fields - only visible to Angelo
  adminData?: {
    fechaLlegadaHonduras?: string;
    fechaSalidaEEUU?: string;
    estadoCompraEEUU?: string;
    paginaWebCompra?: 'Copart' | 'IAAI' | 'Otro';
    nombreEnPapeles?: string;
    costoChocado?: number;
    costoReparado?: number | null; // null means N/A
    costoVentaChocado?: number;
    costoVentaReparado?: number;
  };
}

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 150000,
    mileage: 20,
    fuelType: "Gasolina",
    transmission: "Automatico",
    description: "Asientos de cuero motor v4 bla bla bla",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/3c48217fddaea0f514d06c9dca835959865ee3bc?width=1020",
    features: ["Asientos de cuero", "Motor V4", "Aire acondicionado"],
    isVisible: true,
    condition: "Usado",
    priceType: "Contado",
    vehicleType: "Sedan",
  },
  {
    id: "2",
    make: "Toyota",
    model: "Camry",
    year: 2021,
    price: 150000,
    mileage: 20,
    fuelType: "Diesel",
    transmission: "Automatico",
    description: "Asientos de cuero motor v4 bla bla bla",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/47ee2adefddafdefb09a2c5fbaf8196601fb6ccc?width=930",
    features: ["Asientos de cuero", "Motor V4", "Sistema de navegación"],
    isVisible: true,
    condition: "Usado",
    priceType: "Financiado",
    vehicleType: "Sedan",
  },
  {
    id: "3",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    price: 150000,
    mileage: 20,
    fuelType: "Diesel",
    transmission: "Mecanico",
    description: "Asientos de cuero motor v4 bla bla bla",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/430d90fb38e1cc61e90e68c5d685e31e7810d3e4?width=930",
    features: ["Asientos de cuero", "Motor V4", "Cámara trasera"],
    isVisible: true,
    condition: "Usado",
    priceType: "Contado",
    vehicleType: "Sedan",
  },
  {
    id: "4",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: 150000,
    mileage: 20,
    fuelType: "Gasolina",
    transmission: "Automatico",
    description: "Asientos de cuero motor v4 bla bla bla",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/e28089653b6c317d0fa42e451acf57fa40a3eb08?width=1152",
    features: ["Asientos de cuero", "Motor V4", "Control crucero"],
    isVisible: true,
    condition: "Usado",
    priceType: "Financiado",
    vehicleType: "Pickup",
  },
  {
    id: "5",
    make: "Mercedes Benz",
    model: "G-Class",
    year: 2022,
    price: 150000,
    mileage: 20,
    fuelType: "Diesel",
    transmission: "Automatico",
    description: "Asientos de cuero motor v4 bla bla bla",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/c6ca3ad24cbb8bb212b8287f65089f890cf176d4?width=930",
    features: ["Asientos de cuero", "Motor V8", "4x4"],
    isVisible: true,
    condition: "Usado",
    priceType: "Contado",
    vehicleType: "SUV",
  },
  {
    id: "6",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    price: 150000,
    mileage: 20,
    fuelType: "Diesel",
    transmission: "Mecanico",
    description: "Asientos de cuero motor v4 bla bla bla",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/b03aff7e81ebcf4f92c7eee3d4d5b7094f23396e?width=930",
    features: ["Asientos de cuero", "Motor V4", "Sunroof"],
    isVisible: true,
    condition: "Usado",
    priceType: "Financiado",
    vehicleType: "SUV",
  },
  {
    id: "7",
    make: "Toyota",
    model: "Camry",
    year: 2021,
    price: 150000,
    mileage: 20,
    fuelType: "Gasolina",
    transmission: "Automatico",
    description: "Asientos de cuero motor v4 bla bla bla",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/ef4078ff7e23a323b32723a89fe14b51b3acca7d?width=1020",
    features: ["Asientos de cuero", "Motor V4", "Sistema Bluetooth"],
    isVisible: true,
    condition: "Usado",
    priceType: "Contado",
    vehicleType: "Pickup",
  },
  {
    id: "8",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 150000,
    mileage: 20,
    fuelType: "Diesel",
    transmission: "Automatico",
    description: "Asientos de cuero motor v4 bla bla bla",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/5bcf0e3c94b2f3b89c1bdfa3f86d1d9f83b227ca?width=1152",
    features: ["Asientos de cuero", "Motor V4", "Sensores de parking"],
    isVisible: true,
    condition: "Usado",
    priceType: "Financiado",
    vehicleType: "SUV",
  },
];

export interface VehicleFilters {
  make?: string;
  model?: string;
  year?: number;
  priceRange?: [number, number];
  condition?: string;
  vehicleType?: "SUV" | "Sedan" | "Pickup";
  searchText?: string;
}
