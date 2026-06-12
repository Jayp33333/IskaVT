import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LOGBOOK_ENTRY_ID_KEY,
  clearLogbookSession,
} from '../constants/logbookSession';
import { markDeviceVisitCheckedOut } from '../constants/logbookDeviceHistory';
import { logbookAPI } from '../services/api';
import { API_BASE_URL } from '../services/apiClient';

const LOGBOOK_SKIP_PAGEHIDE_KEY = 'logbook-skip-pagehide';

/** Ends the logbook session via a request that can complete after the page unloads. */
function endLogbookSessionKeepalive(entryId: string): void {
  const timeOut = new Date().toISOString();
  markDeviceVisitCheckedOut(entryId, timeOut);
  fetch(`${API_BASE_URL}/logbook/${entryId}/timeout`, {
    method: 'PATCH',
    body: JSON.stringify({}),
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
  }).catch(() => {
    // Best-effort while the page is unloading.
  });
  clearLogbookSession();
}

let unloadListenersRegistered = false;

function registerBrowserUnloadListeners(
  getIsUpdating: () => boolean,
  getIsOnExperience: () => boolean
): void {
  if (unloadListenersRegistered || typeof window === 'undefined') return;
  unloadListenersRegistered = true;

  const markReloadIntent = (event: KeyboardEvent) => {
    if (event.key !== 'F5' && !((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r')) {
      return;
    }
    sessionStorage.setItem(LOGBOOK_SKIP_PAGEHIDE_KEY, '1');
  };

  const onPageShow = () => {
    sessionStorage.removeItem(LOGBOOK_SKIP_PAGEHIDE_KEY);
  };

  const onPageHide = (event: PageTransitionEvent) => {
    if (event.persisted || !getIsOnExperience()) return;

    if (sessionStorage.getItem(LOGBOOK_SKIP_PAGEHIDE_KEY)) {
      sessionStorage.removeItem(LOGBOOK_SKIP_PAGEHIDE_KEY);
      return;
    }

    const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
    if (!entryId || getIsUpdating()) return;

    endLogbookSessionKeepalive(entryId);
  };

  window.addEventListener('keydown', markReloadIntent);
  window.addEventListener('pageshow', onPageShow);
  window.addEventListener('pagehide', onPageHide);
}

export const useLogbookTimeout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isUpdatingRef = useRef(false);
  const isOnExperienceRef = useRef(location.pathname === '/experience');
  const previousPathRef = useRef<string | null>(null);

  isOnExperienceRef.current = location.pathname === '/experience';

  const updateTimeout = useCallback(async (shouldNavigate = false) => {
    const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
    
    if (!entryId || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    try {
      const response = await logbookAPI.updateTimeout(entryId);
      const timeOut = response.data.timeOut ?? new Date().toISOString();
      markDeviceVisitCheckedOut(entryId, timeOut);
      clearLogbookSession();

      if (shouldNavigate) {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to update timeout:', error);
      clearLogbookSession();
    } finally {
      isUpdatingRef.current = false;
    }
  }, [navigate]);

  useEffect(() => {
    registerBrowserUnloadListeners(
      () => isUpdatingRef.current,
      () => isOnExperienceRef.current
    );
  }, []);

  useEffect(() => {
    if (previousPathRef.current === null) {
      previousPathRef.current = location.pathname;
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;

    if (previousPath === '/experience' && currentPath !== '/experience') {
      const entryId = localStorage.getItem(LOGBOOK_ENTRY_ID_KEY);
      
      if (entryId && !isUpdatingRef.current) {
        endLogbookSessionKeepalive(entryId);
      }
    }

    previousPathRef.current = currentPath;
  }, [location.pathname]);

  return { updateTimeout };
};
