import { Link } from 'react-router-dom';
import { User, Edit } from 'lucide-react';

interface NavbarProps {
  currentPage?: 'home' | 'catalog' | 'catalog-edit';
}

const Navbar: React.FC<NavbarProps> = ({ currentPage = 'home' }) => {
  return (
    <nav className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-6 text-white">
      <div className="flex items-center space-x-8">
        <Link to="/">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/9cc206b396ef0a55afa09e2025176c2de7e8058b?width=523" 
            alt="Car Connect" 
            className="h-12 md:h-16 hover:opacity-80 transition-opacity" 
          />
        </Link>
      </div>
      
      <div className="hidden lg:flex items-center space-x-6 text-lg">
        <Link 
          to="/" 
          className={`hover:text-blue-400 transition-colors ${currentPage === 'home' ? 'text-blue-400' : ''}`}
        >
          Inicio
        </Link>
        <Link 
          to="/catalog" 
          className={`hover:text-blue-400 transition-colors ${currentPage === 'catalog' ? 'text-blue-400' : ''}`}
        >
          Catalogo
        </Link>
        <Link 
          to="/catalog/edit" 
          className={`hover:text-blue-400 transition-colors flex items-center space-x-2 ${currentPage === 'catalog-edit' ? 'text-blue-400' : ''}`}
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Link>
        <Link to="#" className="hover:text-blue-400 transition-colors">
          Avaluo de tu Auto
        </Link>
        <Link to="#" className="hover:text-blue-400 transition-colors">
          Agendar Cita
        </Link>
        <Link to="#" className="hover:text-blue-400 transition-colors">
          Sobre nosotros
        </Link>
        <Link to="#" className="hover:text-blue-400 transition-colors">
          Financiamiento
        </Link>
        <Link to="#" className="hover:text-blue-400 transition-colors">
          Contactanos
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <User className="w-5 h-5" />
        <span className="text-lg">Hola, Angelo</span>
        <Link to="/" className="text-2xl md:text-3xl font-medium hover:text-blue-400 transition-colors">
          car connect
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
