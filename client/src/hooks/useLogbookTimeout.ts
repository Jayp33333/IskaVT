import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logbookAPI } from '../services/api';

const LOGBOOK_ENTRY_ID_KEY = 'logbookEntryId';
const LOGBOOK_TIME_IN_KEY = 'logbookTimeIn';

export const useLogbookTimeout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isUpdatingRef = useRef(false);
  const previousPathRef = useRef<string | null>(null);

  const updateTimeout = useCallback(async (shouldNavigate = false) => {
    const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
    
    if (!entryId || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    try {
      await logbookAPI.updateTimeout(entryId);
      // Clear localStorage after successful timeout update
      localStorage.removeItem(LOGBOOK_ENTRY_ID_KEY);
      localStorage.removeItem(LOGBOOK_TIME_IN_KEY);
      
      if (shouldNavigate) {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to update timeout:', error);
      // Still clear localStorage even if API call fails
      localStorage.removeItem(LOGBOOK_ENTRY_ID_KEY);
      localStorage.removeItem(LOGBOOK_TIME_IN_KEY);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [navigate]);

  // Initialize previous path on mount
  useEffect(() => {
    if (previousPathRef.current === null) {
      previousPathRef.current = location.pathname;
    }
  }, []);

  // Handle automatic timeout when navigating away from /experience
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;

    // If we navigated FROM /experience TO a different route, update timeout
    // On refresh, both will be /experience, so this won't trigger
    if (previousPath === '/experience' && currentPath !== '/experience') {
      const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
      
      if (entryId && !isUpdatingRef.current) {
        // User navigated away from /experience - update timeout
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        fetch(`${apiUrl}/logbook/${entryId}/timeout`, {
          method: 'PATCH',
          body: JSON.stringify({}),
          headers: { 'Content-Type': 'application/json' },
          keepalive: true
        }).catch(() => {
          // Silently fail - we tried our best
        });
        
        // Clear localStorage
        localStorage.removeItem(LOGBOOK_ENTRY_ID_KEY);
        localStorage.removeItem(LOGBOOK_TIME_IN_KEY);
      }
    }

    // Update previous path reference
    previousPathRef.current = currentPath;
  }, [location.pathname]);

  return { updateTimeout };
};
