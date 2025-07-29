import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const HomeSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, setFilters } = useVehicles();
  
  const [searchText, setSearchText] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  // Get unique makes from vehicles
  const availableMakes = Array.from(new Set(vehicles.map(v => v.make))).sort();
  
  // Get models based on selected make
  const availableModels = selectedMake 
    ? Array.from(new Set(vehicles.filter(v => v.make === selectedMake).map(v => v.model))).sort()
    : [];

  // Get available years
  const availableYears = Array.from(new Set(vehicles.map(v => v.year))).sort((a, b) => b - a);

  const handleSearch = () => {
    // Set filters and navigate to catalog
    setFilters({
      searchText: searchText.trim() || undefined,
      make: selectedMake || undefined,
      model: selectedModel || undefined,
      year: selectedYear ? parseInt(selectedYear) : undefined,
      condition: selectedCondition || undefined
    });
    navigate('/catalog');
  };

  const handleQuickSearch = () => {
    if (searchText.trim()) {
      setFilters({
        searchText: searchText.trim()
      });
      navigate('/catalog');
    }
  };

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white p-2">
        <div className="flex items-center justify-between flex-1">
          {/* Make */}
          <div className="relative px-4">
            <select
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setSelectedModel(''); // Reset model when make changes
              }}
              className="bg-transparent text-white outline-none appearance-none cursor-pointer pr-6"
            >
              <option value="" className="text-gray-800">Marca</option>
              {availableMakes.map((make) => (
                <option key={make} value={make} className="text-gray-800">
                  {make}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
          </div>
          
          <div className="w-px h-12 bg-white"></div>
          
          {/* Model */}
          <div className="relative px-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
              className="bg-transparent text-white outline-none appearance-none cursor-pointer pr-6 disabled:opacity-50"
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
            <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
          </div>
          
          <div className="w-px h-12 bg-white"></div>
          
          {/* Year */}
          <div className="relative px-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white outline-none appearance-none cursor-pointer pr-6"
            >
              <option value="" className="text-gray-800">Año</option>
              {availableYears.map((year) => (
                <option key={year} value={year} className="text-gray-800">
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
          </div>
          
          <div className="w-px h-12 bg-white"></div>
          
          {/* Condition */}
          <div className="relative px-4">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-transparent text-white outline-none appearance-none cursor-pointer pr-6"
            >
              <option value="" className="text-gray-800">Estado</option>
              <option value="Nuevo" className="text-gray-800">Nuevo</option>
              <option value="Usado" className="text-gray-800">Usado</option>
            </select>
            <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          className="flex items-center space-x-2 bg-white/20 rounded-full px-6 py-3 hover:bg-white/30 transition-colors ml-4"
        >
          <Search className="w-6 h-6 text-white" />
          <span className="text-white text-lg font-medium">Buscar</span>
        </button>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white p-4 space-y-4">
        {/* Quick search input */}
        <div className="flex items-center space-x-3 bg-white/20 rounded-full px-4 py-3">
          <Search className="w-5 h-5 text-white" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar Toyota, Honda, etc..."
            className="bg-transparent text-white placeholder-white/70 outline-none flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
          />
          <button
            onClick={handleQuickSearch}
            className="text-white hover:text-blue-200 transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <select
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setSelectedModel('');
              }}
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

          <div className="relative">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-white/20 text-white rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer text-sm"
            >
              <option value="" className="text-gray-800">Estado</option>
              <option value="Nuevo" className="text-gray-800">Nuevo</option>
              <option value="Usado" className="text-gray-800">Usado</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Buscar en Catálogo
        </button>
      </div>

      {/* Desktop Quick Search Bar */}
      <div className="hidden lg:block mt-4">
        <div className="flex items-center space-x-3 bg-white/20 rounded-full px-4 py-3 max-w-md mx-auto">
          <Search className="w-5 h-5 text-white" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Búsqueda rápida: Toyota, Honda, Sedan..."
            className="bg-transparent text-white placeholder-white/70 outline-none flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
          />
          <button
            onClick={handleQuickSearch}
            className="text-white hover:text-blue-200 transition-colors font-medium"
          >
            Buscar
          </button>
        </div>
      </div>
    </>
  );
};

export default HomeSearchBar;
