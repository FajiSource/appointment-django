import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';


import AuthProvider from './context/AuthContext.jsx';
import router from './router/Router.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
