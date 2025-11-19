const mongoose = require("mongoose");

const conditionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["temperature", "humidity", "odour"],
  },
  operator: {
    type: String,
    required: true,
    enum: [">", "<", "="],
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: function () {
      return this.type === "odour" ? false : 0;
    },
    validate: {
      validator: function (v) {
        if (this.type === "odour") {
          return typeof v === "boolean";
        }
        return typeof v === "number" && Number.isFinite(v);
      },
      message: function (props) {
        return `Invalid condition value "${props.value}" for type "${this.type}". ` +
               `Use boolean for "odour", number for "temperature" and "humidity".`;
      },
    },
  },
});

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, unique: true, required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
    FreezerData: { type: Object, default: {} },
    AmbientData: { type: Object, default: {} },
    conditions: [conditionSchema],
    
    apiKey: { type: String, unique: true, required: true },

    // alerts
    temperatureAlert: { type: Boolean, default: false },
    humidityAlert: { type: Boolean, default: false },
    odourAlert: { type: Boolean, default: false },

    versionId: { type: String, default: null },
  },
  { timestamps: true }
);

const deviceModel = mongoose.model("Device", deviceSchema);

module.exports = deviceModel;
