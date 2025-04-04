
import React from 'react';
import { Card } from "@/components/ui/card";
import { Team } from '@/data/teams';

interface TeamCardProps {
  team: Team;
  selected: boolean;
  onClick: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, selected, onClick }) => {
  return (
    <Card 
      className={`cursor-pointer hover:scale-105 transition-transform duration-200 p-4 flex flex-col items-center gap-2 ${team.colorClass} ${team.textColorClass} ${selected ? 'ring-4 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <h3 className="font-bold text-lg">{team.shortName}</h3>
      <p className="text-xs font-medium">{team.name}</p>
    </Card>
  );
};

export default TeamCard;
