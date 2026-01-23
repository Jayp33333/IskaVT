import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LOGBOOK_ENTRY_ID_KEY = 'logbookEntryId';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
    
    // If no logbook entry exists, redirect to home
    if (!entryId) {
      navigate('/', { replace: true });
    }
  }, [navigate, location.pathname]);

  // Check if entry exists before rendering
  const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
  
  // Don't render children if no entry exists (will redirect)
  if (!entryId) {
    return null;
  }

  return <>{children}</>;
};
