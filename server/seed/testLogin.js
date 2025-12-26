// server/seed/testLogin.js
import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('🔄 Testing login with demo@gmail.com...\n');
    
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: 'demo@gmail.com',
      password: 'admin'
    });

    console.log('✅ Login Successful!');
    console.log('\n📋 Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Login Failed!');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
  }
};

testLogin();
