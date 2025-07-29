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
  const [mediaFiles, setMediaFiles] = useState<Array<{
    file: File | null;
    preview: string;
    type: 'image' | 'video';
    isPrimary: boolean;
  }>>([{ file: null, preview: '', type: 'image', isPrimary: true }]);

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

  const handleFileChange = (index: number, file: File | null) => {
    const newMediaFiles = [...mediaFiles];

    if (file) {
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      const preview = URL.createObjectURL(file);

      newMediaFiles[index] = {
        file,
        preview,
        type: fileType,
        isPrimary: index === 0 // First image is always primary
      };

      // Update main image if it's the first one
      if (index === 0) {
        setFormData(prev => ({ ...prev, image: preview }));
      }
    } else {
      newMediaFiles[index] = { file: null, preview: '', type: 'image', isPrimary: index === 0 };
    }

    setMediaFiles(newMediaFiles);
  };

  const addMediaField = () => {
    setMediaFiles([...mediaFiles, { file: null, preview: '', type: 'image', isPrimary: false }]);
  };

  const removeMediaField = (index: number) => {
    if (mediaFiles.length > 1) {
      const newMediaFiles = mediaFiles.filter((_, i) => i !== index);

      // If removing primary image, make first one primary
      if (index === 0 && newMediaFiles.length > 0) {
        newMediaFiles[0].isPrimary = true;
        if (newMediaFiles[0].preview) {
          setFormData(prev => ({ ...prev, image: newMediaFiles[0].preview }));
        }
      }

      setMediaFiles(newMediaFiles);
    }
  };

  const setPrimaryMedia = (index: number) => {
    const newMediaFiles = [...mediaFiles];
    newMediaFiles.forEach((media, i) => {
      media.isPrimary = i === index;
    });

    if (newMediaFiles[index].preview) {
      setFormData(prev => ({ ...prev, image: newMediaFiles[index].preview }));
    }

    setMediaFiles(newMediaFiles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedFeaturesList = Object.keys(selectedFeatures).filter(
      feature => selectedFeatures[feature]
    );

    // Validate that at least one image is uploaded
    const hasValidMedia = mediaFiles.some(media => media.file !== null);
    if (!hasValidMedia) {
      alert('Por favor sube al menos una imagen del vehículo');
      return;
    }

    const vehicleData = {
      ...formData,
      features: selectedFeaturesList,
      image: formData.image, // This will be updated with uploaded file path
      mediaFiles: mediaFiles.filter(media => media.file !== null), // Include files for upload
      // Convert strings back to numbers for numeric fields, preserving full values
      price: typeof formData.price === 'string' ? (formData.price === '' ? 0 : parseFloat(formData.price.replace(/,/g, ''))) : formData.price,
      mileage: typeof formData.mileage === 'string' ? (formData.mileage === '' ? 0 : parseFloat(formData.mileage.replace(/,/g, ''))) : formData.mileage,
      year: typeof formData.year === 'string' ? parseInt(formData.year) || new Date().getFullYear() : formData.year
    };

    // TODO: Here you would upload files to server and get file paths
    // For now, we'll simulate this with the preview URLs
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

            {/* Media Upload Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Imágenes y Videos del Vehículo</h2>

              <div className="space-y-6">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-4">
                      {/* File Upload Area */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {index === 0 ? '📸 Imagen Principal *' : `📁 Archivo ${index + 1}`}
                          {media.isPrimary && index > 0 && ' (Principal)'}
                        </label>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                            className="hidden"
                            id={`file-${index}`}
                            required={index === 0}
                          />
                          <label htmlFor={`file-${index}`} className="cursor-pointer">
                            {media.preview ? (
                              <div className="space-y-2">
                                {media.type === 'image' ? (
                                  <img
                                    src={media.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="max-h-32 mx-auto rounded"
                                  />
                                ) : (
                                  <video
                                    src={media.preview}
                                    className="max-h-32 mx-auto rounded"
                                    controls
                                  />
                                )}
                                <p className="text-sm text-gray-600">
                                  {media.file?.name} ({media.type})
                                </p>
                                <p className="text-xs text-blue-600">Clic para cambiar archivo</p>
                              </div>
                            ) : (
                              <div className="py-8">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">
                                  Clic para subir imagen o video
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  JPG, PNG, MP4, MOV hasta 10MB
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        {!media.isPrimary && media.file && (
                          <button
                            type="button"
                            onClick={() => setPrimaryMedia(index)}
                            className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                          >
                            Hacer Principal
                          </button>
                        )}

                        {mediaFiles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMediaField(index)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMediaField}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors"
                >
                  <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-600">Agregar otra imagen o video</span>
                </button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📋 Información de Archivos:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• La primera imagen será la imagen principal del vehículo</li>
                    <li>• Puedes cambiar cuál es la imagen principal usando el botón "Hacer Principal"</li>
                    <li>• Formatos soportados: JPG, PNG para imágenes | MP4, MOV para videos</li>
                    <li>• Tamaño máximo: 10MB por archivo</li>
                    <li>• Archivos subidos: {mediaFiles.filter(m => m.file).length}</li>
                  </ul>
                </div>
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
