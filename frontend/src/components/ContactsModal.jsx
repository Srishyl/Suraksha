import React, { useState, useEffect } from 'react';
import { FaAddressBook, FaSave } from 'react-icons/fa';
import Modal from './Modal';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { saveContacts, getUserContacts } from '../services/api';

const ContactsModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [primaryName, setPrimaryName] = useState('');
    const [primaryPhone, setPrimaryPhone] = useState('');
    const [primaryEmail, setPrimaryEmail] = useState('');
    const [secondaryName, setSecondaryName] = useState('');
    const [secondaryPhone, setSecondaryPhone] = useState('');
    const [secondaryEmail, setSecondaryEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (isOpen && user) {
            loadContacts();
        }
    }, [isOpen, user]);

    const loadContacts = async () => {
        try {
            const data = await getUserContacts(user.user_id);
            if (data.success && data.contacts) {
                setPrimaryName(data.contacts.primaryName || '');
                setPrimaryPhone(data.contacts.primaryPhone || '');
                setPrimaryEmail(data.contacts.primaryEmail || '');
                setSecondaryName(data.contacts.secondaryName || '');
                setSecondaryPhone(data.contacts.secondaryPhone || '');
                setSecondaryEmail(data.contacts.secondaryEmail || '');
            }
        } catch (error) {
            console.error('Error loading contacts', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const data = await saveContacts({
                user_id: user.user_id,
                primaryName,
                primaryPhone,
                primaryEmail,
                secondaryName,
                secondaryPhone,
                secondaryEmail
            });

            if (data.success) {
                setMessage({ text: 'Emergency contacts saved successfully!', type: 'success' });
                setTimeout(() => onClose(), 2000);
            } else {
                setMessage({ text: data.message || 'Failed to save contacts', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: err.message || 'Failed to save contacts', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            icon={FaAddressBook}
            title="Emergency Contacts"
            iconBgColor="bg-indigo-600"
        >
            <p className="text-purple-200 text-center mb-6">Who should we contact in an emergency?</p>

            <form onSubmit={handleSubmit}>
                {message.text && (
                    <div className={`p-3 rounded-lg mb-4 text-center ${message.type === 'error' ? 'text-red-400 bg-red-900/30' : 'text-green-400 bg-green-900/30'}`}>
                        {message.text}
                    </div>
                )}

                <div className="border-b border-white/10 pb-6 mb-6">
                    <h4 className="text-lg font-bold text-white mb-4">Primary Contact</h4>
                    <div className="mb-4">
                        <label className="block text-purple-200 mb-2">Name</label>
                        <input
                            type="text"
                            value={primaryName}
                            onChange={(e) => setPrimaryName(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-200 mb-2">Phone</label>
                        <input
                            type="tel"
                            value={primaryPhone}
                            onChange={(e) => setPrimaryPhone(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-200 mb-2">Email</label>
                        <input
                            type="email"
                            value={primaryEmail}
                            onChange={(e) => setPrimaryEmail(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-bold text-white mb-4">Secondary Contact (Optional)</h4>
                    <div className="mb-4">
                        <label className="block text-purple-200 mb-2">Name</label>
                        <input
                            type="text"
                            value={secondaryName}
                            onChange={(e) => setSecondaryName(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-purple-200 mb-2">Phone</label>
                        <input
                            type="tel"
                            value={secondaryPhone}
                            onChange={(e) => setSecondaryPhone(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-purple-200 mb-2">Email</label>
                        <input
                            type="email"
                            value={secondaryEmail}
                            onChange={(e) => setSecondaryEmail(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600"
                    disabled={loading}
                >
                    <FaSave className="mr-2" />
                    {loading ? 'Saving...' : 'Save Contacts'}
                </Button>
            </form>
        </Modal>
    );
};

export default ContactsModal;
