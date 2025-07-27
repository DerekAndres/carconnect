import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import Navbar from '../components/Navbar';

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicles } = useVehicles();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return <Navigate to="/catalog" replace />;
  }

  // For demo purposes, we'll create multiple image variations
  const vehicleImages = [
    vehicle.image,
    vehicle.image.replace('width=1020', 'width=1200'),
    vehicle.image.replace('width=1020', 'width=1400'),
    vehicle.image.replace('width=1020', 'width=1600')
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
  };

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/catalog"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Catálogo</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Guardar</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Compartir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={vehicleImages[currentImageIndex]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-96 object-cover cursor-pointer"
                onClick={() => openImageModal(currentImageIndex)}
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {vehicleImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {vehicleImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openImageModal(index)}
                  className={`relative bg-white rounded-lg overflow-hidden shadow-md border-2 transition-colors ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vehicle.make} {vehicle.model} {vehicle.year}
              </h1>
              <p className="text-gray-600 mb-4">{vehicle.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Precio {vehicle.priceType}:</span>
                    <span className={`text-2xl font-bold ${vehicle.priceType === 'Contado' ? 'text-red-600' : 'text-green-600'}`}>
                      L. {vehicle.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Precio Financiado:</span>
                    <span className="text-xl font-bold text-green-600">L. 180,000</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.condition === 'Nuevo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {vehicle.condition}
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Solicitar Información
              </button>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Especificaciones</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Marca:</span>
                    <p className="font-medium">{vehicle.make}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Modelo:</span>
                    <p className="font-medium">{vehicle.model}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Año:</span>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Kilometraje:</span>
                    <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Combustible:</span>
                    <p className="font-medium">{vehicle.fuelType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Transmisión:</span>
                    <p className="font-medium">{vehicle.transmission}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Condición:</span>
                    <p className="font-medium">{vehicle.condition}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Estado:</span>
                    <p className="font-medium text-green-600">Disponible</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Características</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">¿Interesado en este vehículo?</h2>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  WhatsApp: +504 9999-9999
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Llamar: +504 2222-2222
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Agendar Cita para Ver el Vehículo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
            >
              ✕
            </button>
            <img
              src={vehicleImages[currentImageIndex]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailsPage;
