import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenLogin, onOpenSignup }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-black/30 backdrop-blur-lg text-white shadow-lg fixed w-full z-10 transition-all duration-300">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 group">
                    <FaShieldAlt className="text-2xl text-purple-400 group-hover:text-purple-300 transition-colors" />
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">SURAKSHA</span>
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition-all transform hover:scale-105 flex items-center shadow-md hover:shadow-lg"
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onOpenLogin}
                                className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center shadow-md hover:shadow-lg"
                            >
                                <FaSignInAlt className="mr-2" />
                                Login
                            </button>
                            <button
                                onClick={onOpenSignup}
                                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center shadow-md hover:shadow-lg"
                            >
                                <FaUserPlus className="mr-2" />
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
