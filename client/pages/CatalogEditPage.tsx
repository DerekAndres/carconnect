import { Link } from 'react-router-dom';
import { Search, ChevronDown, User, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import SearchFilterBar from '../components/SearchFilterBar';

const CatalogEditPage = () => {
  const { vehicles, updateVehicleVisibility, toggleAllVehiclesVisibility } = useVehicles();
  const [selectAll, setSelectAll] = useState(false);

  const toggleVehicleVisibility = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      updateVehicleVisibility(vehicleId, !vehicle.isVisible);
    }
  };

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    toggleAllVehiclesVisibility(newValue);
  };

  const visibleCount = vehicles.filter(v => v.isVisible).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://api.builder.io/api/v1/image/assets/TEMP/afc4b3d892254d6310229ea10631232715ca2db6?width=3881')`
        }}
      >
        {/* Navigation */}
        <nav className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-6 text-white">
          <div className="flex items-center space-x-8">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/9cc206b396ef0a55afa09e2025176c2de7e8058b?width=523" alt="Car Connect" className="h-16" />
          </div>
          
          <div className="hidden lg:flex items-center space-x-8 text-lg">
            <Link to="/" className="hover:text-blue-400 transition-colors">Inicio</Link>
            <Link to="/catalog" className="hover:text-blue-400 transition-colors">Catalogo</Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">Avaluo de tu Auto</Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">Agendar Cita</Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">Sobre nosotros</Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">Financiamiento</Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">Contactanos</Link>
          </div>

          <div className="flex items-center space-x-4">
            <User className="w-5 h-5" />
            <span className="text-lg">Hola, Angelo</span>
            <div className="text-3xl font-medium">car connect</div>
          </div>
        </nav>

        {/* Search Bar */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-full border-2 border-white p-2 flex items-center justify-between">
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
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-6 py-3">
              <Search className="w-6 h-6 text-black" />
              <span className="text-black text-lg">buscar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Controls */}
      <section className="py-8 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleSelectAll}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <div className={`w-5 h-5 border-2 rounded ${selectAll ? 'bg-blue-600 border-blue-600' : 'border-gray-300'} flex items-center justify-center`}>
                  {selectAll && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Seleccionar todo</span>
              </button>
              <span className="text-gray-600">
                {visibleCount} de {vehicles.length} vehículos visibles
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/catalog" 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Ver Catálogo
              </Link>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                REPORTERIA
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow relative">
                {/* Checkbox for visibility */}
                <div className="absolute top-4 left-4 z-20">
                  <button
                    onClick={() => toggleVehicleVisibility(vehicle.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${vehicle.isVisible ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'} transition-colors`}
                  >
                    {vehicle.isVisible ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-xs">✗</span>
                    )}
                  </button>
                </div>
                
                <div className="relative">
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    className={`w-full h-48 object-cover transition-opacity ${!vehicle.isVisible ? 'opacity-50' : ''}`}
                  />
                  <div className="absolute top-2 left-12 bg-white/80 backdrop-blur-sm rounded p-2">
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded p-2">
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                
                <div className={`p-6 transition-opacity ${!vehicle.isVisible ? 'opacity-50' : ''}`}>
                  <h3 className="text-xl font-bold mb-2">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-gray-600 text-sm mb-4">{vehicle.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{vehicle.mileage} millas</span>
                    <span>{vehicle.fuelType}</span>
                    <span>{vehicle.transmission}</span>
                  </div>
                  
                  <hr className="mb-4" />
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">C</span>
                      <span className="text-lg font-bold text-red-600">L. {vehicle.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">PV</span>
                      <span className="text-lg font-bold text-green-600">L. 150,000</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
                      <Edit2 className="w-4 h-4" />
                      <span>editar</span>
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      view details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="text-center mt-12">
            <button className="text-gray-600 hover:text-gray-800 font-medium text-lg px-8 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              cargar mas
            </button>
          </div>
        </div>
      </section>

      {/* Back to top button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <nav className="flex flex-wrap justify-center space-x-8 text-lg mb-8">
              <Link to="#" className="hover:text-blue-400 transition-colors">Sobre Nosotros</Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">Financiamiento</Link>
              <Link to="/catalog" className="hover:text-blue-400 transition-colors">Catalogo</Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">Contactanos</Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">Avalua Tu Auto</Link>
            </nav>
          </div>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-2xl hover:text-blue-400 transition-colors">📘</a>
            <a href="#" className="text-2xl hover:text-blue-400 transition-colors">📱</a>
            <a href="#" className="text-2xl hover:text-blue-400 transition-colors">🐦</a>
          </div>
          
          <p className="text-lg">car connect by Mimo's Autos</p>
        </div>
      </footer>
    </div>
  );
};

export default CatalogEditPage;
