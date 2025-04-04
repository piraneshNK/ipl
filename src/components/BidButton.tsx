
import React from 'react';
import { Button } from "@/components/ui/button";

interface BidButtonProps {
  amount: number;
  onClick: () => void;
  disabled?: boolean;
}

const BidButton: React.FC<BidButtonProps> = ({ amount, onClick, disabled }) => {
  const formatAmount = (value: number) => {
    if (value >= 100) {
      return `₹${value / 100} Cr`;
    }
    return `₹${value}L`;
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all"
    >
      {formatAmount(amount)}
    </Button>
  );
};

export default BidButton;
