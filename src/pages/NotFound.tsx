
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Handle return to appropriate location based on the current path
  const handleReturn = () => {
    // Check if we're in a specific section
    if (location.pathname.includes('/designer/')) {
      navigate('/designer/projects');
    } else if (location.pathname.includes('/admin/')) {
      navigate('/admin/dashboard');
    } else if (location.pathname.includes('/client/')) {
      navigate('/client/projects');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Button 
          onClick={handleReturn}
          className="bg-blue-500 hover:bg-blue-700 text-white"
        >
          Return to Projects
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
