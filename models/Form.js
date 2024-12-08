const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for Form components
const ComponentSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['textbox', 'star', 'combobox', 'title'], // Added 'title' as a new component type
    },
    text: { type: String, required: true }, // Renamed from 'question' to 'text' for more generic usage
    secondaryText: { type: String, required: false },
    order: { type: Number, required: true },
    options: [
        {
            option_text: { type: String, required: false }, // Optional for non-combobox components
            order: { type: Number, required: false },
        },
    ],
    colors: { type: Map, of: String }, // Map for colors: key is the identifier, value is the color
});

// Define the schema for Forms
const FormSchema = new Schema({
    name: { type: String, required: true }, // Added 'name' field for the form
    theme: { type: String, required: true, enum: ['light', 'dark', 'custom'] },
    designData: {
        backgroundColor: { type: String, default: null }, // Form-level background color
        textColor: { type: String, default: null }, // Form-level text color
        buttonBackgroundColor: { type: String, default: null }, // Form-level button background color
        buttonTextColor: { type: String, default: null }, // Form-level button text color
    },
    components: [ComponentSchema], // Array of components
    created_at: { type: Date, default: Date.now }, // Timestamp for creation
    updated_at: { type: Date, default: Date.now }, // Timestamp for updates
});

// Set up cascading delete for feedbacks when a form is deleted
FormSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const Feedback = mongoose.model('Feedback'); // Import the Feedback model
    await Feedback.deleteMany({ formId: this._id }); // Delete feedbacks associated with this form
    next();
});

// Export the model
module.exports = mongoose.model('Form', FormSchema);
