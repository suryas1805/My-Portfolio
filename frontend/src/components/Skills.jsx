import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import {
    FaReact,
    FaNodeJs,
    FaDatabase,
    FaPython,
    FaGitAlt,
    FaBootstrap
} from "react-icons/fa";
import {
    SiJavascript,
    SiHtml5,
    SiCss3,
    SiExpress,
    SiDjango,
    SiFlask,
    SiMongodb,
    SiMysql,
    SiPostgresql,
    SiSqlite,
    SiTailwindcss,
    SiPostman,
    SiShadcnui,
    SiExpo,
    SiTypescript,
    SiAmazons3
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { TbApi } from "react-icons/tb";

export default function Skills() {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        api.get("/skills").then((res) => setSkills(res?.data));
    }, []);

    // Map skill names to icons
    const getSkillIcon = (name) => {
        const lowerName = name.toLowerCase();

        switch (lowerName) {
            case "javascript":
                return <SiJavascript className="text-yellow-400 text-3xl" />;
            case "python":
                return <FaPython className="text-blue-400 text-3xl" />;
            case "react":
                return <FaReact className="text-cyan-400 text-3xl" />;
            case "html":
                return <SiHtml5 className="text-orange-500 text-3xl" />;
            case "css":
                return <SiCss3 className="text-blue-500 text-3xl" />;
            case "react native":
                return <FaReact className="text-cyan-400 text-3xl" />;
            case "node js":
                return <FaNodeJs className="text-green-500 text-3xl" />;
            case "express":
                return <SiExpress className="text-gray-300 text-3xl" />;
            case "django":
                return <SiDjango className="text-green-700 text-3xl" />;
            case "flask":
                return <SiFlask className="text-gray-300 text-3xl" />;
            case "mongodb":
                return <SiMongodb className="text-green-500 text-3xl" />;
            case "mysql":
                return <SiMysql className="text-blue-500 text-3xl" />;
            case "postgresql":
                return <SiPostgresql className="text-blue-700 text-3xl" />;
            case "sqlite":
                return <SiSqlite className="text-blue-400 text-3xl" />;
            case "tailwind css":
                return <SiTailwindcss className="text-cyan-400 text-3xl" />;
            case "bootstrap":
                return <FaBootstrap className="text-purple-500 text-3xl" />;
            case "shadcn/ui":
                return <SiShadcnui className="text-white text-3xl" />;
            case "react-redux":
                return <FaReact className="text-purple-400 text-3xl" />;
            case "restful apis":
                return <TbApi className="text-green-400 text-3xl" />;
            case "git/github":
                return <FaGitAlt className="text-orange-500 text-3xl" />;
            case "vs code":
                return <VscVscode className="text-blue-500 text-3xl" />
            case "postman":
                return <SiPostman className="text-orange-500 text-3xl" />;
            case "expo":
                return <SiExpo className="text-3xl" color="#000020" />;
            case "typescript":
                return <SiTypescript className="text-3xl" color="#3178C6" />
            case "aws s3":
                return <SiAmazons3 className="text-3xl" color="#FF9900" />;
            default:
                return <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">?</div>;
        }
    };

    return (
        <section
            id="skills"
            className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white"
        >
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl sm:text-5xl font-bold mb-12">
                    My <span className="text-teal-400">Skills</span>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {skills && skills?.map((s, index) => (
                        <motion.div
                            key={s?._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center p-6 bg-gradient-to-tr from-gray-700 via-gray-600 to-gray-700 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
                        >
                            <div className="mb-4">{getSkillIcon(s?.name)}</div>
                            <p className="font-semibold text-lg text-white text-center">{s?.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}