const bcrypt = require('bcryptjs');

async function createHash() {
  const password = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('\n=================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('=================================\n');
  console.log('Run this SQL in MySQL:');
  console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE username = 'admin';`);
  console.log('=================================\n');
}

createHash();