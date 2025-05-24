import type { StorageServiceType } from '../../types/auth-types';

class StorageService implements StorageServiceType {
  /**
   * Retrieve an item from local storage
   * @param {string} key - The key of the item to retrieve
   * @returns {Promise<string | null>} - The value of the item, or null if not found
   */
  async getItem(key: string): Promise<string | null> {
    try {
      // Check if window is defined (client-side)
      if (typeof window !== 'undefined') {
        const value = localStorage.getItem(key);
        return value ? value : null;
      }
      return null; // Return null on server-side
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  /**
   * Store an item in local storage
   * @param {string} key - The key of the item to store
   * @param {string} value - The value of the item to store
   * @returns {Promise<void>}
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  }

  /**
   * Remove an item from local storage
   * @param {string} key - The key of the item to remove
   * @returns {Promise<void>}
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }

  /**
   * Clear all items from local storage
   * @returns {Promise<void>}
   */
  async clear(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
      localStorage.clear();
      }
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
}

export const storageService: StorageServiceType = new StorageService();
