
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "IPL Auction Game 2025", 
  showBackButton = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="w-full bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="font-bold text-2xl md:text-3xl title-gradient">
            {title}
          </h1>
        </div>
        <div>
          {location.pathname !== '/' && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
