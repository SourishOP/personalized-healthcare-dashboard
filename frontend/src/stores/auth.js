import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: null,
        mfaRequired: false,
        mfaSetupRequired: false,
        tempToken: null // For MFA flows
    }),
    actions: {
        async login(email, password) {
            try {
                const res = await axios.post('/api/auth/login', { email, password });

                if (res.data.requireMfaVerify) {
                    this.mfaRequired = true;
                    this.tempToken = res.data.token;
                } else if (res.data.requireMfaSetup) {
                    this.mfaSetupRequired = true;
                    this.tempToken = res.data.token;
                    // Redirect to setup handled by component
                } else {
                    // Should not happen as MFA is mandatory, but fallback:
                    this.setToken(res.data.token);
                }
                return res.data;
            } catch (error) {
                throw error.response?.data?.message || 'Login failed';
            }
        },
        async verifyMfa(code) {
            if (!this.tempToken) throw new Error("No pending session");

            try {
                const res = await axios.post('/api/auth/mfa/verify', { code }, {
                    headers: { Authorization: `Bearer ${this.tempToken}` }
                });

                if (res.data.status === 'success') {
                    this.setToken(res.data.token);
                    this.mfaRequired = false;
                    this.tempToken = null;
                    router.push('/dashboard');
                }
            } catch (error) {
                throw error.response?.data?.message || 'Verification failed';
            }
        },
        setToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            router.push('/login');
        }
    }
})
