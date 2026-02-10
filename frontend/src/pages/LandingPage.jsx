import React from 'react';
import { FaRocket, FaShieldAlt, FaLocationArrow, FaBell } from 'react-icons/fa';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="container mx-auto px-4 pt-20 pb-10">
            {/* Landing Section */}
            <section className="flex flex-col md:flex-row items-center justify-between py-16">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Your Personal Safety Companion</h1>
                    <p className="text-lg text-purple-200 mb-8">Stay protected with risk detection and emergency alerts.</p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={onGetStarted}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold hover:shadow-lg transform hover:scale-105 transition-all flex items-center"
                        >
                            <FaRocket className="mr-2" />
                            Get Started
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="w-full max-w-md relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur-xl opacity-50 -z-10 transform rotate-3"></div>
                        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative z-0">
                            <img
                                src="/hero-safety.png"
                                alt="Safety First"
                                className="w-full h-64 object-cover opacity-80"
                            />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <div className="bg-black/50 backdrop-blur-sm p-8 rounded-xl">
                                    <h3 className="text-2xl font-bold text-white">Feel Safer Instantly</h3>
                                    <p className="text-purple-200">Your emergency contacts are just one tap away</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <h2 className="text-3xl font-bold text-white text-center mb-12">How Safety Guardian Protects You</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:shadow-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                            <FaShieldAlt className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Real Time Monitoring</h3>
                        <p className="text-purple-200">Any time any where.</p>
                    </div>
                    <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:shadow-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
                            <FaLocationArrow className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Google map Tracker</h3>
                        <p className="text-purple-200">Sends the current Location through Email.</p>
                    </div>
                    <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:shadow-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4">
                            <FaBell className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Instant Alerts</h3>
                        <p className="text-purple-200">Notify emergency contacts and authorities with your location immediately.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
