// src/DeviceMonitor.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://192.168.137.1:5000"); // backend Socket.IO server

const DeviceMonitor = () => {
  const [deviceData, setDeviceData] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
    });

    socket.on("deviceData", (data) => {
      console.log("📡 Received from backend:", data);
      setDeviceData(data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
    });

    // Cleanup when unmounting
    return () => {
      socket.off("deviceData");
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>📶 Live Device Monitor</h1>
      {deviceData ? (
        <div style={{ background: "#f1f1f1", padding: 15, borderRadius: 8 }}>
          <p><strong>Device ID:</strong> {deviceData.device_id}</p>
          <p><strong>Ambient Temp:</strong> {deviceData.am}°C</p>
          <p><strong>Freezer Temp:</strong> {deviceData.fz}°C</p>
          <p><strong>Battery Alert:</strong> {deviceData.B_Alert ? "⚠️ YES" : "✅ NO"}</p>
          <p><strong>Refrigerator Alert:</strong> {deviceData.R_Alert ? "⚠️ YES" : "✅ NO"}</p>
          <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
        </div>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
};

export default DeviceMonitor;
