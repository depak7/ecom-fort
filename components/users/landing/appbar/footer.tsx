import { Globe, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/d2741c6e-1b6e-46c7-986e-a2a09771c603.png" 
              alt="Ecomfort Logo" 
              className="h-12"
            />
            <p className="text-gray-400">
              Your one-stop destination for local fashion stores
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                deepakfordev@gmail.com
              </li>
              <li className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                ecom-fort.vercel.app
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 Ecomfort. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
