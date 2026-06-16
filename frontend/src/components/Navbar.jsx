import { Link } from 'react-router-dom';
import { Code2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Início', path: '/' },
  { label: 'Projetos', path: '/#projetos' },
  { label: 'Contato', path: '/#contato' },
];

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
          <Code2 size={28} />
          <span className="font-bold text-lg">VGameleira</span>
        </Link>

        {/* Links Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              to="/admin/dashboard"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Botão Menu Mobile */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir menu"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuAberto(false)}
              className="block text-gray-300 hover:text-purple-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMenuAberto(false)}
              className="block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
