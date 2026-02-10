import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, children, title, icon: Icon, iconColor = 'text-purple-600', iconBgColor = 'bg-white' }) => {

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto z-10 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        {(title || Icon) && (
                            <div className="text-center mb-6">
                                {Icon && (
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${iconBgColor} ${iconColor} mb-4 shadow-lg`}>
                                        <Icon className="text-2xl text-white" />
                                    </div>
                                )}
                                {title && (
                                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                                )}
                                {children.find(child => child.type === 'p') /* Hack to show subtitle if passed as first p tag */}
                            </div>
                        )}

                        {/* Filter out the subtitle p tag if we showed it above, purely logic based on assumption children are passed */}
                        {/* Alternatively, just render children and let the parent handle the header structure inside children if complex */}
                        {/* I will keep it simple: render children, but the modal header part from Frontend.html is quite standard so I should support it */}
                        {/* Actually, looking at Frontend.html, the structure is inconsistent (sometimes icon bg is indigo, sometimes purple, sometimes red). */}
                        {/* I'll let the specific modal implementations handle the header content inside children to be more flexible, or pass props. */}
                        {/* Let's revert to a simpler Container usage where I pass the header elements as props or children. */}
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
