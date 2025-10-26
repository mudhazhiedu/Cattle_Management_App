const bcrypt = require('bcryptjs');
const { User } = require('../models');

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        fullName: 'Farm Administrator',
        role: 'admin'
      });
      console.log('✓ Default admin user created (username: admin, password: admin123)');
    } else {
      console.log('✓ Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

module.exports = seedAdmin;
