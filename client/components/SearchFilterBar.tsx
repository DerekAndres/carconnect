import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const SearchFilterBar: React.FC = () => {
  const { vehicles, filters, setFilters } = useVehicles();
  const [searchText, setSearchText] = useState(filters.searchText || '');
  const [selectedMake, setSelectedMake] = useState(filters.make || '');
  const [selectedModel, setSelectedModel] = useState(filters.model || '');
  const [selectedYear, setSelectedYear] = useState(filters.year?.toString() || '');
  const [selectedCondition, setSelectedCondition] = useState(filters.condition || '');

  // Get unique makes from vehicles
  const availableMakes = Array.from(new Set(vehicles.map(v => v.make))).sort();
  
  // Get models based on selected make
  const availableModels = selectedMake 
    ? Array.from(new Set(vehicles.filter(v => v.make === selectedMake).map(v => v.model))).sort()
    : [];

  // Get available years
  const availableYears = Array.from(new Set(vehicles.map(v => v.year))).sort((a, b) => b - a);

  const handleSearch = () => {
    setFilters({
      ...filters,
      searchText: searchText.trim() || undefined,
      make: selectedMake || undefined,
      model: selectedModel || undefined,
      year: selectedYear ? parseInt(selectedYear) : undefined,
      condition: selectedCondition || undefined
    });
  };

  const handleClear = () => {
    setSearchText('');
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedCondition('');
    setFilters({
      vehicleType: filters.vehicleType // Keep vehicle type filter if it exists
    });
  };

  // Clear model when make changes
  useEffect(() => {
    if (selectedMake && !availableModels.includes(selectedModel)) {
      setSelectedModel('');
    }
  }, [selectedMake, selectedModel, availableModels]);

  // Auto-search as user types (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== (filters.searchText || '')) {
        setFilters({
          vehicleType: filters.vehicleType, // Keep vehicle type filter
          searchText: searchText.trim() || undefined
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white p-6">
      {/* Search Text Input */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 bg-white/20 rounded-full px-4 py-3">
          <Search className="w-5 h-5 text-white" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar Toyota, Honda, Camry, V6..."
            className="bg-transparent text-white placeholder-white/70 outline-none flex-1"
          />
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:grid grid-cols-5 gap-4">
        {/* Make Filter */}
        <div className="relative">
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full bg-white/20 text-white rounded-full px-4 py-3 outline-none appearance-none cursor-pointer"
          >
            <option value="" className="text-gray-800">Todas las Marcas</option>
            {availableMakes.map((make) => (
              <option key={make} value={make} className="text-gray-800">
                {make}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        </div>

        {/* Model Filter */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake}
            className="w-full bg-white/20 text-white rounded-full px-4 py-3 outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" className="text-gray-800">
              {selectedMake ? 'Todos los Modelos' : 'Selecciona Marca'}
            </option>
            {availableModels.map((model) => (
              <option key={model} value={model} className="text-gray-800">
                {model}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        </div>

        {/* Year Filter */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-white/20 text-white rounded-full px-4 py-3 outline-none appearance-none cursor-pointer"
          >
            <option value="" className="text-gray-800">Todos los Años</option>
            {availableYears.map((year) => (
              <option key={year} value={year} className="text-gray-800">
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        </div>

        {/* Condition Filter */}
        <div className="relative">
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="w-full bg-white/20 text-white rounded-full px-4 py-3 outline-none appearance-none cursor-pointer"
          >
            <option value="" className="text-gray-800">Todas las Condiciones</option>
            <option value="Nuevo" className="text-gray-800">Nuevo</option>
            <option value="Usado" className="text-gray-800">Usado</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        </div>

        {/* Search/Clear Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleSearch}
            className="flex-1 bg-blue-600 text-white rounded-full px-4 py-3 hover:bg-blue-700 transition-colors font-medium"
          >
            Buscar
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-white/20 text-white rounded-full px-4 py-3 hover:bg-white/30 transition-colors font-medium"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Make Filter */}
          <div className="relative">
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full bg-white/20 text-white rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer text-sm"
            >
              <option value="" className="text-gray-800">Marca</option>
              {availableMakes.map((make) => (
                <option key={make} value={make} className="text-gray-800">
                  {make}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>

          {/* Model Filter */}
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
              className="w-full bg-white/20 text-white rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer disabled:opacity-50 text-sm"
            >
              <option value="" className="text-gray-800">
                {selectedMake ? 'Modelo' : 'Marca'}
              </option>
              {availableModels.map((model) => (
                <option key={model} value={model} className="text-gray-800">
                  {model}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Year Filter */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white/20 text-white rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer text-sm"
            >
              <option value="" className="text-gray-800">Año</option>
              {availableYears.map((year) => (
                <option key={year} value={year} className="text-gray-800">
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>

          {/* Condition Filter */}
          <div className="relative">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-white/20 text-white rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer text-sm"
            >
              <option value="" className="text-gray-800">Condición</option>
              <option value="Nuevo" className="text-gray-800">Nuevo</option>
              <option value="Usado" className="text-gray-800">Usado</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSearch}
            className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors font-medium"
          >
            Buscar
          </button>
          <button
            onClick={handleClear}
            className="flex-1 bg-white/20 text-white rounded-lg px-4 py-2 hover:bg-white/30 transition-colors font-medium"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
