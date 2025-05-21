
import React from 'react';
import AppRoutes from './routes';
import { Toaster } from "@/components/ui/toaster";
import './styles/index'; // Import styles properly

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
