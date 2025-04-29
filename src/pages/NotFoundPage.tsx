import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-8xl md:text-9xl font-bold text-primary-900 mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-medium mb-4">Página no encontrada</h2>
        <p className="text-primary-700 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 button-primary px-6 py-3"
        >
          <ArrowLeft size={18} />
          Volver a Inicio
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;