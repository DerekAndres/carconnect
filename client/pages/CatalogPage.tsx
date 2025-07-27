import { Link, useSearchParams } from "react-router-dom";
import { Search, ChevronDown, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useVehicles } from "../context/VehicleContext";
import SearchFilterBar from "../components/SearchFilterBar";
import Navbar from "../components/Navbar";

const CatalogPage = () => {
  const { vehicles } = useVehicles();
  const visibleVehicles = vehicles.filter((v) => v.isVisible);
  const [showingCount, setShowingCount] = useState(8);

  const loadMore = () => {
    setShowingCount((prev) => Math.min(prev + 4, visibleVehicles.length));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://api.builder.io/api/v1/image/assets/TEMP/afc4b3d892254d6310229ea10631232715ca2db6?width=3881')`,
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
          {/* Header */}
          <div className="mb-8">
            <span className="text-2xl font-medium">Mostrando: Todos</span>
          </div>

          {/* Vehicle Grid */}
          {visibleVehicles.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">
                  No hay vehículos disponibles
                </h3>
                <p className="text-gray-600 mb-4">
                  No hay vehículos marcados como visibles en el catálogo.
                </p>
                <Link
                  to="/catalog/edit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <span>Ir a Editar Catálogo</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {visibleVehicles.slice(0, showingCount).map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {vehicle.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{vehicle.mileage} millas</span>
                      <span>{vehicle.fuelType}</span>
                      <span>{vehicle.transmission}</span>
                    </div>

                    <hr className="mb-4" />

                    <div className="flex items-center justify-between">
                    <span className="text-green-600 text-2xl font-bold">
                      L. {vehicle.price.toLocaleString()}
                    </span>
                    <Link
                      to={`/vehicle/${vehicle.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver detalles
                    </Link>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
              <Link to="#" className="hover:text-blue-400 transition-colors">
                Sobre Nosotros
              </Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">
                Financiamiento
              </Link>
              <Link
                to="/catalog"
                className="hover:text-blue-400 transition-colors"
              >
                Catalogo
              </Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">
                Contactanos
              </Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">
                Avalua Tu Auto
              </Link>
            </nav>
          </div>

          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="#"
              className="text-2xl hover:text-blue-400 transition-colors"
            >
              📘
            </a>
            <a
              href="#"
              className="text-2xl hover:text-blue-400 transition-colors"
            >
              📱
            </a>
            <a
              href="#"
              className="text-2xl hover:text-blue-400 transition-colors"
            >
              🐦
            </a>
          </div>

          <p className="text-lg">car connect by Mimo's Autos</p>
        </div>
      </footer>
    </div>
  );
};

export default CatalogPage;
