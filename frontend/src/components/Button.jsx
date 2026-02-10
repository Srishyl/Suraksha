import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', className = '', variant = 'primary', ...props }) => {

    const variants = {
        primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
        secondary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white',
        success: 'bg-gradient-to-r from-green-600 to-teal-600 text-white',
        outline: 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
    };

    const baseClass = "rounded-full font-bold shadow-lg flex items-center justify-center transition-all cursor-pointer";
    // Using framer motion for hover scale instead of just class

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type={type}
            onClick={onClick}
            className={`${baseClass} ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
