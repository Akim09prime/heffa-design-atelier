
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Toaster } from "@/components/ui/toaster";
import './styles/index'; // Import styles properly

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
