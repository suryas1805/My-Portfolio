import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Projects", href: "#projects" },
        { name: "Resume", href: "#resume" },
        { name: "Contact", href: "#contact" },
    ];

    const handleNavToggle = () => setIsOpen(!isOpen);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -20;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md text-white shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4 md:p-6">
                {/* Logo / Name */}
                <h1 className="font-bold text-2xl md:text-3xl text-teal-400 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Surya S
                </h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.href.replace("#", ""))}
                            className="hover:text-teal-400 transition-colors duration-300 font-medium"
                        >
                            {link.name}
                        </button>
                    ))}

                    {user ? (
                        <>
                            <button onClick={() => navigate("/admin")} className="hover:text-teal-400 font-medium transition">
                                Admin Panel
                            </button>
                            <button onClick={logout} className="hover:text-red-400 font-medium transition">
                                Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => navigate("/login")} className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded shadow transition text-sm sm:text-base cursor-pointer font-semibold">
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={handleNavToggle} className="text-2xl text-teal-400 focus:outline-none">
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black/90 backdrop-blur-md text-white flex flex-col items-center py-6 space-y-6 animate-slideDown">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => {
                                scrollToSection(link.href.replace("#", ""));
                                setIsOpen(false);
                            }}
                            className="text-lg hover:text-teal-400 transition-colors duration-300 font-medium"
                        >
                            {link.name}
                        </button>
                    ))}

                    {user ? (
                        <>
                            <button onClick={() => { navigate("/admin"); setIsOpen(false); }} className="hover:text-teal-400 font-medium transition">
                                Admin Panel
                            </button>
                            <button onClick={() => { logout(); setIsOpen(false); }} className="hover:text-red-400 font-medium transition">
                                Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => { navigate("/login"); setIsOpen(false); }} className="hover:text-teal-400 font-medium transition">
                            Login
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}