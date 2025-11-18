import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { motion } from "framer-motion";
import { getImageUrl } from "../utils/imageUtils";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import ResumeViewer from "../components/ResumeViewer";
import { FiPlus } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [resume, setResume] = useState(null);
    const [enquiries, setEnquiries] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [editingSkill, setEditingSkill] = useState(null);
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isSending, setIsSending] = useState(false)

    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        techStack: "",
    });
    const [projectImage, setProjectImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [currentEnquiry, setCurrentEnquiry] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [showResume, setShowResume] = useState(false);

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

            try {
                const resumeRes = await api.get("/resume");
                setResume(resumeRes.data);
            } catch (err) {
                if (err.response?.status === 404) setResume(null);
            }
        } catch (err) {
            console.log("Error:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openDeleteModal = (type, id = null) => {
        setDeleteData({ type, id });
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteData) return;

        try {
            if (deleteData.type === "skill") {
                await api.delete(`/skills/${deleteData.id}`);
            } else if (deleteData.type === "project") {
                await api.delete(`/projects/${deleteData.id}`);
            } else if (deleteData.type === "resume") {
                await api.delete("/resume");
                setResume(null);
            }

            setDeleteModalOpen(false);
            fetchData();
        } catch (err) {
            console.log("Delete failed:", err);
        }
    };

    const saveSkill = async () => {
        if (!newSkill.trim()) return;

        try {
            if (editingSkill) {
                await api.put(`/skills/${editingSkill._id}`, { name: newSkill });
            } else {
                await api.post("/skills", { name: newSkill });
            }

            setNewSkill("");
            setEditingSkill(null);
            fetchData();
        } catch {
            console.log("Skill save failed");
        }
    };

    const openAddProjectModal = () => {
        setEditingProject(null);
        setNewProject({ title: "", description: "", techStack: "" });
        setProjectImage(null);
        setImagePreview(null);
        setProjectModalOpen(true);
    };

    const openEditProjectModal = (project) => {
        setEditingProject(project);
        setNewProject({
            title: project.title,
            description: project.description,
            techStack: project.techStack?.join(", ") || "",
        });
        setProjectImage(null);
        setImagePreview(getImageUrl(project.image));
        setProjectModalOpen(true);
    };

    const handleProjectImageChange = (file) => {
        setProjectImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const saveProject = async () => {
        if (!newProject.title.trim() || !newProject.description.trim()) return;

        try {
            const formData = new FormData();
            formData.append("title", newProject.title);
            formData.append("description", newProject.description);

            const techArray = newProject.techStack
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            formData.append("techStack", techArray.join(","));
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

            setProjectModalOpen(false);
            fetchData();
        } catch (err) {
            console.log("Project save failed:", err);
        }
    };

    const openReplyModal = (enquiry) => {
        setCurrentEnquiry(enquiry);
        setReplyMessage("");
        setReplyModalOpen(true);
    };

    const sendReply = async () => {
        if (!replyMessage.trim()) return;

        try {
            setIsSending(true)
            await api.post(`/enquiries/${currentEnquiry._id}/reply`, {
                reply: replyMessage,
            });
            setReplyModalOpen(false);
            fetchData();
        } catch {
            console.log("Reply failed");
        } finally {
            setIsSending(false)
        }
    };

    const uploadResume = async () => {
        if (!resumeFile) return;

        const formData = new FormData();
        formData.append("file", resumeFile);

        try {
            await api.post("/resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResumeFile(null);
            fetchData();
        } catch (err) {
            console.log("Resume upload failed:", err);
        }
    };

    if (!user)
        return (
            <div className="text-center text-white mt-20 text-lg">
                Please login to access Admin Dashboard
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded cursor-pointer"
                >
                    Logout
                </button>
            </div>

            {/* ====================== SKILLS ====================== */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-teal-400">Skills</h2>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Skill name"
                        className="p-2 rounded bg-gray-800 border border-gray-600 flex-1"
                    />
                    <button
                        onClick={saveSkill}
                        className="bg-teal-500 px-4 py-2 rounded cursor-pointer"
                    >
                        {editingSkill ? "Update" : "Add"}
                    </button>
                    {editingSkill && (
                        <button
                            onClick={() => {
                                setEditingSkill(null);
                                setNewSkill("");
                            }}
                            className="bg-gray-500 px-4 py-2 rounded cursor-pointer"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {/* SKILL LIST */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {skills.map((s) => (
                        <motion.div
                            key={s._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-800 px-3 py-2 rounded flex justify-between items-center"
                        >
                            <span>{s.name}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditingSkill(s);
                                        setNewSkill(s.name);
                                    }}
                                    className="bg-blue-500 p-2 rounded-full cursor-pointer"
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button
                                    onClick={() => openDeleteModal("skill", s._id)}
                                    className="bg-red-600 p-2 rounded-full cursor-pointer"
                                >
                                    <MdDelete size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ====================== PROJECTS ====================== */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-teal-400">
                        Projects
                    </h2>
                    <button
                        onClick={openAddProjectModal}
                        className="bg-teal-500 px-4 py-2 rounded cursor-pointer"
                    >
                        Add Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projects.map((p) => (
                        <motion.div
                            key={p._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-800 p-4 rounded relative"
                        >
                            {/* Image wrapper with menu */}
                            <div className="relative">
                                <img
                                    src={getImageUrl(p.image)}
                                    className="w-full h-48 object-cover rounded mb-3"
                                />

                                {/* Three dots button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === p._id ? null : p._id);
                                    }}
                                    className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full cursor-pointer hover:bg-black/80"
                                >
                                    <HiDotsVertical size={18} />
                                </button>

                                {/* Dropdown Menu */}
                                {openMenuId === p._id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                        className="absolute top-12 right-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-32 py-2 z-40"
                                    >
                                        <button
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                openEditProjectModal(p);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer text-sm"
                                        >
                                            <FaEdit size={14} /> Edit
                                        </button>

                                        <button
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                openDeleteModal('project', p._id);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer text-sm text-red-400"
                                        >
                                            <MdDelete size={16} /> Delete
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            <h3 className="font-bold text-lg">{p.title}</h3>
                            <p className="text-gray-300">{p.description}</p>

                            <div className="my-2">
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
                        </motion.div>

                    ))}
                </div>
            </section>

            {/* ====================== RESUME ====================== */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-teal-400 mb-4">
                    Resume
                </h2>

                {resume ? (
                    <div className="bg-gray-800 p-4 rounded">
                        <p className="text-green-400 mb-2">
                            ✓ Resume uploaded successfully
                        </p>

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => setShowResume(true)}
                                className="bg-blue-500 px-4 py-1.5 rounded cursor-pointer"
                            >
                                View
                            </button>
                            <button
                                onClick={() => openDeleteModal("resume")}
                                className="bg-red-600 px-4 py-1.5 rounded cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-yellow-300 mb-2">No resume uploaded</p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 w-full">
                    <input
                        type="file"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="bg-gray-800 p-2 rounded border border-gray-600 w-full sm:flex-1 text-sm sm:text-base"
                    />

                    <button
                        onClick={uploadResume}
                        className="bg-teal-500 px-4 py-2 rounded cursor-pointer w-full sm:w-auto text-sm sm:text-base text-white"
                    >
                        Upload
                    </button>
                </div>


                {showResume && resume && (
                    <ResumeViewer
                        fileUrl={resume.fileUrl}
                        fileType={resume.fileType}
                        fileName={resume.fileName}
                        fileExtension={resume.fileExtension}
                        onClose={() => setShowResume(false)}
                    />
                )}
            </section>

            {/* ====================== ENQUIRIES ====================== */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-teal-400 mb-4">
                    Enquiries
                </h2>

                {enquiries.length > 0 ? enquiries.map((e) => (
                    <motion.div
                        key={e._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-800 p-4 rounded mb-3 flex justify-between"
                    >
                        <div>
                            <p>
                                <span className="font-bold">{e.name}</span> ({e.email})
                            </p>
                            <p className="text-gray-300">{e.message}</p>
                            {e.replyMessage && (
                                <p className="text-teal-400 text-sm mt-1">
                                    Reply: {e.replyMessage}
                                </p>
                            )}
                        </div>

                        {!e.replyMessage && <button
                            onClick={() => openReplyModal(e)}
                            className="bg-teal-500 px-3 py-1 rounded h-fit cursor-pointer"
                        >
                            Reply
                        </button>}
                    </motion.div>
                )) : <div>
                    <p>No enquires received</p>
                </div>}
            </section>

            {/* PROJECT MODAL */}
            {projectModalOpen && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg relative">

                        <button
                            onClick={() => setProjectModalOpen(false)}
                            className="absolute top-3 right-3 text-white cursor-pointer"
                        >
                            <MdClose size={24} />
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-teal-400">
                            {editingProject ? "Edit Project" : "Add Project"}
                        </h2>

                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newProject.title}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, title: e.target.value })
                                }
                                className="p-2 rounded bg-gray-700 border border-gray-600"
                            />

                            <textarea
                                placeholder="Description"
                                value={newProject.description}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, description: e.target.value })
                                }
                                className="p-2 rounded bg-gray-700 border border-gray-600 h-28"
                            />

                            <input
                                type="text"
                                placeholder="Tech Stack (comma separated)"
                                value={newProject.techStack}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, techStack: e.target.value })
                                }
                                className="p-2 rounded bg-gray-700 border border-gray-600"
                            />

                            {/* Image Upload */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleProjectImageChange(e.target.files[0])}
                                className="p-2 bg-gray-700 border border-gray-600 rounded"
                            />

                            {/* Image Preview */}
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    className="w-full h-40 object-cover rounded"
                                />
                            )}

                            <button
                                onClick={saveProject}
                                className="bg-teal-500 mt-3 py-2 rounded cursor-pointer"
                            >
                                {editingProject ? "Update Project" : "Add Project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* REPLY MODAL */}
            {replyModalOpen && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-60 z-50 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md relative">

                        <button
                            onClick={() => setReplyModalOpen(false)}
                            className="absolute top-3 right-3 cursor-pointer"
                        >
                            <MdClose size={24} />
                        </button>

                        <h2 className="text-xl font-bold text-teal-400 mb-3">
                            Reply to {currentEnquiry?.name}
                        </h2>

                        <p className="text-sm text-gray-300 my-2">To: <span className="font-medium text-white">{currentEnquiry?.email}</span></p>

                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your reply"
                            className="bg-gray-700 p-2 rounded w-full h-32 border-2 border-teal-600 outline-0"
                        />

                        <button
                            onClick={sendReply}
                            className="bg-teal-500 w-full py-2 rounded mt-3 font-semibold cursor-pointer"
                            disabled={isSending}
                        >
                            {isSending ? "Sending..." : "Send Reply"}
                        </button>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm text-center relative">

                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="absolute top-3 right-3 cursor-pointer"
                        >
                            <MdClose size={24} />
                        </button>

                        <h2 className="text-xl font-bold text-red-400 mb-4">
                            Confirm Delete
                        </h2>

                        <p className="text-gray-300 mb-4">
                            Are you sure you want to delete this {deleteData?.type}?
                        </p>

                        <div className="flex justify-between gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="bg-gray-600 w-1/2 py-2 rounded cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 w-1/2 py-2 rounded cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
