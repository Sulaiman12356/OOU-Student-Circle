import React from 'react';
import { OpportunitiesBrowse } from '../../components/opportunities/OpportunitiesBrowse';

interface StudentJobsBrowsePageProps {
  onNavigate?: (path: string) => void;
  onNavigateMessage?: (creatorId: string, jobId?: string) => void;
}

export const StudentJobsBrowsePage: React.FC<StudentJobsBrowsePageProps> = ({
  onNavigate,
  onNavigateMessage
}) => {
  return (
    <OpportunitiesBrowse 
      onNavigate={onNavigate} 
      onNavigateMessage={onNavigateMessage}
    />
  );
};
