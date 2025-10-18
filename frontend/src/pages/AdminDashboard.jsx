import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { motion } from "framer-motion";
import { getImageUrl } from "../utils/imageUtils";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ResumeViewer from "../components/ResumeViewer";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [resume, setResume] = useState(null);
    const [enquiries, setEnquiries] = useState([]);

    // Skill Management
    const [newSkill, setNewSkill] = useState("");
    const [editingSkill, setEditingSkill] = useState(null);
    const [skillError, setSkillError] = useState("");

    // Project Management
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        techStack: "",
    });
    const [projectImage, setProjectImage] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [projectError, setProjectError] = useState("");

    // Resume
    const [resumeFile, setResumeFile] = useState(null);
    const [showResume, setShowResume] = useState(false);
    const [resumeUploading, setResumeUploading] = useState(false);

    // Fetch data
    const fetchData = async () => {
        try {
            const [skillsRes, projectsRes, enquiriesRes] = await Promise.all([
                api.get("/skills"),
                api.get("/projects"),
                api.get("/enquiries"),
            ]);
            setSkills(skillsRes.data);
            setProjects(projectsRes.data);
            setEnquiries(enquiriesRes.data);

            // Fetch resume separately to handle 404
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
        } catch (err) {
            console.log("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ---------------- SKILLS ----------------
    const addOrUpdateSkill = async () => {
        if (!newSkill.trim()) {
            setSkillError("Skill cannot be empty");
            return;
        }

        try {
            if (editingSkill) {
                await api.put(`/skills/${editingSkill._id}`, { name: newSkill });
            } else {
                await api.post("/skills", { name: newSkill });
            }

            setNewSkill("");
            setEditingSkill(null);
            setSkillError("");
            fetchData();
        } catch {
            setSkillError("Failed to save skill");
        }
    };

    const deleteSkill = async (id) => {
        await api.delete(`/skills/${id}`);
        fetchData();
    };

    const startEditSkill = (skill) => {
        setEditingSkill(skill);
        setNewSkill(skill.name);
    };

    // ---------------- PROJECTS ----------------
    const addOrUpdateProject = async () => {
        if (!newProject.title.trim() || !newProject.description.trim()) {
            setProjectError("Title and Description are required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", newProject.title);
            formData.append("description", newProject.description);

            const techStackArray = newProject.techStack
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
            formData.append("techStack", techStackArray.join(","));

            if (projectImage) formData.append("image", projectImage);

            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.post("/projects", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setNewProject({ title: "", description: "", techStack: "" });
            setProjectImage(null);
            setEditingProject(null);
            setProjectError("");
            fetchData();
        } catch (err) {
            console.log("Project save failed:", err);
            setProjectError("Failed to save project");
        }
    };

    const deleteProject = async (id) => {
        await api.delete(`/projects/${id}`);
        fetchData();
    };

    const startEditProject = (project) => {
        setEditingProject(project);
        setNewProject({
            title: project.title,
            description: project.description,
            techStack: project.techStack?.join(", ") || "",
        });
    };

    // ---------------- RESUME ----------------
    const uploadResume = async () => {
        if (!resumeFile) {
            alert("Please select a file to upload");
            return;
        }

        setResumeUploading(true);
        const formData = new FormData();
        formData.append("file", resumeFile);

        try {
            await api.post("/resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResumeFile(null);
            fetchData();
            alert("Resume uploaded successfully!");
        } catch (err) {
            console.log("Failed to upload resume:", err);
            alert("Failed to upload resume. Please try again.");
        } finally {
            setResumeUploading(false);
        }
    };

    const deleteResume = async () => {
        if (window.confirm("Are you sure you want to delete the resume?")) {
            try {
                await api.delete("/resume");
                setResume(null);
                alert("Resume deleted successfully!");
            } catch (err) {
                console.log("Failed to delete resume:", err);
                alert("Failed to delete resume.");
            }
        }
    };

    // ---------------- ENQUIRIES ----------------
    const replyEnquiry = async (enquiry) => {
        const reply = prompt("Enter your reply to: " + enquiry.name);
        if (!reply) return;
        try {
            await api.post(`/enquiries/${enquiry._id}/reply`, { reply });
            fetchData();
        } catch {
            console.log("Failed to reply");
        }
    };

    if (!user)
        return (
            <div className="text-center mt-20 text-white text-lg">
                Please login to access Admin Dashboard
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded shadow transition text-sm sm:text-base"
                >
                    Logout
                </button>
            </div>

            {/* ---------------- SKILLS ---------------- */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-teal-400">
                    Skills
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 mb-2 w-full">
                    <input
                        type="text"
                        placeholder="Enter skill"
                        value={newSkill}
                        onChange={(e) => {
                            setNewSkill(e.target.value);
                            setSkillError("");
                        }}
                        className="p-2 rounded border border-gray-300 bg-gray-800 text-white focus:outline-none focus:border-teal-400 flex-1 shadow w-full sm:w-auto"
                    />
                    <button
                        onClick={addOrUpdateSkill}
                        className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-400 transition shadow text-sm sm:text-base"
                    >
                        {editingSkill ? "Update" : "Add"}
                    </button>
                    {editingSkill && (
                        <button
                            onClick={() => {
                                setEditingSkill(null);
                                setNewSkill("");
                            }}
                            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition shadow text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                    )}
                </div>
                {skillError && <p className="text-red-400 text-sm mb-2">{skillError}</p>}

                {/* Skills grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {skills.map((s) => (
                        <motion.div
                            key={s._id}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 px-3 py-2 rounded flex items-center justify-between shadow text-sm sm:text-base truncate"
                        >
                            <span className="truncate">{s.name}</span>
                            <div className="flex gap-1 shrink-0">
                                <button
                                    onClick={() => startEditSkill(s)}
                                    className="bg-blue-500 p-1.5 rounded-full hover:bg-blue-400 transition"
                                >
                                    <FaEdit size={12} />
                                </button>
                                <button
                                    onClick={() => deleteSkill(s._id)}
                                    className="bg-red-600 p-1.5 rounded-full hover:bg-red-500 transition"
                                >
                                    <MdDelete size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ---------------- PROJECTS ---------------- */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-teal-400">
                    Projects
                </h2>
                <div className="flex flex-col gap-2 mb-6 w-full max-w-2xl">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="p-2 rounded border border-gray-300 bg-gray-800 text-white focus:outline-none focus:border-teal-400 shadow"
                    />
                    <textarea
                        placeholder="Description"
                        value={newProject.description}
                        onChange={(e) =>
                            setNewProject({ ...newProject, description: e.target.value })
                        }
                        className="p-2 rounded border border-gray-300 bg-gray-800 text-white focus:outline-none focus:border-teal-400 shadow h-[140px]"
                    />
                    <input
                        type="text"
                        placeholder="Tech Stack (comma separated)"
                        value={newProject.techStack}
                        onChange={(e) =>
                            setNewProject({ ...newProject, techStack: e.target.value })
                        }
                        className="p-2 rounded border border-gray-300 bg-gray-800 text-white focus:outline-none focus:border-teal-400 shadow"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProjectImage(e.target.files[0])}
                        className="p-2 rounded border border-gray-300 bg-gray-800 text-white shadow focus:outline-none focus:border-teal-400"
                    />
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={addOrUpdateProject}
                            className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-400 transition shadow text-sm sm:text-base"
                        >
                            {editingProject ? "Update Project" : "Add Project"}
                        </button>
                        {editingProject && (
                            <button
                                onClick={() => {
                                    setEditingProject(null);
                                    setNewProject({ title: "", description: "", techStack: "" });
                                    setProjectImage(null);
                                }}
                                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition shadow text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                    {projectError && <p className="text-red-400 text-sm">{projectError}</p>}
                </div>

                {/* Projects List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projects.map((p) => (
                        <motion.div
                            key={p._id}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 p-4 rounded flex flex-col justify-between shadow"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="w-full aspect-video bg-gray-700 rounded overflow-hidden">
                                    <img
                                        src={getImageUrl(p?.image)}
                                        alt={p.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-bold text-lg">{p.title}</h3>
                                <p className="text-gray-300 text-sm">{p.description}</p>
                                {p.techStack?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {p.techStack.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="bg-teal-500 text-gray-900 px-2 py-1 rounded-full text-xs font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => startEditProject(p)}
                                    className="bg-blue-500 p-2 rounded-full hover:bg-blue-400 transition"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => deleteProject(p._id)}
                                    className="bg-red-600 p-2 rounded-full hover:bg-red-500 transition"
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ---------------- RESUME ---------------- */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-teal-400">
                    Resume
                </h2>

                {/* Current Resume Info */}
                {resume && (
                    <div className="mb-4 p-4 bg-gray-800 rounded shadow">
                        <p className="text-green-400 mb-2">✓ Resume uploaded successfully</p>
                        <p className="text-sm text-gray-300">
                            File: {resume.fileName || "Resume"} ({resume.fileType})
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button
                                onClick={() => setShowResume(true)}
                                className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-400 transition shadow text-sm"
                            >
                                View Resume
                            </button>
                            <a
                                href={resume.fileUrl}
                                download={resume.fileName || "resume"}
                                className="bg-teal-500 px-4 py-2 rounded text-white hover:bg-teal-400 transition shadow text-sm"
                            >
                                Download Resume
                            </a>
                            <button
                                onClick={deleteResume}
                                className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-500 transition shadow text-sm"
                            >
                                Delete Resume
                            </button>
                        </div>
                    </div>
                )}

                {/* Upload Section */}
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="p-2 rounded border border-gray-300 bg-gray-800 text-white shadow focus:outline-none focus:border-teal-400 flex-1"
                    />
                    <button
                        onClick={uploadResume}
                        disabled={resumeUploading || !resumeFile}
                        className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition shadow text-sm sm:text-base flex items-center gap-2"
                    >
                        {resumeUploading ? "Uploading..." : "Upload Resume"}
                    </button>
                </div>

                {!resume && (
                    <p className="text-yellow-400 text-sm">No resume uploaded yet</p>
                )}

                {showResume && resume && (
                    <ResumeViewer
                        fileUrl={resume.fileUrl}
                        fileType={resume.fileType}
                        fileName={resume.fileName}
                        fileExtension={resume.fileExtension}
                        resourceType={resume.resourceType}
                        onClose={() => setShowResume(false)}
                    />
                )}
            </section>

            {/* ---------------- ENQUIRIES ---------------- */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-teal-400">
                    Enquiries
                </h2>
                <div className="flex flex-col gap-3">
                    {enquiries.map((e) => (
                        <motion.div
                            key={e._id}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow"
                        >
                            <div className="w-full sm:w-auto">
                                <p className="text-sm sm:text-base">
                                    <span className="font-bold text-white">{e.name}</span>{" "}
                                    <span className="text-gray-300 break-all">({e.email})</span>
                                </p>
                                <p className="text-gray-200 text-sm">{e.message}</p>
                                {e.reply && (
                                    <p className="text-teal-300 text-sm mt-1">Reply: {e.reply}</p>
                                )}
                            </div>
                            <button
                                onClick={() => replyEnquiry(e)}
                                className="bg-teal-500 px-3 py-1.5 rounded hover:bg-teal-400 transition shadow text-sm sm:text-base w-full sm:w-auto"
                            >
                                Reply
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}