const WebSocket = require("ws");

// Replace with your WebSocket server URL
const SERVER_URL = "ws://localhost:5000/ws/alerts";

// Create 4 simulated ESP32 devices
const DEVICES = [
    "device-001",
    "device-002",
    // "device-003",
    // "device-004",
];

// Helper function to generate random values
function getRandomValue(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

// Function to simulate one device connection
function simulateDevice(deviceId) {
    const ws = new WebSocket(SERVER_URL);

    ws.on("open", () => {
        console.log(`✅ [${deviceId}] Connected to WebSocket Server`);

        // Send sensor data every 3 seconds
        const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                const payload = {
                    deviceId,
                    humidity: getRandomValue(30, 90),              // % humidity
                    temperature: getRandomValue(10, 40),           // °C
                    humidityAlert: Math.random() > 0.8 ? "HIGH" : "NORMAL",      // 20% chance alert
                    temperatureAlert: Math.random() > 0.85 ? "HIGH" : "NORMAL",  // 15% chance alert
                    odourAlert: Math.random() > 0.9 ? "DETECTED" : "NORMAL  ",            // 10% chance odour
                    timestamp: new Date().toISOString(),
                };

                ws.send(JSON.stringify(payload));
                console.log(`📤 [${deviceId}] Sent:`, payload);
            }
        }, 10000);

        // Handle disconnection cleanup
        ws.on("close", () => {
            console.log(`❌ [${deviceId}] Disconnected from server`);
            clearInterval(interval);
        });

        ws.on("error", (err) => {
            console.error(`⚠️ [${deviceId}] WebSocket Error:`, err.message);
        });

        ws.on("message", (msg) => {
            console.log(`📩 [${deviceId}] Message from server: ${msg.toString()}`);
        });
    });
}

// Start simulation for all devices
DEVICES.forEach((id) => simulateDevice(id));


// const WebSocket = require("ws");

// // Device conditions from your description
// const conditions = {
//     temperature: { operator: ">", value: 10 },
//     humidity: { operator: "<", value: 60 },
//     odour: false  // means: if odour detected -> send true
// };

// function getRandomValue(min, max) {
//     return parseFloat((Math.random() * (max - min) + min).toFixed(2));
// }

// function generatePayload() {
//     // Generate random sensor values
//     const currentTemperature = getRandomValue(5, 40);
//     const currentHumidity = getRandomValue(20, 90);

//     // Simulate odour detection (10% chance)
//     const odourDetected = Math.random() > 0.9;

//     // -------------------------
//     // ALERT LOGIC BASED ON CONDITIONS
//     // -------------------------

//     // Temperature Alert
//     let temperatureAlert = false;
//     if (conditions.temperature.operator === ">") {
//         temperatureAlert = currentTemperature > conditions.temperature.value;
//     }

//     // Humidity Alert
//     let humidityAlert = false;
//     if (conditions.humidity.operator === "<") {
//         humidityAlert = currentHumidity < conditions.humidity.value;
//     }

//     // Odour Alert (REVERSED LOGIC)
//     let odourAlert = false;
//     if (conditions.odour === true) {
//         // If condition expects TRUE → send FALSE when detected
//         odourAlert = odourDetected ? false : true;
//     } else {
//         // If condition expects FALSE → send TRUE when detected
//         odourAlert = odourDetected ? true : false;
//     }

//     return {
//         deviceId: "device_001",
//         temperature: currentTemperature,
//         humidity: currentHumidity,
//         temperatureAlert,
//         humidityAlert,
//         odourAlert,
//         timestamp: new Date().toISOString()
//     };
// }

// // ------------------------------
// // CONNECT & SEND LOOP
// // ------------------------------

// const ws = new WebSocket("ws://localhost:5000/ws/alerts");

// ws.on("open", () => {
//     console.log("Connected to server");

//     setInterval(() => {
//         const payload = generatePayload();
//         ws.send(JSON.stringify(payload));
//         console.log("📤 Sent:", payload);
//     }, 5000);
// });

// ws.on("message", (msg) => {
//     console.log("📥 From server:", msg.toString());
// });

// ws.on("close", () => console.log("Disconnected from server"));
// ws.on("error", (err) => console.log("Error:", err));
