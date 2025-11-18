import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../Api";

const VerifyOTP = () => {
    // const [email, setEmail] = useState("");
    const { token } = useParams();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post(`/verify-otp/${token}`, { otp });
            alert(res.data.message);
            navigate("/success");
        } catch (err) {
            alert(err.response?.data?.message || "Error verifying OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4 text-center">Verify OTP</h2>
                <form onSubmit={handleVerify}>
                    {/* <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full rounded mb-3"
                        required
                    /> */}
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="border p-2 w-full rounded mb-4"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
