import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import dummyProjectImg from "../assets/images/project-dummy.jpg";
import { getImageUrl } from "../utils/imageUtils";

export default function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        api.get("/projects").then((res) => setProjects(res?.data));
    }, []);

    return (
        <section
            id="projects"
            className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white"
        >
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-12">
                    My <span className="text-teal-400">Projects</span>
                </h2>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {projects?.map((p, index) => (
                        <motion.div
                            key={p?._id || index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 flex flex-col border border-gray-700/40"
                        >
                            {/* Project Image */}
                            <div className="relative w-full h-52 overflow-hidden">
                                <img
                                    src={p?.image && getImageUrl(p?.image) || dummyProjectImg}
                                    alt={p?.title}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent"></div>
                            </div>

                            {/* Project Details */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-2xl font-semibold mb-3 text-teal-400">
                                    {p?.title}
                                </h3>

                                {/* Fixed alignment - use relaxed line-height and justified look without weird spacing */}
                                <p className="text-gray-300 mb-6 leading-relaxed tracking-wide text-left">
                                    {p?.description}
                                </p>

                                {/* Tech Stack Section */}
                                {p?.techStack?.length > 0 && (
                                    <div className="mt-auto">
                                        <h4 className="text-sm uppercase text-gray-400 mb-2 font-medium tracking-wider">
                                            Tech Stack
                                        </h4>

                                        <div className="flex flex-wrap gap-2">
                                            {p?.techStack?.map((tech, i) => (
                                                <motion.span
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.05 * i }}
                                                    className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 text-gray-900 shadow-md hover:shadow-lg hover:from-cyan-400 hover:to-teal-500 transition-all duration-300"
                                                >
                                                    {tech}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
