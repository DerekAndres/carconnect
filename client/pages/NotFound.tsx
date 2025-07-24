import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-gray-900">
        <Navbar />
      </div>

      {/* 404 Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <h1 className="text-4xl font-bold mb-4">404 - Página No Encontrada</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          La página que estás buscando no existe. Puedes regresar al inicio o explorar nuestro catálogo de vehículos.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Ir al Inicio
          </Link>
          <Link
            to="/catalog"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <nav className="flex flex-wrap justify-center space-x-8 text-lg mb-8">
              <Link to="#" className="hover:text-blue-400 transition-colors">Sobre Nosotros</Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">Financiamiento</Link>
              <Link to="/catalog" className="hover:text-blue-400 transition-colors">Catalogo</Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">Contactanos</Link>
              <Link to="#" className="hover:text-blue-400 transition-colors">Avalua Tu Auto</Link>
            </nav>
          </div>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-2xl hover:text-blue-400 transition-colors">📘</a>
            <a href="#" className="text-2xl hover:text-blue-400 transition-colors">📱</a>
            <a href="#" className="text-2xl hover:text-blue-400 transition-colors">🐦</a>
          </div>
          
          <p className="text-lg">car connect by Mimo's Autos</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
