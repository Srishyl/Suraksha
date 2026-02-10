import axios from 'axios';

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const userData = localStorage.getItem('safetyGuardianUser');
        if (userData) {
            const { access_token } = JSON.parse(userData);
            if (access_token) {
                config.headers.Authorization = `Bearer ${access_token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const loginUser = async (email, password) => {
    try {
        // Backend key is 'login' for URL, but expects form-data
        const params = new URLSearchParams();
        params.append('username', email); // OAuth2 expects username
        params.append('password', password);

        const response = await api.post('/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Transform backend response to match our app's user structure expectation if needed
        // Backend returns: { access_token, token_type }
        // We might want to fetch user profile immediately or store this
        // For now, return as is, but we might need to fetch user details separately or 
        // if the backend `login` response *only* has token, the UI showing "Welcome User" won't work 
        // unless we decoded the token or fetched profile.
        // Let's assume we need to fetch profile after login.

        return { success: true, ...response.data, email: email };
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const registerUser = async (name, email, password) => {
    try {
        const response = await api.post('/register', { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const saveContacts = async (data) => {
    try {
        const response = await api.post('/emergency', {
            contacts: [
                { name: data.primaryName, phone: data.primaryPhone, email: data.primaryEmail, is_primary: true },
                ...(data.secondaryName ? [{ name: data.secondaryName, phone: data.secondaryPhone, email: data.secondaryEmail, is_primary: false }] : [])
            ]
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getUserContacts = async (userId) => {
    try {
        const response = await api.get(`/contacts`);
        // Backend returns: { count, contacts: [...] }
        // Frontend expects: { success, contacts: { primaryName... } }
        // We need to map it.
        const contacts = response.data.contacts || [];
        const primary = contacts.find(c => c.is_primary) || {};
        const secondary = contacts.find(c => !c.is_primary) || {};

        return {
            success: true,
            contacts: {
                primaryName: primary.name,
                primaryPhone: primary.phone,
                primaryEmail: primary.email,
                secondaryName: secondary.name,
                secondaryPhone: secondary.phone,
                secondaryEmail: secondary.email
            }
        };
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const createAlert = async (data) => {
    try {
        // Backend expects FormData for /alerts
        const formData = new FormData();
        formData.append('location', JSON.stringify(data.location || {}));
        formData.append('risk_level', data.risk_level);
        // We don't have video/audio for panic button yet, so we won't append them
        // Backend MUST be updated to allow optional video/audio

        const response = await api.post('/alerts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getAlerts = async (userId) => {
    try {
        const response = await api.get(`/alerts`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export default api;
