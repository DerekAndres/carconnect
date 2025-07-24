import { Link } from 'react-router-dom';
import { Search, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import SearchFilterBar from '../components/SearchFilterBar';
import Navbar from '../components/Navbar';

const CatalogPage = () => {
  const { vehicles } = useVehicles();
  const visibleVehicles = vehicles.filter(v => v.isVisible);
  const [showingCount, setShowingCount] = useState(8);

  const loadMore = () => {
    setShowingCount(prev => Math.min(prev + 4, visibleVehicles.length));
  };

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
        <Navbar currentPage="catalog" />

        {/* Search Bar */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4">
          <SearchFilterBar />
        </div>
      </div>

      {/* Catalog Content */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header with count and add button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-8">
              <span className="text-2xl font-medium">Mostrando: Todos</span>
              <Link 
                to="/catalog/edit" 
                className="text-blue-600 hover:text-blue-800 font-medium text-lg flex items-center space-x-2"
              >
                <span>agregar auto</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/catalog/edit" 
                className="text-blue-600 hover:text-blue-800 font-medium text-lg"
              >
                REPORTERIA
              </Link>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleVehicles.slice(0, showingCount).map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow relative">
                <div className="absolute top-4 left-4 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center z-10">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="relative">
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded p-2">
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded p-2">
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-gray-600 text-sm mb-4">{vehicle.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{vehicle.mileage} millas</span>
                    <span>{vehicle.fuelType}</span>
                    <span>{vehicle.transmission}</span>
                  </div>
                  
                  <hr className="mb-4" />
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-500">
                        {vehicle.priceType === 'Contado' ? 'C' : 'PV'}
                      </span>
                      <span className={`text-xl font-bold ${vehicle.priceType === 'Contado' ? 'text-red-600' : 'text-green-600'}`}>
                        L. {vehicle.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 text-xl font-bold">L. 150,000</span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      view details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {showingCount < visibleVehicles.length && (
            <div className="text-center mt-12">
              <button 
                onClick={loadMore}
                className="text-gray-600 hover:text-gray-800 font-medium text-lg px-8 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                cargar mas
              </button>
            </div>
          )}
        </div>
      </section>

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

export default CatalogPage;
