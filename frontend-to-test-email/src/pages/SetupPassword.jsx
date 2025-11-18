import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../Api";

const SetupPassword = () => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post(`/set-password/${token}`, { password });
            alert(res.data.message);
            navigate(`/verify-otp/${token}`);
        } catch (err) {
            alert(err.response?.data?.message || "Error setting password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4 text-center">Set Your Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full rounded mb-4"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? "Saving..." : "Save & Get OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetupPassword;
