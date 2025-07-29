import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useVehicles } from "../context/VehicleContext";
import Navbar from "../components/Navbar";
import SearchFilterBar from "../components/SearchFilterBar";

const HomePage = () => {
  const { vehicles } = useVehicles();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    marca: "",
    modelo: "",
    año: "",
    precio: "",
    estado: "",
  });

  // Get featured vehicles (vehicles marked as featured and visible)
  const featuredVehiclesData = vehicles
    .filter((v) => v.isVisible && v.isFeatured)
    .slice(0, 4);

  const featuredVehicles = [
    {
      id: 1,
      name: "Toyota Camry",
      description: "Asientos de cuero motor v4 bla bla bla",
      price: "L. 100,000",
      details: ["20 millas", "Gasolina", "Automatico"],
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/e28089653b6c317d0fa42e451acf57fa40a3eb08?width=1152",
    },
    {
      id: 2,
      name: "Toyota Camry",
      description: "Asientos de cuero motor v4 bla bla bla",
      price: "L. 150,000",
      details: ["20 millas", "Diesel", "Automatico"],
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/47ee2adefddafdefb09a2c5fbaf8196601fb6ccc?width=930",
    },
    {
      id: 3,
      name: "Toyota Camry",
      description: "Asientos de cuero motor v4 bla bla bla",
      price: "L. 150,000",
      details: ["20 millas", "Diesel", "Mecanico"],
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/430d90fb38e1cc61e90e68c5d685e31e7810d3e4?width=930",
    },
    {
      id: 4,
      name: "Toyota Camry",
      description: "Asientos de cuero motor v4 bla bla bla",
      price: "L. 150,000",
      details: ["20 millas", "Gasolina", "Automatico"],
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/3c48217fddaea0f514d06c9dca835959865ee3bc?width=1020",
    },
  ];

  const carTypes = [
    {
      name: "SUV",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/sedans.jpg",
    },
    {
      name: "Sedan",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/suvs.jpg",
    },
    {
      name: "Pickup",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/pickups.jpg",
    },
  ];

  const whyChooseUs = [
    {
      icon: "📋",
      title: "Gestiones de Financiamiento",
      description:
        "Nosotros nos encargamos de conseguir el mejor precio, evaluaré la mejor oferta bancaria, y te asesorare en los diferentes rubros para tu financiamiento.",
    },
    {
      icon: "🛡️",
      title: "Empresa Confiable",
      description:
        "Somos una empresa súper sólida, contable y responsable. Con años de experiencia y asesores que te ayudarán a elegir el automóvil ideal.",
    },
    {
      icon: "💰",
      title: "Precios Transparentes",
      description:
        "Tenemos precios súper accesibles y competitivos en todos nuestros automóviles que te ayudarán a generar la confianza que necesitas.",
    },
    {
      icon: "🔧",
      title: "Servicios Expertos",
      description:
        "Nuestros expertos están disponibles para revisar cualquier auto, ofrecemos servicio integral a nuestros clientes de inspección y reparación.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://api.builder.io/api/v1/image/assets/TEMP/d705a09eb1977c201673a26fdd6da7e4d53b1462?width=4200')`,
        }}
      >
        {/* Navigation */}
        <Navbar currentPage="home" />

        {/* Functional Search Bar */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4">
          <SearchFilterBar redirectToCatalog={true} />
        </div>
      </div>

      {/* Busca por tipo */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-center mb-12">Busca por tipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {carTypes.map((type, index) => (
            <Link
              key={index}
              to={`/catalog?type=${type.name}`}
              className="text-center group cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="w-48 h-32 mx-auto mb-4 bg-gray-200 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow">
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                {type.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ¿Por que nosotros? */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-16">
          ¿Por que nosotros?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Podrian Interesarte */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-12 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold">Podrian Interesarte</h2>
          <Link
            to="/catalog"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {featuredVehiclesData.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-sm">
                  ✓
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  {vehicle.make} {vehicle.model} {vehicle.year}
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
                  <span className="text-2xl font-bold text-green-600">
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
      </section>

      {/* Financiamiento Flexible */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
          <div>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f53a279982bf33680efc1f143ef76ad41d36bd6c?width=1395"
              alt="Financiamiento"
              className="w-full rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Financiamiento Flexible</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Nosotros nos encargamos de ayudarte a encontrar la mejor manera
              para que pagues tu auto. Te podemos ayudar a conseguir
              financiamiento, o solo a calcularte cuanto quedaria tu cuota,
              tenemos contactos con diferentes entidades financieras.
            </p>
            <Link to="/calcular-cuotas">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                CALCULAR
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ¿quieres cambiar tu auto? */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-blue-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-4">
              ¿quieres cambiar tu auto?
            </h2>
            <h3 className="text-2xl font-medium mb-6">Tambien te ayudamos</h3>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Estamos comprometidos a ofrecerles el mejor servicio, quieres
              cambiar tu carro, mandanos tu informacion y te hacemos una
              cotizacion sin compromiso.
            </p>
            <Link to="/avaluo">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                AVALUA MI AUTO
              </button>
            </Link>
          </div>
          <div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/handshake.jpg"
              alt="Cambiar auto"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Calcula tus cuotas */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-4">Calcula tus cuotas</h2>
          <p className="text-2xl text-gray-600 mb-12">SIN COMPROMISO</p>

          <div className="mb-12">
            <h3 className="text-2xl font-medium mb-8">
              SIGUE ESTOS SIMPLES PASOS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <p className="text-lg">
                  Llena la información en el formulario.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <p className="text-lg">Presiona el botón "Calcular"</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <p className="text-lg">Mira la magia suceder</p>
              </div>
            </div>
          </div>

          <p className="text-blue-200 text-lg mb-8">
            el auto de tus sueños está más cerca de lo que piensas...
          </p>

          <Link to="/calcular-cuotas">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              IR A CALCULADORA
            </button>
          </Link>
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

export default HomePage;
