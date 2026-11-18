#!/usr/bin/env node
/**
 * Generates a bcrypt hash for ADMIN_PASSWORD_HASH in .env.
 * Usage: node scripts/hash-password.js "your chosen password"
 */
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js "your chosen password"');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Please choose a password of at least 8 characters.');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log('\nAdd this line to your .env file:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
