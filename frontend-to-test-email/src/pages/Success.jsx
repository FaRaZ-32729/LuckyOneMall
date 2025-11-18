import React from "react";

const Success = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-green-700 mb-2">
                    Account Verified Successfully 🎉
                </h1>
                <p>You can now log in to your FrostKontroll account.</p>
            </div>
        </div>
    );
};

export default Success;
