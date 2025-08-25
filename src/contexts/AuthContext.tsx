import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  signIn: async () => ({ error: null }),
  register: async () => ({ error: null }),
  signOut: () => {},
  isAdmin: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cualquier usuario logueado es admin (tiene acceso al dashboard)
  const isAdmin = !!user;

  // Función para guardar el usuario en localStorage
  const saveUserToStorage = (userData: User) => {
    try {
      localStorage.setItem('domum_auth_user', JSON.stringify(userData));
      localStorage.setItem('domum_auth_timestamp', Date.now().toString());
      console.log('✅ Usuario guardado en localStorage:', userData.email);
    } catch (error) {
      console.error('❌ Error saving user to localStorage:', error);
    }
  };

  // Función para obtener el usuario de localStorage
  const getUserFromStorage = (): User | null => {
    try {
      const userData = localStorage.getItem('domum_auth_user');
      const timestamp = localStorage.getItem('domum_auth_timestamp');
      
      console.log('🔍 Verificando localStorage...', { userData: !!userData, timestamp: !!timestamp });
      
      if (!userData || !timestamp) {
        console.log('❌ No hay datos en localStorage');
        return null;
      }

      // Verificar si la sesión no ha expirado (7 días)
      const sessionAge = Date.now() - parseInt(timestamp);
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
      
      if (sessionAge > maxAge) {
        console.log('⏰ Sesión expirada, limpiando localStorage');
        clearUserFromStorage();
        return null;
      }

      const parsedUser = JSON.parse(userData);
      console.log('✅ Usuario recuperado de localStorage:', parsedUser.email, 'Tiene acceso al dashboard: SÍ');
      return parsedUser;
    } catch (error) {
      console.error('❌ Error getting user from localStorage:', error);
      clearUserFromStorage();
      return null;
    }
  };

  // Función para limpiar el usuario de localStorage
  const clearUserFromStorage = () => {
    try {
      localStorage.removeItem('domum_auth_user');
      localStorage.removeItem('domum_auth_timestamp');
      console.log('🧹 localStorage limpiado');
    } catch (error) {
      console.error('❌ Error clearing user from localStorage:', error);
    }
  };

  // Verificar sesión al cargar el componente
  useEffect(() => {
    const checkAuthStatus = () => {
      console.log('🔄 Verificando estado de autenticación...');
      setIsLoading(true);
      
      const storedUser = getUserFromStorage();
      
      if (storedUser) {
        setUser(storedUser);
        console.log('✅ Sesión restaurada:', storedUser.email, 'Dashboard disponible: SÍ');
      } else {
        setUser(null);
        console.log('❌ No hay sesión activa');
      }
      
      setIsLoading(false);
    };

    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(checkAuthStatus, 100);
    return () => clearTimeout(timer);
  }, []);

  // Debug: Log del estado cuando cambia
  useEffect(() => {
    console.log('🔄 Auth State Changed:', { 
      user: user ? { id: user.id, email: user.email, name: user.name } : null, 
      isAdmin, 
      isLoading
    });
  }, [user, isAdmin, isLoading]);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Intentando login con:', email);
    setIsLoading(true);
    
    try {
      const res = await fetch("https://domumarquitectura.com/assets/API_Auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('📡 Respuesta del servidor:', data);
      
      if (data.success) {
        const userData = data.user;
        
        setUser(userData);
        saveUserToStorage(userData);
        
        console.log('✅ Login exitoso:', userData.email, 'Dashboard disponible: SÍ');
        setIsLoading(false);
        return { error: null };
      } else {
        console.log('❌ Login fallido:', data.error);
        setIsLoading(false);
        return { error: data.error || "Error desconocido" };
      }
    } catch (err) {
      console.error('❌ Error en signIn:', err);
      setIsLoading(false);
      return { error: "Error de conexión con el servidor" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("https://domumarquitectura.com/assets/API_Register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        return { error: null };
      } else {
        return { error: data.error || "Error desconocido" };
      }
    } catch (err) {
      console.error('❌ Error en register:', err);
      setIsLoading(false);
      return { error: "Error de conexión con el servidor" };
    }
  };

  const signOut = () => {
    console.log('🚪 Cerrando sesión...');
    setUser(null);
    clearUserFromStorage();
    console.log('✅ Sesión cerrada');
  };

  const value = {
    user,
    isLoading,
    signIn,
    register,
    signOut,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}