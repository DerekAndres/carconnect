import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Separator } from "../components/ui/separator";
import { Calculator, TrendingUp, DollarSign, Calendar, Info, PieChart } from "lucide-react";

const CalcularCuotasPage = () => {
  const [calculatorData, setCalculatorData] = useState({
    precioVehiculo: 300000,
    primaInicial: 60000,
    tasaInteres: 12,
    plazoMeses: 60,
    seguroMensual: 2500,
    gastoLegal: 5000
  });

  const [result, setResult] = useState<{
    cuotaMensual: number;
    totalPagar: number;
    totalIntereses: number;
    porcentajePrima: number;
  } | null>(null);

  const handleInputChange = (field: string, value: number) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcularCuota = () => {
    const {
      precioVehiculo,
      primaInicial,
      tasaInteres,
      plazoMeses,
      seguroMensual,
      gastoLegal
    } = calculatorData;

    // Monto financiado
    const montoFinanciado = precioVehiculo - primaInicial + gastoLegal;
    
    // Tasa mensual
    const tasaMensual = tasaInteres / 100 / 12;
    
    // Cuota base (sin seguro)
    const cuotaBase = (montoFinanciado * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / 
                      (Math.pow(1 + tasaMensual, plazoMeses) - 1);
    
    // Cuota total (con seguro)
    const cuotaMensual = cuotaBase + seguroMensual;
    
    // Total a pagar
    const totalPagar = (cuotaMensual * plazoMeses) + primaInicial;
    
    // Total intereses
    const totalIntereses = totalPagar - precioVehiculo;
    
    // Porcentaje de prima
    const porcentajePrima = (primaInicial / precioVehiculo) * 100;

    setResult({
      cuotaMensual: Math.round(cuotaMensual),
      totalPagar: Math.round(totalPagar),
      totalIntereses: Math.round(totalIntereses),
      porcentajePrima: Math.round(porcentajePrima * 100) / 100
    });
  };

  const simulationSteps = [
    {
      step: "1",
      title: "Precio del Vehículo",
      description: "Ingresa el precio total del auto que te interesa"
    },
    {
      step: "2",
      title: "Prima Inicial",
      description: "Define cuánto puedes aportar de enganche"
    },
    {
      step: "3",
      title: "Tasa y Plazo",
      description: "Selecciona la tasa de interés y tiempo de pago"
    },
    {
      step: "4",
      title: "Calcula y Compara",
      description: "Obtén tu cuota mensual y diferentes escenarios"
    }
  ];

  const tasasComunes = [
    { banco: "Banco Atlántida", tasa: 11.5, plazo: "Hasta 7 años" },
    { banco: "BAC Honduras", tasa: 12.0, plazo: "Hasta 6 años" },
    { banco: "Banco Popular", tasa: 12.5, plazo: "Hasta 5 años" },
    { banco: "Banpaís", tasa: 13.0, plazo: "Hasta 6 años" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <Navbar currentPage="home" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Calculadora de Cuotas
            </h1>
            <p className="text-xl mb-8">
              Calcula cuánto pagarías mensualmente por tu vehículo ideal
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/financiamiento">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Financiamiento
                </Button>
              </Link>
              <Link to="/avaluo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Avalúa tu Auto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pasos del Proceso */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Cómo Usar la Calculadora
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {simulationSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl font-bold text-purple-600 mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculadora Principal */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulario de Cálculo */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Calculator className="w-6 h-6 mr-2" />
                  Datos para el Cálculo
                </CardTitle>
                <CardDescription>
                  Ingresa la información del financiamiento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Precio del Vehículo */}
                <div>
                  <Label htmlFor="precio">Precio del Vehículo (L.)</Label>
                  <Input
                    id="precio"
                    type="number"
                    value={calculatorData.precioVehiculo}
                    onChange={(e) => handleInputChange('precioVehiculo', Number(e.target.value))}
                    className="text-lg"
                  />
                </div>

                {/* Prima Inicial */}
                <div>
                  <Label htmlFor="prima">
                    Prima Inicial (L.) - {Math.round((calculatorData.primaInicial / calculatorData.precioVehiculo) * 100)}%
                  </Label>
                  <Input
                    id="prima"
                    type="number"
                    value={calculatorData.primaInicial}
                    onChange={(e) => handleInputChange('primaInicial', Number(e.target.value))}
                    className="text-lg mb-2"
                  />
                  <Slider
                    value={[calculatorData.primaInicial]}
                    onValueChange={(value) => handleInputChange('primaInicial', value[0])}
                    min={calculatorData.precioVehiculo * 0.1}
                    max={calculatorData.precioVehiculo * 0.5}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Tasa de Interés */}
                <div>
                  <Label htmlFor="tasa">Tasa de Interés Anual (%)</Label>
                  <Input
                    id="tasa"
                    type="number"
                    step="0.1"
                    value={calculatorData.tasaInteres}
                    onChange={(e) => handleInputChange('tasaInteres', Number(e.target.value))}
                    className="text-lg mb-2"
                  />
                  <Slider
                    value={[calculatorData.tasaInteres]}
                    onValueChange={(value) => handleInputChange('tasaInteres', value[0])}
                    min={8}
                    max={20}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>8%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Plazo */}
                <div>
                  <Label htmlFor="plazo">Plazo (meses)</Label>
                  <Select 
                    value={calculatorData.plazoMeses.toString()} 
                    onValueChange={(value) => handleInputChange('plazoMeses', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">1 año (12 meses)</SelectItem>
                      <SelectItem value="24">2 años (24 meses)</SelectItem>
                      <SelectItem value="36">3 años (36 meses)</SelectItem>
                      <SelectItem value="48">4 años (48 meses)</SelectItem>
                      <SelectItem value="60">5 años (60 meses)</SelectItem>
                      <SelectItem value="72">6 años (72 meses)</SelectItem>
                      <SelectItem value="84">7 años (84 meses)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Gastos Adicionales */}
                <div>
                  <h4 className="font-semibold mb-3">Gastos Adicionales</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="seguro">Seguro Mensual (L.)</Label>
                      <Input
                        id="seguro"
                        type="number"
                        value={calculatorData.seguroMensual}
                        onChange={(e) => handleInputChange('seguroMensual', Number(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gastos">Gastos Legales (L.)</Label>
                      <Input
                        id="gastos"
                        type="number"
                        value={calculatorData.gastoLegal}
                        onChange={(e) => handleInputChange('gastoLegal', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={calcularCuota} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calcular Cuota
                </Button>
              </CardContent>
            </Card>

            {/* Resultados */}
            <div className="space-y-6">
              {result && (
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl text-green-600">
                      <PieChart className="w-6 h-6 mr-2" />
                      Resultados del Cálculo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Cuota Mensual</p>
                        <p className="text-2xl font-bold text-green-600">
                          L. {result.cuotaMensual.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Total a Pagar</p>
                        <p className="text-2xl font-bold text-blue-600">
                          L. {result.totalPagar.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Total Intereses</p>
                        <p className="text-2xl font-bold text-orange-600">
                          L. {result.totalIntereses.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600">% Prima</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {result.porcentajePrima}%
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-semibold">Desglose del Financiamiento:</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Precio del vehículo:</span>
                          <span>L. {calculatorData.precioVehiculo.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prima inicial:</span>
                          <span>- L. {calculatorData.primaInicial.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gastos legales:</span>
                          <span>+ L. {calculatorData.gastoLegal.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Monto financiado:</span>
                          <span>L. {(calculatorData.precioVehiculo - calculatorData.primaInicial + calculatorData.gastoLegal).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Info className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-yellow-800">Nota:</p>
                          <p className="text-yellow-700">
                            Esta es una simulación. Las tasas reales pueden variar según tu perfil crediticio.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to="/financiamiento" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Solicitar Financiamiento
                        </Button>
                      </Link>
                      <Link to="/catalog" className="flex-1">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          Ver Vehículos
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tasas de Referencia */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Tasas de Referencia
                  </CardTitle>
                  <CardDescription>
                    Tasas actuales de bancos aliados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasasComunes.map((banco, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-semibold text-sm">{banco.banco}</p>
                          <p className="text-xs text-gray-600">{banco.plazo}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{banco.tasa}%</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleInputChange('tasaInteres', banco.tasa)}
                            className="text-xs h-6 px-2"
                          >
                            Usar tasa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Consejos Financieros */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Consejos para tu Financiamiento
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Prima Inicial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Una prima mayor reduce significativamente tu cuota mensual y el total de intereses a pagar.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Plazo vs Cuota</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Plazos más largos reducen la cuota mensual pero aumentan el total de intereses.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🏦 Compara Opciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Solicita cotizaciones en diferentes bancos para encontrar la mejor tasa de interés.
                </p>
              </CardContent>
            </Card>
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
              <Link to="/financiamiento" className="hover:text-blue-400 transition-colors">
                Financiamiento
              </Link>
              <Link to="/avaluo" className="hover:text-blue-400 transition-colors">
                Avalúa tu Auto
              </Link>
            </nav>
          </div>
          <p className="text-lg">car connect by Mimo's Autos</p>
        </div>
      </footer>
    </div>
  );
};

export default CalcularCuotasPage;
