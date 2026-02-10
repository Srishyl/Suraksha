import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaAddressBook, FaHistory, FaExclamationTriangle } from 'react-icons/fa';
import AlertHistory from '../components/AlertHistory';
import ContactsModal from '../components/ContactsModal';
import AlertModal from '../components/AlertModal';
import { useAuth } from '../context/AuthContext';
import { getAlerts } from '../services/api';

const DashboardPage = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [isContactsOpen, setIsContactsOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        if (user) {
            loadAlerts();
            // Poll for alerts every minute
            const interval = setInterval(loadAlerts, 60000);
            return () => clearInterval(interval);
        }
    }, [user, refreshTrigger]);

    const loadAlerts = async () => {
        try {
            const data = await getAlerts(user.user_id);
            if (data.success && data.alerts) {
                setAlerts(data.alerts);
            }
        } catch (error) {
            console.error('Error loading alerts:', error);
        }
    };

    const handleAlertCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="container mx-auto px-4 pt-20 pb-10">
            {/* Mobile Alert Button - Fixed at Bottom */}
            <div className="fixed bottom-10 inset-x-0 z-20 px-4 flex justify-center pointer-events-none">
                <button
                    onClick={() => setIsAlertOpen(true)}
                    className="w-full max-w-xs py-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-full text-white text-lg font-bold flex items-center justify-center shadow-lg transform hover:scale-105 transition-all animate-pulse pointer-events-auto"
                >
                    <FaExclamationTriangle className="mr-2 text-xl" />
                    ALERT NOW
                </button>
            </div>

            {/* User Info Card */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-white/10">
                <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                        <FaUserCircle className="mr-3 text-3xl text-purple-400" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Welcome, <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{user?.name || 'User'}</span></h2>
                            <p className="text-purple-200 text-sm">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsContactsOpen(true)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-bold flex items-center text-sm transition-all"
                        >
                            <FaAddressBook className="mr-2" />
                            Contacts
                        </button>
                    </div>
                </div>
            </div>

            {/* Alert History */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-5 border border-white/10 mb-20">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <FaHistory className="mr-2 text-purple-400" />
                        Alert History
                    </h3>
                    <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="text-xs text-purple-300 hover:text-white">
                        Refresh
                    </button>
                </div>

                <AlertHistory alerts={alerts} />
            </div>

            <ContactsModal
                isOpen={isContactsOpen}
                onClose={() => setIsContactsOpen(false)}
            />

            <AlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onAlertCreated={handleAlertCreated}
            />
        </div>
    );
};

export default DashboardPage;
