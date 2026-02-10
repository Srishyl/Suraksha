import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import Modal from './Modal';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { registerUser, loginUser } from '../services/api';

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await registerUser(name, email, password);
            if (data.success) {
                // Auto login after signup
                const loginData = await loginUser(email, password);
                if (loginData.success) {
                    login(loginData);
                    onClose();
                } else {
                    onSwitchToLogin();
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            icon={FaUserPlus}
            title="Create Account"
            iconBgColor="bg-purple-600"
        >
            <p className="text-purple-200 text-center mb-6">Join Safety Guardian today</p>

            <form onSubmit={handleSubmit}>
                {error && <div className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-center">{error}</div>}
                <div className="mb-4">
                    <label className="block text-purple-200 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-purple-200 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-purple-200 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>
            <div className="text-center mt-6">
                <p className="text-purple-200">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="text-purple-400 hover:text-purple-300 font-bold">
                        Login
                    </button>
                </p>
            </div>
        </Modal>
    );
};

export default SignupModal;
