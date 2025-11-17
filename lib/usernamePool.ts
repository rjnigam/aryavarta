/**
 * Username Pool Manager
 * 
 * Manages a pool of pre-generated Sanskrit-based usernames.
 * Ensures uniqueness by tracking used usernames in the database.
 */

import fs from 'fs';
import path from 'path';

class UsernamePool {
  private pool: string[] | null = null;
  private poolPath: string;

  constructor() {
    this.poolPath = path.join(process.cwd(), 'scripts', 'username_pool.txt');
  }

  /**
   * Load username pool from file (lazy loaded)
   */
  private loadPool(): string[] {
    if (this.pool) return this.pool;
    
    try {
      const content = fs.readFileSync(this.poolPath, 'utf-8');
      this.pool = content.trim().split('\n').filter(Boolean);
      return this.pool;
    } catch (error) {
      console.error('Failed to load username pool:', error);
      throw new Error('Username pool not available');
    }
  }

  /**
   * Get a random username from the pool
   */
  getRandomUsername(): string {
    const pool = this.loadPool();
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  /**
   * Get multiple random usernames (for checking availability)
   */
  getRandomUsernames(count: number = 10): string[] {
    const pool = this.loadPool();
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Get total pool size
   */
  getPoolSize(): number {
    return this.loadPool().length;
  }
}

// Export singleton instance
export const usernamePool = new UsernamePool();
