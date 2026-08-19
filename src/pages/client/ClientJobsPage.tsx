import React from 'react';
import { OpportunityOwnerDashboard } from '../../components/opportunities/OpportunityOwnerDashboard';

interface ClientJobsPageProps {
  onNavigate: (path: string) => void;
  onNavigateMessage?: (recipientId: string, jobId?: string) => void;
}

export const ClientJobsPage: React.FC<ClientJobsPageProps> = ({ 
  onNavigate,
  onNavigateMessage 
}) => {
  return (
    <OpportunityOwnerDashboard 
      onNavigate={onNavigate} 
      onNavigateMessage={onNavigateMessage} 
    />
  );
};
