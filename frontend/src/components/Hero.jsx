import React from "react";
import { motion } from "framer-motion";

export default function Hero() {

    const handleScroll = () => {
        const nextSection = document.getElementById("skills");
        if (nextSection) {
            const yOffset = -80;
            const y = nextSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    return (
        <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4 md:px-8 pt-24">
            {/* Added pt-24 to offset fixed navbar (adjust if navbar height changes) */}

            {/* Animated Name */}
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2"
            >
                Hi, I'm <span className="text-teal-400">Surya S</span>
            </motion.h1>

            {/* Role & Location */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-md sm:text-lg md:text-xl mb-4 mt-2"
            >
                Software Engineer | Full Stack Developer | MERN Stack
            </motion.p>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-sm sm:text-md md:text-lg mb-6"
            >
                Chennai, Tamil Nadu |{" "}
                <a href="tel:+917448414034" className="text-teal-400 hover:underline">
                    +91-7448414034
                </a>{" "}
                /{" "}
                <a href="tel:+918428546654" className="text-teal-400 hover:underline">
                    +91-8428546654
                </a>{" "}
                |{" "}
                <a
                    href="mailto:suryaselvam1805@gmail.com"
                    className="text-teal-400 hover:underline ml-1"
                >
                    suryaselvam1805@gmail.com
                </a>{" "}
                |{" "}
                <a
                    href="https://www.linkedin.com/in/surya-s1805"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline ml-1"
                >
                    LinkedIn
                </a>
            </motion.p>

            {/* Professional Summary Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="bg-gray-700 bg-opacity-70 backdrop-blur-md rounded-lg p-6 md:p-8 max-w-4xl text-left shadow-lg"
            >
                <h2 className="text-teal-400 font-bold text-lg md:text-xl mb-2">
                    Professional Summary
                </h2>
                <p className="text-sm sm:text-md md:text-lg text-gray-200 leading-relaxed">
                    Full Stack Developer with 1.8+ years of hands-on experience specializing in React, Node.js, Express, and MongoDB, complemented by 2 years in purchasing and operations engineering. Successfully transitioned into software development, bringing strong business acumen and problem-solving skills to technical projects. Contributed to the design and implementation of 3 management systems (LMS, SMS, PMS) across education, automotive, and real estate industries, achieving efficiency gains of 40–70%. Skilled in building scalable web and mobile applications with authentication, payment integrations, and responsive UI/UX. Passionate about delivering clean, efficient code and user-focused solutions that align technology with business growth.
                </p>
            </motion.div>

            {/* Scroll Down Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="mt-8 text-gray-400 animate-bounce cursor-pointer"
                onClick={handleScroll}
            >
                Scroll Down
            </motion.div>
        </section>
    );
}
