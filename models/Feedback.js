const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for Feedback/Review
const FeedbackSchema = new Schema({
    formId: {
        type: Schema.Types.ObjectId,
        ref: 'Form',
        required: true, // Feedback is always associated with a form
    },
    email: {
        type: String,
        required: true, // Email is required for form identification
        match: [/.+@.+\..+/, 'Please provide a valid email address'], // Basic email validation
    },
    date: { type: Date, default: Date.now }, // Date when the feedback was submitted
    responses: {
        type: Map,
        of: new Schema({
            answer: { type: String, required: true }, // The user's response to the question
            type: { type: String, required: true, enum: ['textbox', 'star', 'combobox', 'title'] }, // Type of the question
            order: { type: Number, required: true }, // Order of the question for sorting
        }),
        required: true,
    },
});

// Export the model
module.exports = mongoose.model('Feedback', FeedbackSchema);
