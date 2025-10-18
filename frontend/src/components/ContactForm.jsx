import React, { useState } from "react";
import api from "../api/axios";

export default function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/enquiries", form);
            setSuccess("Message sent successfully!");
            setForm({ name: "", email: "", message: "" });
        } catch (err) {
            setSuccess("Error sending message.");
        }
    };

    return (
        <section
            id="contact"
            className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-800 via-gray-800 to-gray-900 flex justify-center items-center"
        >
            <div className="max-w-lg w-full bg-white/5 backdrop-blur-md border border-gray-700 rounded-3xl shadow-lg p-8 sm:p-10 flex flex-col gap-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-400 text-center mb-4">
                    Contact Me
                </h2>
                <p className="text-gray-300 text-center text-sm sm:text-base">
                    Have a question or want to work together? Send me a message below!
                </p>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                        required
                    />
                    <textarea
                        placeholder="Message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none h-32 sm:h-40 transition"
                        required
                    />
                    <button
                        className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                        Send
                    </button>
                </form>
                {success && (
                    <p className="text-center text-green-400 font-medium mt-2 animate-fadeIn">
                        {success}
                    </p>
                )}
            </div>
        </section>
    );
}
