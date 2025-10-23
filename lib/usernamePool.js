/**
 * Username Pool Manager
 * 
 * Manages a pool of pre-generated Sanskrit-based usernames.
 * Ensures uniqueness by tracking used usernames in the database.
 */

const fs = require('fs');
const path = require('path');

class UsernamePool {
  constructor() {
    this.poolPath = path.join(__dirname, 'username_pool.txt');
    this.pool = null;
  }

  /**
   * Load username pool from file (lazy loaded)
   */
  loadPool() {
    if (this.pool) return this.pool;
    
    const content = fs.readFileSync(this.poolPath, 'utf-8');
    this.pool = content.trim().split('\n').filter(Boolean);
    return this.pool;
  }

  /**
   * Get a random username from the pool
   */
  getRandomUsername() {
    const pool = this.loadPool();
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  /**
   * Get multiple random usernames (for checking availability)
   */
  getRandomUsernames(count = 10) {
    const pool = this.loadPool();
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Get total pool size
   */
  getPoolSize() {
    return this.loadPool().length;
  }
}

// Export singleton instance
module.exports = new UsernamePool();
