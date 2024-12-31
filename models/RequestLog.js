const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequestLogSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    route: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RequestLog', RequestLogSchema);
