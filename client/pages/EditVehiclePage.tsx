import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { useVehicles } from "../context/VehicleContext";
import { Vehicle } from "@shared/vehicles";
import Navbar from "../components/Navbar";

// Feature categories with their options
const featureCategories = {
  motor: {
    title: "Motor y Rendimiento",
    options: [
      "Motor V4",
      "Motor V6",
      "Motor V8",
      "Motor Turbo",
      "Motor Híbrido",
      "Motor Eléctrico",
      "Motor Diesel",
      "Inyección Directa",
      "Control de Tracción",
      "AWD/4x4",
      "Diferencial Limitado",
      "Modo Deportivo",
      "Modo Eco",
    ],
  },
  interior: {
    title: "Interior y Comodidad",
    options: [
      "Asientos de Cuero",
      "Asientos Calefaccionados",
      "Asientos Ventilados",
      "Asientos Eléctricos",
      "Memoria de Asientos",
      "Volante de Cuero",
      "Volante Calefaccionado",
      "Aire Acondicionado Automático",
      "Control de Clima Dual",
      "Aire Acondicionado Trasero",
      "Techo Solar",
      "Sunroof Panorámico",
      "Iluminación LED Interior",
      "Ambient Lighting",
    ],
  },
  tecnologia: {
    title: "Tecnología y Entretenimiento",
    options: [
      'Pantalla Táctil 7"',
      'Pantalla Táctil 8"',
      'Pantalla Táctil 10"',
      "Sistema de Navegación",
      "Android Auto",
      "Apple CarPlay",
      "Sistema Bluetooth",
      "USB Multiple",
      "Cargador Inalámbrico",
      "Sistema de Audio Premium",
      "Harman Kardon",
      "Bose Audio",
      "Cámara 360°",
      "Pantalla HUD",
      "WiFi Hotspot",
    ],
  },
  seguridad: {
    title: "Seguridad y Asistencia",
    options: [
      "Airbags Frontales",
      "Airbags Laterales",
      "Airbags de Cortina",
      "Cámara Trasera",
      "Sensores de Parking",
      "Sensores Delanteros",
      "Control Crucero",
      "Control Crucero Adaptivo",
      "Frenado Automático",
      "Alerta de Punto Ciego",
      "Alerta de Cambio de Carril",
      "Sistema Anti-colisión",
      "Encendido Automático de Luces",
      "Luces LED",
      "Faros Adaptativos",
    ],
  },
  exterior: {
    title: "Exterior y Estilo",
    options: [
      'Rines de Aleación 16"',
      'Rines de Aleación 17"',
      'Rines de Aleación 18"',
      'Rines de Aleación 19"',
      "Llantas Run-Flat",
      "Espejos Eléctricos",
      "Espejos Calefaccionados",
      "Luces Xenon",
      "Luces LED",
      "Spoiler Trasero",
      "Barras de Techo",
      "Estribos Laterales",
      "Protección Inferior",
      "Vidrios Polarizados",
    ],
  },
};

const EditVehiclePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { vehicles, setVehicles } = useVehicles();

  const vehicleToEdit = vehicles.find((v) => v.id === id);

  const [formData, setFormData] = useState<Omit<Vehicle, "id">>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: "Gasolina",
    transmission: "Automatico",
    description: "",
    image: "",
    features: [],
    isVisible: true,
    isFeatured: false,
    condition: "Usado",
    priceType: "Contado",
    vehicleType: "Sedan",
  });

  const [selectedFeatures, setSelectedFeatures] = useState<{
    [key: string]: boolean;
  }>({});
  const [images, setImages] = useState<string[]>([""]);

  // Load vehicle data when editing
  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        make: vehicleToEdit.make,
        model: vehicleToEdit.model,
        year: vehicleToEdit.year,
        price: vehicleToEdit.price,
        mileage: vehicleToEdit.mileage,
        fuelType: vehicleToEdit.fuelType,
        transmission: vehicleToEdit.transmission,
        description: vehicleToEdit.description,
        image: vehicleToEdit.image,
        features: vehicleToEdit.features,
        isVisible: vehicleToEdit.isVisible,
        isFeatured: vehicleToEdit.isFeatured || false,
        condition: vehicleToEdit.condition,
        priceType: vehicleToEdit.priceType,
        vehicleType: vehicleToEdit.vehicleType || "Sedan",
      });

      // Set selected features
      const featuresMap: { [key: string]: boolean } = {};
      vehicleToEdit.features.forEach((feature) => {
        featuresMap[feature] = true;
      });
      setSelectedFeatures(featuresMap);

      setImages([vehicleToEdit.image]);
    }
  }, [vehicleToEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    // Special handling for price and mileage to preserve full numbers
    if (name === "price" || name === "mileage") {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Keep as string until form submission
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
      }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);

    // Update main image if it's the first one
    if (index === 0) {
      setFormData((prev) => ({ ...prev, image: value }));
    }
  };

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      if (index === 0 && newImages.length > 0) {
        setFormData((prev) => ({ ...prev, image: newImages[0] }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedFeaturesList = Object.keys(selectedFeatures).filter(
      (feature) => selectedFeatures[feature],
    );

    const vehicleData = {
      ...formData,
      features: selectedFeaturesList,
      image: images[0] || formData.image,
      // Convert strings back to numbers for numeric fields, preserving full values
      price:
        typeof formData.price === "string"
          ? formData.price === ""
            ? 0
            : parseFloat(formData.price.replace(/,/g, ""))
          : formData.price,
      mileage:
        typeof formData.mileage === "string"
          ? formData.mileage === ""
            ? 0
            : parseFloat(formData.mileage.replace(/,/g, ""))
          : formData.mileage,
      year:
        typeof formData.year === "string"
          ? parseInt(formData.year) || new Date().getFullYear()
          : formData.year,
    };

    if (vehicleToEdit && id) {
      // Update existing vehicle
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === id ? { ...vehicleData, id: id } : vehicle,
        ),
      );
      navigate(`/vehicle/${id}`);
    }
  };

  if (!vehicleToEdit) {
    navigate("/catalog");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://api.builder.io/api/v1/image/assets/TEMP/afc4b3d892254d6310229ea10631232715ca2db6?width=3881')`,
        }}
      >
        <Navbar />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/vehicle/${id}`)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver a Detalles</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar Vehículo
              </h1>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Vehicle Information */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Información Básica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (L.) *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price.toString()}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilometraje
                  </label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage.toString()}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="20000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Vehículo
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Combustible
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmisión
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condición
                  </label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Precio
                  </label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibilidad
                  </label>
                  <select
                    name="isVisible"
                    value={formData.isVisible.toString()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isVisible: e.target.value === "true",
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Visible en catálogo</option>
                    <option value="false">Oculto del catálogo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
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

            {/* Images Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Imágenes del Vehículo
              </h2>

              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {index === 0
                          ? "Imagen Principal *"
                          : `Imagen ${index + 1}`}
                      </label>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
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
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Características del Vehículo
              </h2>

              <div className="space-y-6">
                {Object.entries(featureCategories).map(
                  ([categoryKey, category]) => (
                    <div key={categoryKey}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {category.title}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {category.options.map((feature) => (
                          <label
                            key={feature}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFeatures[feature] || false}
                              onChange={() => handleFeatureToggle(feature)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview and Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Vista Previa
              </h2>

              {formData.image && (
                <div className="mb-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/400x200?text=Imagen+no+encontrada";
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
                    L.{" "}
                    {typeof formData.price === "number"
                      ? formData.price.toLocaleString()
                      : formData.price}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      formData.condition === "Nuevo"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {formData.condition}
                  </span>
                </div>
              </div>

              {/* Selected Features Summary */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Características Seleccionadas:
                </h4>
                <div className="text-sm text-gray-600">
                  {
                    Object.keys(selectedFeatures).filter(
                      (f) => selectedFeatures[f],
                    ).length
                  }{" "}
                  características
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Actualizar Vehículo
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/vehicle/${id}`)}
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

export default EditVehiclePage;
