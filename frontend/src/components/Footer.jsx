import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
    const socialLinks = [
        {
            icon: <FaGithub />,
            href: "https://github.com/suryas1805",
            label: "GitHub",
            color: "hover:text-gray-200",
        },
        {
            icon: <FaLinkedin />,
            href: "https://www.linkedin.com/in/surya-s1805",
            label: "LinkedIn",
            color: "hover:text-blue-500",
        },
        {
            icon: <FaEnvelope />,
            href: "mailto:suryaselvam1805@gmail.com",
            label: "Email",
            color: "hover:text-red-400",
        },
    ];

    return (
        <footer className="bg-gray-700 text-gray-400 py-8 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
            {/* Background gradient & subtle pattern */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-gray-800 via-gray-900 to-black opacity-50 animate-gradient-x" />

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Left */}
                <motion.p
                    className="text-center md:text-left text-sm sm:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    © {new Date().getFullYear()} Surya S. All rights reserved.
                </motion.p>

                {/* Right - Social Links */}
                <motion.div
                    className="flex space-x-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {socialLinks.map((link, i) => (
                        <motion.a
                            key={i}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.label}
                            className={`text-2xl sm:text-3xl transition-transform duration-300 hover:scale-125 ${link.color}`}
                            whileHover={{ rotate: 15, scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {link.icon}
                        </motion.a>
                    ))}
                </motion.div>
            </div>

            {/* Optional small animated line or divider */}
            <motion.div
                className="mt-6 h-0.5 bg-teal-500 rounded-full mx-auto w-24 sm:w-32"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1 }}
            />
        </footer>
    );
}
