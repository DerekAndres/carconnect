import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import { Vehicle } from '@shared/vehicles';
import Navbar from '../components/Navbar';

// Feature categories with their options
const featureCategories = {
  motor: {
    title: 'Motor y Rendimiento',
    options: [
      'Motor V4', 'Motor V6', 'Motor V8', 'Motor Turbo',
      'Motor Híbrido', 'Motor Eléctrico', 'Motor Diesel',
      'Inyección Directa', 'Control de Tracción', 'AWD/4x4',
      'Diferencial Limitado', 'Modo Deportivo', 'Modo Eco'
    ]
  },
  interior: {
    title: 'Interior y Comodidad',
    options: [
      'Asientos de Cuero', 'Asientos Calefaccionados', 'Asientos Ventilados',
      'Asientos Eléctricos', 'Memoria de Asientos', 'Volante de Cuero',
      'Volante Calefaccionado', 'Aire Acondicionado Automático', 'Control de Clima Dual',
      'Aire Acondicionado Trasero', 'Techo Solar', 'Sunroof Panorámico',
      'Iluminación LED Interior', 'Ambient Lighting'
    ]
  },
  tecnologia: {
    title: 'Tecnología y Entretenimiento',
    options: [
      'Pantalla Táctil 7"', 'Pantalla Táctil 8"', 'Pantalla Táctil 10"',
      'Sistema de Navegación', 'Android Auto', 'Apple CarPlay',
      'Sistema Bluetooth', 'USB Multiple', 'Cargador Inalámbrico',
      'Sistema de Audio Premium', 'Harman Kardon', 'Bose Audio',
      'Cámara 360°', 'Pantalla HUD', 'WiFi Hotspot'
    ]
  },
  seguridad: {
    title: 'Seguridad y Asistencia',
    options: [
      'Airbags Frontales', 'Airbags Laterales', 'Airbags de Cortina',
      'Cámara Trasera', 'Sensores de Parking', 'Sensores Delanteros',
      'Control Crucero', 'Control Crucero Adaptivo', 'Frenado Automático',
      'Alerta de Punto Ciego', 'Alerta de Cambio de Carril', 'Sistema Anti-colisión',
      'Encendido Automático de Luces', 'Luces LED', 'Faros Adaptativos'
    ]
  },
  exterior: {
    title: 'Exterior y Estilo',
    options: [
      'Rines de Aleación 16"', 'Rines de Aleación 17"', 'Rines de Aleación 18"',
      'Rines de Aleación 19"', 'Llantas Run-Flat', 'Espejos Eléctricos',
      'Espejos Calefaccionados', 'Luces Xenon', 'Luces LED',
      'Spoiler Trasero', 'Barras de Techo', 'Estribos Laterales',
      'Protección Inferior', 'Vidrios Polarizados'
    ]
  }
};

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const { addVehicle } = useVehicles();

  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: 'Gasolina',
    transmission: 'Automatico',
    description: '',
    image: '',
    features: [],
    isVisible: true, // Always true for new vehicles
    isFeatured: false, // Default to not featured
    condition: 'Usado',
    priceType: 'Contado',
    vehicleType: 'Sedan',
    adminData: {
      fechaLlegadaHonduras: '',
      fechaSalidaEEUU: '',
      estadoCompraEEUU: '',
      paginaWebCompra: 'Copart',
      nombreEnPapeles: '',
      costoChocado: 0,
      costoReparado: null,
      costoVentaChocado: 0,
      costoVentaReparado: 0
    }
  });

  const [priceSource, setPriceSource] = useState<'chocado' | 'reparado'>('chocado');

  const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: boolean }>({});
  const [images, setImages] = useState<string[]>(['']);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name.startsWith('admin_')) {
      const adminField = name.replace('admin_', '');
      const newAdminData = {
        ...formData.adminData!,
        [adminField]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
      };

      setFormData(prev => ({
        ...prev,
        adminData: newAdminData,
        // Auto-update price when cost fields change
        price: adminField === 'costoVentaChocado' && priceSource === 'chocado'
          ? (value === '' ? 0 : parseFloat(value))
          : adminField === 'costoVentaReparado' && priceSource === 'reparado'
          ? (value === '' ? 0 : parseFloat(value))
          : prev.price
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
      }));
    }
  };

  const handlePriceSourceChange = (source: 'chocado' | 'reparado') => {
    setPriceSource(source);
    setFormData(prev => ({
      ...prev,
      price: source === 'chocado'
        ? prev.adminData?.costoVentaChocado || 0
        : prev.adminData?.costoVentaReparado || 0
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
    
    // Update main image if it's the first one
    if (index === 0) {
      setFormData(prev => ({ ...prev, image: value }));
    }
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      if (index === 0 && newImages.length > 0) {
        setFormData(prev => ({ ...prev, image: newImages[0] }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedFeaturesList = Object.keys(selectedFeatures).filter(
      feature => selectedFeatures[feature]
    );

    const vehicleData = {
      ...formData,
      features: selectedFeaturesList,
      image: images[0] || formData.image,
      // Convert strings back to numbers for numeric fields, preserving full values
      price: typeof formData.price === 'string' ? (formData.price === '' ? 0 : parseFloat(formData.price.replace(/,/g, ''))) : formData.price,
      mileage: typeof formData.mileage === 'string' ? (formData.mileage === '' ? 0 : parseFloat(formData.mileage.replace(/,/g, ''))) : formData.mileage,
      year: typeof formData.year === 'string' ? parseInt(formData.year) || new Date().getFullYear() : formData.year
    };

    addVehicle(vehicleData);
    navigate('/catalog');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://api.builder.io/api/v1/image/assets/TEMP/afc4b3d892254d6310229ea10631232715ca2db6?width=3881')`
        }}
      >
        <Navbar currentPage="add-vehicle" />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Agregar Nuevo Vehículo
              </h1>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Vehicle Information */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Información Básica</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Toyota, Honda, Mercedes..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Camry, Accord, C-Class..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Año *</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kilometraje</label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="20000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Vehículo</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Combustible</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Eléctrico">Eléctrico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmisión</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Automatico">Automático</option>
                    <option value="Mecanico">Mecánico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condición</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Usado">Usado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Precio</label>
                  <select
                    name="priceType"
                    value={formData.priceType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Contado">Contado</option>
                    <option value="Financiado">Financiado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe las características principales del vehículo..."
                />
              </div>
            </div>

            {/* Admin Information - Only for Angelo */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-sm mr-3">ADMIN</span>
                Información Administrativa
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Llegada a Honduras</label>
                  <input
                    type="date"
                    name="admin_fechaLlegadaHonduras"
                    value={formData.adminData?.fechaLlegadaHonduras || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Salida de EEUU</label>
                  <input
                    type="date"
                    name="admin_fechaSalidaEEUU"
                    value={formData.adminData?.fechaSalidaEEUU || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Compra (EEUU)</label>
                  <input
                    type="text"
                    name="admin_estadoCompraEEUU"
                    value={formData.adminData?.estadoCompraEEUU || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="California, Texas, Florida..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Página Web de Compra</label>
                  <select
                    name="admin_paginaWebCompra"
                    value={formData.adminData?.paginaWebCompra || 'Copart'}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Copart">Copart</option>
                    <option value="IAAI">IAAI</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre en Papeles</label>
                <input
                  type="text"
                  name="admin_nombreEnPapeles"
                  value={formData.adminData?.nombreEnPapeles || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="A nombre de quien está el vehículo..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Costo Chocado (USD)</label>
                  <input
                    type="text"
                    name="admin_costoChocado"
                    value={formData.adminData?.costoChocado || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Costo Reparado (USD)</label>
                  <input
                    type="text"
                    name="admin_costoReparado"
                    value={formData.adminData?.costoReparado || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dejar vacío si no está reparado"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Costo Venta Chocado (L.)</label>
                  <input
                    type="text"
                    name="admin_costoVentaChocado"
                    value={formData.adminData?.costoVentaChocado || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="120000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Costo Venta Reparado (L.)</label>
                  <input
                    type="text"
                    name="admin_costoVentaReparado"
                    value={formData.adminData?.costoVentaReparado || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150000"
                  />
                </div>
              </div>
            </div>

            {/* Price Configuration Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-400 text-blue-900 px-2 py-1 rounded text-sm mr-3">PRECIO</span>
                Configuración de Precio de Venta
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Fuente de Precio *
                  </label>
                  <select
                    value={priceSource}
                    onChange={(e) => handlePriceSourceChange(e.target.value as 'chocado' | 'reparado')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="chocado">Usar Costo Venta Chocado</option>
                    <option value="reparado">Usar Costo Venta Reparado</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1">
                    El precio del vehículo se tomará automáticamente del valor seleccionado en la sección administrativa
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Final del Vehículo (L.)
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={`L. ${formData.price.toLocaleString()}`}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed font-bold text-lg"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Este precio se actualiza automáticamente cuando cambias los valores en la sección administrativa
                  </p>
                </div>

                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Configuración Actual:</h4>
                  <div className="text-sm text-blue-800">
                    <p>
                      <strong>Fuente:</strong> {priceSource === 'chocado' ? 'Costo Venta Chocado' : 'Costo Venta Reparado'}
                    </p>
                    <p>
                      <strong>Valor en Admin:</strong> L. {priceSource === 'chocado'
                        ? (formData.adminData?.costoVentaChocado || 0).toLocaleString()
                        : (formData.adminData?.costoVentaReparado || 0).toLocaleString()
                      }
                    </p>
                    <p className="mt-2 text-xs">
                      Para cambiar el precio, actualiza los valores en la sección "Información Administrativa" arriba.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Imágenes del Vehículo</h2>
              
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {index === 0 ? 'Imagen Principal *' : `Imagen ${index + 1}`}
                      </label>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        required={index === 0}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar otra imagen</span>
                </button>
              </div>
            </div>

            {/* Features Selection */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Características del Vehículo</h2>
              
              <div className="space-y-6">
                {Object.entries(featureCategories).map(([categoryKey, category]) => (
                  <div key={categoryKey}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{category.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category.options.map((feature) => (
                        <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFeatures[feature] || false}
                            onChange={() => handleFeatureToggle(feature)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Preview and Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vista Previa</h2>
              
              {formData.image && (
                <div className="mb-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Imagen+no+encontrada';
                    }}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {formData.make} {formData.model} {formData.year}
                </h3>
                <p className="text-gray-600 text-sm">{formData.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    L. {typeof formData.price === 'number' ? formData.price.toLocaleString() : formData.price}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    formData.condition === 'Nuevo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {formData.condition}
                  </span>
                </div>
              </div>

              {/* Selected Features Summary */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Características Seleccionadas:</h4>
                <div className="text-sm text-gray-600">
                  {Object.keys(selectedFeatures).filter(f => selectedFeatures[f]).length} características
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Agregar Vehículo
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/catalog')}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVehiclePage;
