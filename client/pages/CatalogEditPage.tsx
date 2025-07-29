import { Link } from "react-router-dom";
import { Search, ChevronDown, User, Edit2, Plus } from "lucide-react";
import { useState } from "react";
import { useVehicles } from "../context/VehicleContext";
import SearchFilterBar from "../components/SearchFilterBar";
import Navbar from "../components/Navbar";
import AddVehicleModal from "../components/AddVehicleModal";

const CatalogEditPage = () => {
  const {
    vehicles,
    updateVehicleVisibility,
    updateVehicleFeatured,
    toggleAllVehiclesVisibility,
    addVehicle,
  } = useVehicles();
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFeaturedManagement, setShowFeaturedManagement] = useState(false);

  const toggleVehicleVisibility = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      updateVehicleVisibility(vehicleId, !vehicle.isVisible);
      // Update selectAll state if needed
      const newVisibleCount = vehicles.filter((v) =>
        v.id === vehicleId ? !vehicle.isVisible : v.isVisible,
      ).length;
      setSelectAll(newVisibleCount === vehicles.length);
    }
  };

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    toggleAllVehiclesVisibility(newValue);
  };

  const visibleCount = vehicles.filter((v) => v.isVisible).length;

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
        <Navbar currentPage="catalog-edit" />

        {/* Search Bar */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4">
          <SearchFilterBar />
        </div>
      </div>

      {/* Edit Controls */}
      <section className="py-8 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Vehículo</span>
              </button>
              <button
                onClick={toggleSelectAll}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <div
                  className={`w-5 h-5 border-2 rounded ${selectAll ? "bg-blue-600 border-blue-600" : "border-gray-300"} flex items-center justify-center`}
                >
                  {selectAll && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
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
              <button
                onClick={() =>
                  setShowFeaturedManagement(!showFeaturedManagement)
                }
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFeaturedManagement
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                }`}
              >
                {showFeaturedManagement ? "Ocultar" : "Gestionar"} Destacados
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Management */}
      {showFeaturedManagement && (
        <section className="py-8 px-4 md:px-8 lg:px-16 bg-yellow-50 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Gestionar Vehículos Destacados ("Podrían Interesarte")
              </h3>
              <p className="text-gray-600">
                Selecciona hasta 4 vehículos para mostrar en la sección "Podrían
                Interesarte" del inicio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles
                .filter((v) => v.isVisible)
                .map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all cursor-pointer ${
                      vehicle.isFeatured
                        ? "border-yellow-500 shadow-lg transform scale-105"
                        : "border-gray-200 hover:border-yellow-300"
                    }`}
                    onClick={() =>
                      updateVehicleFeatured(vehicle.id, !vehicle.isFeatured)
                    }
                  >
                    <div className="relative">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-32 object-cover"
                      />
                      {vehicle.isFeatured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ DESTACADO
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h4 className="font-semibold text-sm">
                        {vehicle.make} {vehicle.model} {vehicle.year}
                      </h4>
                      <p className="text-gray-600 text-xs mt-1">
                        L. {vehicle.price.toLocaleString()}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            vehicle.isFeatured
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {vehicle.isFeatured
                            ? "Destacado"
                            : "Click para destacar"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Actualmente hay{" "}
                <span className="font-bold">
                  {vehicles.filter((v) => v.isFeatured).length}
                </span>{" "}
                vehículos destacados. Se recomienda tener exactamente 4 para una
                mejor presentación.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Vehicle Grid */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow relative"
              >
                {/* Checkbox for visibility */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-white rounded-lg shadow-md p-2">
                    <button
                      onClick={() => toggleVehicleVisibility(vehicle.id)}
                      className={`flex items-center space-x-2 text-sm font-medium ${vehicle.isVisible ? "text-green-600" : "text-gray-600"}`}
                      title={
                        vehicle.isVisible
                          ? "Visible en catálogo principal"
                          : "Oculto del catálogo principal"
                      }
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${vehicle.isVisible ? "bg-green-500 border-green-500" : "border-gray-300"}`}
                      >
                        {vehicle.isVisible && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="whitespace-nowrap">
                        {vehicle.isVisible ? "Mostrar" : "Ocultar"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className={`w-full h-48 object-cover transition-opacity ${!vehicle.isVisible ? "opacity-50" : ""}`}
                  />
                  <div className="absolute top-2 left-12 bg-white/80 backdrop-blur-sm rounded p-2">
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded p-2">
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                <div
                  className={`p-6 transition-opacity ${!vehicle.isVisible ? "opacity-50" : ""}`}
                >
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

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">C</span>
                      <span className="text-lg font-bold text-red-600">
                        L. {vehicle.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">PV</span>
                      <span className="text-lg font-bold text-green-600">
                        L. 150,000
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
                      <Edit2 className="w-4 h-4" />
                      <span>editar</span>
                    </button>
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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>

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

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddVehicle={addVehicle}
      />
    </div>
  );
};

export default CatalogEditPage;
