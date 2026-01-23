const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export type LogbookEntry = {
  fullName: string;
  visitorType: string;
  purpose: string;
  destination: string;
  date?: string;
  timeIn?: string;
  timeOut?: string;
};

export const logbookAPI = {
  async createEntry(entry: LogbookEntry) {
    const response = await fetch(`${API_BASE_URL}/logbook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create logbook entry');
    }

    return response.json();
  },

  async updateTimeout(entryId: string) {
    const response = await fetch(`${API_BASE_URL}/logbook/${entryId}/timeout`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update timeout');
    }

    return response.json();
  },

  async getEntries(page = 1, limit = 50) {
    const response = await fetch(`${API_BASE_URL}/logbook?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch logbook entries');
    }

    return response.json();
  },
};
