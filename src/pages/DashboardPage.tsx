import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHome from '../components/dashboard/DashboardHome';
import DashboardBlog from '../components/dashboard/DashboardBlog';
import DashboardBlogEdit from '../components/dashboard/DashboardBlogEdit';
import DashboardProjects from '../components/dashboard/DashboardProjects';
import DashboardProjectEdit from '../components/dashboard/DashboardProjectEdit';
import DashboardMessages from '../components/dashboard/DashboardMessages';

import DashboardUserEdit from '../components/dashboard/DashboardTeamEdit';
import DashboardUsers from '../components/dashboard/DashboardTeam';

const DashboardPage = () => {
  useEffect(() => {
    document.title = 'Dashboard | DOMUM Arquitectura';
  }, []);
  
  return (
    <div className="min-h-screen bg-primary-50 flex">
      {/* Sidebar */}
      <aside className="w-64 fixed h-screen">
        <DashboardSidebar />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="blog" element={<DashboardBlog />} />
            <Route path="blog/nuevo" element={<DashboardBlogEdit />} />
            <Route path="blog/:id" element={<DashboardBlogEdit />} />
            <Route path="proyectos" element={<DashboardProjects />} />
            <Route path="proyectos/nuevo" element={<DashboardProjectEdit />} />
            <Route path="proyectos/:id" element={<DashboardProjectEdit />} />
            <Route path="mensajes" element={<DashboardMessages />} />
            <Route path="usuarios" element={<DashboardUsers />} />
            <Route path="usuarios/nuevo" element={<DashboardUserEdit />} />
            <Route path="usuarios/:id" element={<DashboardUserEdit />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;