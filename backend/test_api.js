const axios = require('axios');

async function testApi() {
    const baseURL = 'http://localhost:5000/api';
    const credentials = { email: 'test_user_' + Date.now() + '@example.com', password: 'Password123!' };

    try {
        console.log(`\n1. Registering new user: ${credentials.email}`);
        const regRes = await axios.post(`${baseURL}/auth/register`, credentials);
        console.log('Register Response:', regRes.data);

        console.log(`\n2. Logging in`);
        const loginRes = await axios.post(`${baseURL}/auth/login`, credentials);
        console.log('Login Response:', loginRes.data);

        const mfaSetupToken = loginRes.data.token;

        console.log(`\n3. Setup MFA`);
        const setupRes = await axios.get(`${baseURL}/auth/mfa/setup`, {
            headers: { Authorization: `Bearer ${mfaSetupToken}` }
        });
        console.log('MFA Setup Response (Secret):', setupRes.data.secret);

        console.log('\nEndpoints responding successfully!');

    } catch (err) {
        console.error('API Test Failed:', err.response ? err.response.data : err.message);
    }
}

testApi();
