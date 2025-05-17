
import React from 'react';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, ShoppingCart } from 'lucide-react';

const Showroom = () => {
  const { toast } = useToast();

  const handleViewDetails = (id: string, name: string) => {
    toast({
      title: "Product details",
      description: `Viewing details for ${name}`,
    });
    // Navigate to product page (to be implemented)
  };

  const handleAddToCart = (id: string, name: string) => {
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
    });
  };

  // Sample predefined projects
  const showcaseProjects = [
    {
      id: '1',
      name: 'Modern Kitchen Set',
      type: 'Kitchen',
      image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1000',
      price: 2499,
      description: 'Complete modern kitchen set with island and smart storage solutions'
    },
    {
      id: '2',
      name: 'Minimalist Wardrobe',
      type: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1000',
      price: 1250,
      description: 'Spacious wardrobe with sliding doors and internal organizers'
    },
    {
      id: '3',
      name: 'Office Workstation',
      type: 'Office',
      image: 'https://images.unsplash.com/photo-1593476123561-9516f2097158?q=80&w=1000',
      price: 799,
      description: 'Complete desk setup with storage and cable management'
    },
    {
      id: '4',
      name: 'Bathroom Vanity',
      type: 'Bathroom',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000',
      price: 649,
      description: 'Modern bathroom vanity with sink and storage'
    },
    {
      id: '5',
      name: 'Living Room Entertainment Center',
      type: 'Living Room',
      image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1000',
      price: 1899,
      description: 'Media center with TV mount, shelving and cabinets'
    },
    {
      id: '6',
      name: 'Kid\'s Room Storage',
      type: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=1000',
      price: 950,
      description: 'Colorful storage solution for children\'s rooms'
    }
  ];
  
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-semibold text-heffa-900">Furniture Showroom</h1>
            <p className="text-heffa-600">Browse our collection of predefined furniture projects</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} /> Filter
            </Button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {['All', 'Kitchen', 'Living Room', 'Bedroom', 'Bathroom', 'Office', 'Kids'].map((category) => (
            <Button 
              key={category} 
              variant={category === 'All' ? "default" : "outline"}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <p className="text-sm text-heffa-600">{project.type}</p>
                  </div>
                  <span className="font-bold text-heffa-700">${project.price}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewDetails(project.id, project.name)}
                >
                  View Details
                </Button>
                <Button 
                  onClick={() => handleAddToCart(project.id, project.name)}
                  className="bg-heffa-600 hover:bg-heffa-700"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
};

export default Showroom;
