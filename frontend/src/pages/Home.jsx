import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import ResumeViewer from "../components/ResumeViewer";
import api from "../api/axios";

export default function Home() {
    const [showResumeViewer, setShowResumeViewer] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [resume, setResume] = useState(null);

    // This would typically come from your backend or a config file
    const resumeData = {
        fileUrl: resume?.fileUrl,
        fileType: resume?.fileType,
        fileName: resume?.fileName,
        fileExtension: resume?.fileExtension,
        resourceType: resume?.resourceType
    };

    const handleOpenResume = () => {
        setResumeFile(resumeData);
        setShowResumeViewer(true);
    };

    const handleCloseResume = () => {
        setShowResumeViewer(false);
        setResumeFile(null);
    };

    const fetchResumeData = async () => {
        try {
            const resumeRes = await api.get("/resume");
            setResume(resumeRes.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setResume(null);
            } else {
                console.log("Error fetching resume:", err);
            }
        }
    }

    useEffect(() => {
        fetchResumeData()
    }, [])

    return (
        <>
            <Navbar />
            <div id="about">
                <Hero />
            </div>
            <div id="skills">
                <Skills />
            </div>
            <div id="projects">
                <Projects />
            </div>

            {/* Resume Section */}
            <div id="resume" className="py-24 bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            My Resume
                        </h2>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            Download or view my professional resume to learn more about my experience, education, and qualifications.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleOpenResume}
                                className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Resume
                            </button>

                            <a
                                href={resumeData.fileUrl}
                                download={resumeData.fileName}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download Resume
                            </a>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            <div className="bg-gray-800 p-6 rounded-lg text-center">
                                <div className="text-teal-400 text-2xl font-bold mb-2">1.8+</div>
                                <div className="text-gray-300">Years Experience</div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg text-center">
                                <div className="text-teal-400 text-2xl font-bold mb-2">3+</div>
                                <div className="text-gray-300">Projects Completed</div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg text-center">
                                <div className="text-teal-400 text-2xl font-bold mb-2">15+</div>
                                <div className="text-gray-300">Technologies</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="contact">
                <ContactForm />
            </div>
            <Footer />

            {/* Resume Viewer Modal */}
            {showResumeViewer && resumeFile && (
                <ResumeViewer
                    fileUrl={resumeFile.fileUrl}
                    fileType={resumeFile.fileType}
                    fileName={resumeFile.fileName}
                    fileExtension={resumeFile.fileExtension}
                    resourceType={resumeFile.resourceType}
                    onClose={handleCloseResume}
                />
            )}
        </>
    );
}