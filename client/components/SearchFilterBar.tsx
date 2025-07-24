import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';

interface SearchFilterBarProps {
  className?: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ className = '' }) => {
  const { filters, setFilters } = useVehicles();
  const [localFilters, setLocalFilters] = useState({
    marca: '',
    modelo: '',
    año: '',
    precio: '',
    estado: ''
  });

  const handleSearch = () => {
    // Convert local filters to actual filters
    const newFilters = {
      make: localFilters.marca || undefined,
      model: localFilters.modelo || undefined,
      year: localFilters.año ? parseInt(localFilters.año) : undefined,
      condition: localFilters.estado || undefined,
      priceRange: localFilters.precio ? [0, parseInt(localFilters.precio)] as [number, number] : undefined
    };
    setFilters(newFilters);
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-full border-2 border-white p-2 flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-8 px-6">
        <div className="flex items-center space-x-2">
          <span className="text-white text-lg">Marca</span>
          <ChevronDown className="text-black w-5 h-5" />
        </div>
        <div className="w-px h-12 bg-white"></div>
        <div className="flex items-center space-x-2">
          <span className="text-white text-lg">Modelo</span>
          <ChevronDown className="text-black w-5 h-5" />
        </div>
        <div className="w-px h-12 bg-white"></div>
        <div className="flex items-center space-x-2">
          <span className="text-white text-lg">Año</span>
          <ChevronDown className="text-black w-5 h-5" />
        </div>
        <div className="w-px h-12 bg-white"></div>
        <div className="flex items-center space-x-2">
          <span className="text-white text-lg">Precio</span>
          <ChevronDown className="text-black w-5 h-5" />
        </div>
        <div className="w-px h-12 bg-white"></div>
        <div className="flex items-center space-x-2">
          <span className="text-white text-lg">Estado</span>
          <ChevronDown className="text-black w-5 h-5" />
        </div>
      </div>
      <button 
        onClick={handleSearch}
        className="flex items-center space-x-2 bg-white/20 rounded-full px-6 py-3 hover:bg-white/30 transition-colors"
      >
        <Search className="w-6 h-6 text-black" />
        <span className="text-black text-lg">buscar</span>
      </button>
    </div>
  );
};

export default SearchFilterBar;
