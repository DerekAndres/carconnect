import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Separator } from "../components/ui/separator";
import {
  Upload,
  Car,
  DollarSign,
  CheckCircle,
  Camera,
  FileText,
} from "lucide-react";

const AvaluoPage = () => {
  const [formData, setFormData] = useState({
    // Información Personal
    nombre: "",
    email: "",
    telefono: "",

    // Información del Vehículo
    marca: "",
    modelo: "",
    año: "",
    kilometraje: "",
    transmision: "",
    combustible: "",
    color: "",

    // Estado del Vehículo
    estadoGeneral: "",
    accidentes: "",
    mantenimientos: "",
    documentos: "",
    observaciones: "",

    // Motivación
    razonVenta: "",
    tiempoVenta: "",
    precioEsperado: "",
  });

  const [images, setImages] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 8)); // Máximo 8 imágenes
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos de avalúo:", formData);
    console.log("Imágenes:", images);
    // Aquí se procesaría la información y imágenes
  };

  const evaluationSteps = [
    {
      step: "1",
      title: "Completa el formulario",
      description: "Proporciona información detallada de tu vehículo",
    },
    {
      step: "2",
      title: "Sube fotos del auto",
      description: "Interior, exterior y documentos del vehículo",
    },
    {
      step: "3",
      title: "Recibe tu avalúo",
      description: "Te contactamos en 24-48 horas con una cotización",
    },
    {
      step: "4",
      title: "Agenda inspección",
      description: "Confirmamos el valor con una revisión presencial",
    },
  ];

  const requiredPhotos = [
    "Vista frontal completa",
    "Vista trasera completa",
    "Lateral izquierdo",
    "Lateral derecho",
    "Interior (asientos delanteros)",
    "Tablero y volante",
    "Motor",
    "Documentos del vehículo",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
        <Navbar currentPage="home" />

        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Avalúa tu Auto</h1>
            <p className="text-xl mb-8">
              Obtén una cotización profesional y sin compromiso de tu vehículo
            </p>
          </div>
        </div>
      </div>

      {/* Proceso de Evaluación */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Cómo Funciona
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {evaluationSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-600 mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario Principal */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Formulario de Avalúo</CardTitle>
              <CardDescription>
                Completa toda la información para obtener la cotización más
                precisa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información Personal */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Información Personal
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre Completo *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="98765432"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Información del Vehículo */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Información del Vehículo
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="marca">Marca *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("marca", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la marca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="toyota">Toyota</SelectItem>
                          <SelectItem value="honda">Honda</SelectItem>
                          <SelectItem value="nissan">Nissan</SelectItem>
                          <SelectItem value="hyundai">Hyundai</SelectItem>
                          <SelectItem value="ford">Ford</SelectItem>
                          <SelectItem value="chevrolet">Chevrolet</SelectItem>
                          <SelectItem value="bmw">BMW</SelectItem>
                          <SelectItem value="mercedes">
                            Mercedes-Benz
                          </SelectItem>
                          <SelectItem value="audi">Audi</SelectItem>
                          <SelectItem value="otro">Otra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="modelo">Modelo *</Label>
                      <Input
                        id="modelo"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleInputChange}
                        placeholder="Ej: Camry, Civic, etc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="año">Año *</Label>
                      <Input
                        id="año"
                        name="año"
                        type="number"
                        min="1990"
                        max="2024"
                        value={formData.año}
                        onChange={handleInputChange}
                        placeholder="2020"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="kilometraje">Kilometraje *</Label>
                      <Input
                        id="kilometraje"
                        name="kilometraje"
                        type="number"
                        value={formData.kilometraje}
                        onChange={handleInputChange}
                        placeholder="120000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="transmision">Transmisión</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("transmision", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatica">Automática</SelectItem>
                          <SelectItem value="cvt">CVT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="combustible">Combustible</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("combustible", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasolina">Gasolina</SelectItem>
                          <SelectItem value="diesel">Diésel</SelectItem>
                          <SelectItem value="hibrido">Híbrido</SelectItem>
                          <SelectItem value="electrico">Eléctrico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="Blanco"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Estado del Vehículo */}
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    Estado del Vehículo
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="estadoGeneral">Estado General *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("estadoGeneral", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="muy-bueno">Muy Bueno</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="necesita-reparaciones">
                            Necesita Reparaciones
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="accidentes">
                        ¿Ha tenido accidentes? *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("accidentes", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="menor">Sí, menor</SelectItem>
                          <SelectItem value="moderado">Sí, moderado</SelectItem>
                          <SelectItem value="severo">Sí, severo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="mantenimientos">
                        Mantenimientos al día
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("mantenimientos", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí, al día</SelectItem>
                          <SelectItem value="parcial">Parcialmente</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="documentos">Documentos en regla</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("documentos", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí, todos</SelectItem>
                          <SelectItem value="parcial">Algunos</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observaciones">
                      Observaciones Adicionales
                    </Label>
                    <Textarea
                      id="observaciones"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      placeholder="Describe cualquier detalle importante sobre el estado del vehículo..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Fotos del Vehículo */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Fotos del Vehículo
                  </h3>

                  <div className="mb-4">
                    <Label htmlFor="images">Subir Fotos (máximo 8)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-4">
                        Arrastra y suelta las fotos aquí, o haz clic para
                        seleccionar
                      </p>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("images")?.click()
                        }
                      >
                        Seleccionar Fotos
                      </Button>
                    </div>
                  </div>

                  {/* Preview de imágenes */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lista de fotos requeridas */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Fotos Requeridas:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {requiredPhotos.map((photo, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          {photo}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Información de Venta */}
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    Información de Venta
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="razonVenta">Razón de Venta</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("razonVenta", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cambio">
                            Cambio de vehículo
                          </SelectItem>
                          <SelectItem value="necesidad">
                            Necesidad económica
                          </SelectItem>
                          <SelectItem value="mudanza">Mudanza</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tiempoVenta">Tiempo para Vender</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("tiempoVenta", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inmediato">Inmediato</SelectItem>
                          <SelectItem value="1-semana">1 semana</SelectItem>
                          <SelectItem value="1-mes">1 mes</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="precioEsperado">
                        Precio Esperado (L.)
                      </Label>
                      <Input
                        id="precioEsperado"
                        name="precioEsperado"
                        type="number"
                        value={formData.precioEsperado}
                        onChange={handleInputChange}
                        placeholder="250000"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 px-12"
                  >
                    Solicitar Avalúo Gratuito
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Te contactaremos en 24-48 horas con tu cotización
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <nav className="flex flex-wrap justify-center space-x-8 text-lg mb-8">
              <Link to="/" className="hover:text-blue-400 transition-colors">
                Inicio
              </Link>
              <Link
                to="/catalog"
                className="hover:text-blue-400 transition-colors"
              >
                Catálogo
              </Link>
              <Link
                to="/financiamiento"
                className="hover:text-blue-400 transition-colors"
              >
                Financiamiento
              </Link>
              <Link
                to="/calcular-cuotas"
                className="hover:text-blue-400 transition-colors"
              >
                Calcular Cuotas
              </Link>
            </nav>
          </div>
          <p className="text-lg">car connect by Mimo's Autos</p>
        </div>
      </footer>
    </div>
  );
};

export default AvaluoPage;
