import React, { useState } from 'react';
import { FaExclamationTriangle, FaBell } from 'react-icons/fa';
import Modal from './Modal';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { createAlert } from '../services/api';

const AlertModal = ({ isOpen, onClose, onAlertCreated }) => {
    const { user } = useAuth();
    const [riskLevel, setRiskLevel] = useState('risk');
    const [includeLocation, setIncludeLocation] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const sendAlert = async (location = { latitude: 0, longitude: 0 }) => {
            try {
                const data = await createAlert({
                    user_id: user.user_id,
                    risk_level: riskLevel,
                    location
                });

                if (data.success) {
                    setMessage({ text: 'Alert sent successfully!', type: 'success' });
                    if (onAlertCreated) onAlertCreated();
                    setTimeout(() => {
                        onClose();
                        // Reset form
                        setRiskLevel('risk');
                        setIncludeLocation(true);
                        setMessage({ text: '', type: '' });
                    }, 2000);
                } else {
                    setMessage({ text: data.message || 'Failed to send alert', type: 'error' });
                }
            } catch (err) {
                setMessage({ text: err.message || 'Failed to send alert. Please try again.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (includeLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    sendAlert({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    sendAlert(); // Send without precise location if geolocation fails
                }
            );
        } else {
            sendAlert();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            icon={FaExclamationTriangle}
            title="Create Alert"
            iconBgColor="bg-red-600"
        >
            <p className="text-purple-200 text-center mb-6">Select the risk level to send an alert</p>

            <form onSubmit={handleSubmit}>
                {message.text && (
                    <div className={`p-3 rounded-lg mb-4 text-center ${message.type === 'error' ? 'text-red-400 bg-red-900/30' : 'text-green-400 bg-green-900/30'}`}>
                        {message.text}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-purple-200 mb-2">Risk Level</label>
                    <select
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="risk">Low Risk</option>
                        <option value="risky">Medium Risk</option>
                        <option value="high risk">High Risk</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeLocation}
                            onChange={(e) => setIncludeLocation(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-purple-200">Include my current location</span>
                    </label>
                </div>

                <Button
                    type="submit"
                    variant="danger"
                    className="w-full py-3"
                    disabled={loading}
                >
                    <FaBell className="mr-2" />
                    {loading ? 'Sending Alert...' : 'Send Alert'}
                </Button>
            </form>
        </Modal>
    );
};

export default AlertModal;
