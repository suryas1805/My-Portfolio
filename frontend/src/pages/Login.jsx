import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent multiple submissions
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        try {
            await login(email, password);
            navigate("/admin"); // redirect on success
        } catch (err) {
            setErrors({ general: "Invalid credentials" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 sm:p-8 md:p-10 rounded-lg flex flex-col gap-4 w-full max-w-md"
            >
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">
                    Admin Login
                </h2>

                {errors.general && (
                    <p className="text-red-400 text-center mb-2">{errors.general}</p>
                )}

                <div className="flex flex-col">
                    <label htmlFor="email" className="text-white font-semibold mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({ ...errors, email: "" });
                        }}
                        className={`p-2 rounded border-2 focus:outline-none focus:border-teal-400 ${errors.email ? "border-red-400" : "border-white"
                            } text-white bg-gray-700`}
                    />
                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="flex flex-col relative">
                    <label htmlFor="password" className="text-white font-semibold mb-1">
                        Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors({ ...errors, password: "" });
                        }}
                        className={`p-2 rounded border-2 focus:outline-none focus:border-teal-400 ${errors.password ? "border-red-400" : "border-white"
                            } text-white bg-gray-700`}
                    />
                    <span
                        className="absolute right-3 top-[38px] cursor-pointer text-gray-300 hover:text-teal-400"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.password && (
                        <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-500 hover:bg-teal-400 font-semibold p-2 rounded text-white mt-2 transition disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div
                    className="flex items-center gap-2 justify-center mt-3 cursor-pointer hover:text-teal-400 transition"
                    onClick={() => navigate("/")}
                >
                    <FaArrowLeft color="white" />
                    <p className="text-md text-white">Back</p>
                </div>
            </form>
        </div>
    );
}
