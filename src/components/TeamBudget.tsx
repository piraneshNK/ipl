
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface TeamBudgetProps {
  teamName: string;
  teamShortName: string;
  colorClass: string;
  textColorClass: string;
  totalBudget: number;
  remainingBudget: number;
  playersBought: number;
}

const TeamBudget: React.FC<TeamBudgetProps> = ({
  teamName,
  teamShortName,
  colorClass,
  textColorClass,
  totalBudget,
  remainingBudget,
  playersBought,
}) => {
  const percentRemaining = (remainingBudget / totalBudget) * 100;
  const formattedTotal = (totalBudget / 100).toFixed(2);
  const formattedRemaining = (remainingBudget / 100).toFixed(2);
  
  return (
    <div className={`${colorClass} ${textColorClass} rounded-lg p-3 flex items-center`}>
      <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
        <span className="font-bold text-sm">{teamShortName}</span>
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <p className="font-bold">{teamShortName}</p>
          <p className="text-xs">Players: {playersBought}</p>
        </div>
        <div className="mt-1">
          <div className="flex justify-between items-center text-xs">
            <span>₹{formattedRemaining}Cr</span>
            <span>₹{formattedTotal}Cr</span>
          </div>
          <Progress value={percentRemaining} className="h-2 mt-1 bg-white/30" />
        </div>
      </div>
    </div>
  );
};

export default TeamBudget;
