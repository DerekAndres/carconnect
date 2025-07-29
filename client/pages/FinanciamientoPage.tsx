import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Calculator, DollarSign, FileText, CheckCircle } from "lucide-react";

const FinanciamientoPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    salario: "",
    vehiculoInteres: "",
    primaAportar: "",
    mensualidadDeseada: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos de financiamiento:", formData);
    // Aquí se procesaría la información
  };

  const financingOptions = [
    {
      name: "Financiamiento Bancario",
      description: "Tasas competitivas con bancos aliados",
      benefits: ["Tasas desde 8.5%", "Hasta 7 años de plazo", "Aprobación rápida"],
      icon: "🏦"
    },
    {
      name: "Financiamiento Directo",
      description: "Financiamiento directo con el dealer",
      benefits: ["Requisitos flexibles", "Proceso simplificado", "Prima negociable"],
      icon: "🤝"
    },
    {
      name: "Leasing",
      description: "Arrienda tu vehículo con opción de compra",
      benefits: ["Cuotas más bajas", "Renovación fácil", "Mantenimiento incluido"],
      icon: "📋"
    }
  ];

  const requirements = [
    "Identificación vigente",
    "Comprobante de ingresos",
    "Referencias comerciales",
    "Historial crediticio"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <Navbar currentPage="home" />

        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Financiamiento Flexible
            </h1>
            <p className="text-xl mb-8">
              Te ayudamos a conseguir el mejor financiamiento para tu vehículo ideal
            </p>
          </div>
        </div>
      </div>

      {/* Opciones de Financiamiento */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Opciones de Financiamiento
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {financingOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{option.icon}</div>
                  <CardTitle className="text-xl">{option.name}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {option.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de Solicitud */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Solicita tu Pre-aprobación
              </h2>
              <p className="text-gray-600 mb-8">
                Completa este formulario y te contactaremos en menos de 24 horas 
                con las mejores opciones de financiamiento para ti.
              </p>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Requisitos Básicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Todos los campos son obligatorios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre Completo</Label>
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
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Tu número de teléfono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="salario">Ingresos Mensuales (L.)</Label>
                    <Input
                      id="salario"
                      name="salario"
                      type="number"
                      value={formData.salario}
                      onChange={handleInputChange}
                      placeholder="50000"
                      required
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="vehiculoInteres">Vehículo de Interés</Label>
                    <Input
                      id="vehiculoInteres"
                      name="vehiculoInteres"
                      value={formData.vehiculoInteres}
                      onChange={handleInputChange}
                      placeholder="Ej: Toyota Camry 2023"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaAportar">Prima a Aportar (L.)</Label>
                      <Input
                        id="primaAportar"
                        name="primaAportar"
                        type="number"
                        value={formData.primaAportar}
                        onChange={handleInputChange}
                        placeholder="100000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mensualidadDeseada">Mensualidad Deseada (L.)</Label>
                      <Input
                        id="mensualidadDeseada"
                        name="mensualidadDeseada"
                        type="number"
                        value={formData.mensualidadDeseada}
                        onChange={handleInputChange}
                        placeholder="8000"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Solicitar Pre-aprobación
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Beneficios Adicionales */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué Financiar con Nosotros?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold mb-2">Aprobación Rápida</h3>
              <p className="text-sm text-gray-600">Respuesta en menos de 24 horas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-bold mb-2">Mejores Tasas</h3>
              <p className="text-sm text-gray-600">Negociamos las mejores condiciones</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-bold mb-2">Proceso Seguro</h3>
              <p className="text-sm text-gray-600">Información protegida y confidencial</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold mb-2">Asesoría Experta</h3>
              <p className="text-sm text-gray-600">Te acompañamos en todo el proceso</p>
            </div>
          </div>
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
              <Link to="/catalog" className="hover:text-blue-400 transition-colors">
                Catálogo
              </Link>
              <Link to="/avaluo" className="hover:text-blue-400 transition-colors">
                Avalúa Tu Auto
              </Link>
              <Link to="/calcular-cuotas" className="hover:text-blue-400 transition-colors">
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

export default FinanciamientoPage;
