const express = require('express');
const router = express.Router();
const Form = require('../models/Form'); // Import the updated Form model
const RequestLog = require('../models/RequestLog'); // Import the RequestLog model
const Groq = require("groq-sdk");
const { ensureAuthenticatedInnerRoutes} = require("../middlewares");
const {createTransport} = require("nodemailer");
const path = require('path');
const { readFile } = require('fs').promises; // Make sure you have required 'fs/promises'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const schema = {
    $defs: {
        ComboBoxColors: {
            properties: {
                backgroundColor: { type: "string" },
                itemTextColor: { type: "string" },
                selectedItemTextColor: { type: "string" },
                dropdownBackgroundColor: { type: "string" },
                selectedItemBackgroundColor: { type: "string" },
            },
            required: [
                "backgroundColor",
                "itemTextColor",
                "selectedItemTextColor",
                "dropdownBackgroundColor",
                "selectedItemBackgroundColor",
            ],
            type: "object",
        },
        ScaleBarColors: {
            properties: {
                thumbAndTrailColor: { type: "string" },
                textColor: { type: "string" },
            },
            required: ["thumbAndTrailColor", "textColor"],
            type: "object",
        },
        TextBoxColors: {
            properties: {
                backgroundColor: { type: "string" },
                textColor: { type: "string" },
                hintColor: { type: "string" },
                focusedHintColor: { type: "string" },
                boxStrokeColor: { type: "string" },
                focusedBoxStrokeColor: { type: "string" },
                errorTextColor: { type: "string" },
                counterTextColor: { type: "string" },
                cursorColor: { type: "string" },
                placeholderColor: { type: "string" },
                helperTextColor: { type: "string" },
            },
            required: [
                "backgroundColor",
                "textColor",
                "hintColor",
                "focusedHintColor",
                "boxStrokeColor",
                "focusedBoxStrokeColor",
                "errorTextColor",
                "counterTextColor",
                "cursorColor",
                "placeholderColor",
                "helperTextColor",
            ],
            type: "object",
        },
        TitleColors: {
            properties: {
                textColor: { type: "string" },
                backgroundColor: { type: "string" },
                borderColor: { type: "string" },
            },
            required: ["textColor", "backgroundColor", "borderColor"],
            type: "object",
        },
        StarColors: {
            properties: {
                starFillColor: { type: "string" },
                secondaryStarFillColor: { type: "string" },
            },
            required: ["starFillColor", "secondaryStarFillColor"],
            type: "object",
        },
        ComboBoxOptions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    option_text: { type: "string" },
                    order: { type: "integer" },
                },
                required: ["option_text", "order"],
            },
        },
        Component: {
            properties: {
                type: {
                    type: "string",
                    enum: ["title", "textbox", "combobox", "star", "scale-bar"], // Added scale-bar
                },
                text: { type: "string" },
                order: { type: "integer" },
                colors: {
                    anyOf: [
                        { $ref: "#/$defs/ComboBoxColors" },
                        { $ref: "#/$defs/TextBoxColors" },
                        { $ref: "#/$defs/TitleColors" },
                        { $ref: "#/$defs/StarColors" },
                        { $ref: "#/$defs/ScaleBarColors" },
                    ],
                },
                additionalData: {
                    type: "object",
                    properties: {
                        min: { type: "integer" },
                        max: { type: "integer" },
                        unit: { type: "string" },
                    },
                    required: ["min", "max", "unit"],
                },
                options: { $ref: "#/$defs/ComboBoxOptions" },
            },
            required: ["type", "text", "order", "colors"],
            type: "object",
            allOf: [
                {
                    if: { properties: { type: { const: "combobox" } } },
                    then: { required: ["options"] },
                },
                {
                    if: { properties: { type: { const: "scale-bar" } } },
                    then: { required: ["additionalData"] },
                },
            ],
        },
    },
    properties: {
        name: { type: "string" },
        theme: { type: "string", enum: ["light", "dark", "custom"] },
        designData: {
            properties: {
                backgroundColor: { type: "string" },
                textColor: { type: "string" },
                buttonBackgroundColor: { type: "string" },
                buttonTextColor: { type: "string" },
            },
            required: ["backgroundColor", "textColor", "buttonBackgroundColor", "buttonTextColor"],
            type: "object",
        },
        components: {
            items: { $ref: "#/$defs/Component" },
            minItems: 15,
            type: "array",
        },
    },
    required: ["name", "theme", "designData", "components"],
    type: "object",
};





// Save a new form
router.post('/save',ensureAuthenticatedInnerRoutes, async (req, res) => {
    try {
        const { name, theme, designData, components } = req.body;

        // Debugging: Log the type of `name`
        console.log('Received Form Name:', name, 'Type:', typeof name);
        console.log('Received Request Body:', req.body);

        // Validate the authenticated user
        if (!req.user || !req.user._id) {
            return res.status(403).json({ error: 'User authentication required.' });
        }

        // Check if the user already has 5 forms
        const formCount = await Form.countDocuments({ userId: req.user._id });
        if (formCount >= 5) {
            return res.status(400).json({ error: 'You can only create up to 5 forms.' });
        }


        // Validate required fields
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Form name is required and must be a string.' });
        }

        if (!theme || !['light', 'dark', 'custom'].includes(theme)) {
            return res.status(400).json({ error: 'Invalid or missing theme.' });
        }

        if (!Array.isArray(components) || components.length === 0) {
            return res.status(400).json({ error: 'Form must include at least one component.' });
        }

        // Validate components
        for (const component of components) {
            if (!['textbox', 'star', 'combobox', 'title','scale-bar'].includes(component.type)) {
                return res
                    .status(400)
                    .json({ error: `Invalid component type: ${component.type}` });
            }
            if (!component.text || typeof component.text !== 'string') {
                return res.status(400).json({ error: 'Each component must have a text field.' });
            }
            if (component.type === 'combobox') {
                if (
                    !Array.isArray(component.options) ||
                    component.options.some(
                        (opt) =>
                            !opt.option_text || typeof opt.option_text !== 'string' || typeof opt.order !== 'number'
                    )
                ) {
                    return res
                        .status(400)
                        .json({ error: 'ComboBox components must include valid options with a numeric order.' });
                }
            }
            // Validate colors if theme is custom
            if (theme === 'custom' && component.colors) {
                if (typeof component.colors !== 'object' || Array.isArray(component.colors)) {
                    return res.status(400).json({ error: 'Colors must be a valid map (object).' });
                }
            }
        }
        console.log({
            userId: req.user._id,
            name,
            theme,
            designData,
            components,
        });

        // Save the form
        const form = new Form({
            userId: req.user._id, // Associate with the logged-in user
            name,
            theme,
            designData,
            components,
        });
        const savedForm = await form.save();

        res.json({ success: true, formId: savedForm._id });
    } catch (error) {
        console.error('Error saving form:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all forms
router.get('/list',ensureAuthenticatedInnerRoutes, async (req, res) => {
    try {
        const forms = await Form.find({ userId: req.user._id }); // Fetch forms for the authenticated user
        res.status(200).json(forms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve forms' });
    }
});

// Get Form by ID
router.get('/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }
        res.json(form);
    } catch (error) {
        console.error('Error fetching form:', error);
        res.status(500).json({ error: 'Failed to fetch form' });
    }
});

// Update Form by ID
router.put('/:id', ensureAuthenticatedInnerRoutes,async (req, res) => {
    try {
        const { name, theme, designData, components } = req.body;
        const form = await Form.findById(req.params.id);

        // Debugging: Log the type of `name`
        console.log('Received Form Name:', name, 'Type:', typeof name);
        console.log('Received Request Body:', req.body);

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Validate name
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Form name is required and must be a string.' });
        }

        // Validate theme
        if (!theme || !['light', 'dark', 'custom'].includes(theme)) {
            return res.status(400).json({ error: 'Invalid or missing theme.' });
        }

        // Validate components
        if (!Array.isArray(components) || components.length === 0) {
            return res.status(400).json({ error: 'Form must include at least one component.' });
        }

        for (const component of components) {
            if (!['textbox', 'star', 'combobox', 'title','scale-bar'].includes(component.type)) {
                return res.status(400).json({ error: `Invalid component type: ${component.type}` });
            }
            if (!component.text || typeof component.text !== 'string') {
                return res.status(400).json({ error: 'Each component must have a text field.' });
            }
            if (theme === 'custom' && component.colors && typeof component.colors !== 'object') {
                return res.status(400).json({ error: 'Invalid colors format.' });
            }
        }

        // Update form fields
        form.name = name;
        form.theme = theme;
        form.designData = designData;
        form.components = components;
        form.updated_at = new Date();

        await form.save();
        res.json({ success: true, formId: form._id });
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ error: 'Failed to update the form.' });
    }
});

// Delete Form by ID
router.delete('/:id', ensureAuthenticatedInnerRoutes,async (req, res) => {
    try {
        const form = await Form.findById(req.params.id); // Fetch the form document

        if (!form) {
            return res.status(404).json({ error: 'Form not found.' });
        }

        await form.deleteOne(); // Trigger the middleware and delete the document

        res.status(200).json({ message: 'Form and associated feedback deleted successfully.' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ error: 'Failed to delete the form.' });
    }
});



// Define the router endpoint
router.post('/generate-form/:subject/:theme',ensureAuthenticatedInnerRoutes, async (req, res) => {
    const subject = req.params.subject;
    const theme = req.params.theme.toLowerCase(); // Ensure case insensitivity for theme
    const jsonSchema = JSON.stringify(schema, null, 4);

    try {
        // Validate the authenticated user
        if (!req.user || !req.user._id) {
            return res.status(403).json({ error: 'User authentication required.' });
        }

        const userId = req.user._id;
        const route = '/generate-form'; // Static route path without params

        // Count the user's requests to this route in the last 24 hours
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const requestCount = await RequestLog.countDocuments({
            userId,
            route,
            timestamp: { $gte: yesterday },
        });
        console.log("number of request the user made in 24 hours are " +requestCount);
        if (requestCount >= 2) {
            return res.status(429).json({ success: false, error: 'You can only generate a form twice per day.' });
        }

        // Proceed with generating the form
        // (The existing logic to generate the form goes here)

        // Log the request
        await RequestLog.create({ userId, route });
        // Validate the theme parameter
        if (!['light', 'dark', 'custom'].includes(theme)) {
            return res.status(400).json({
                error: `Invalid theme: ${theme}. Theme must be one of "light", "dark", or "custom".`,
            });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
You are a form generator that outputs modular forms in JSON. 
form must has minimum 15 components.
Explore deeply into the subject for meaningful and specific content. For example, if the subject is math, include questions or prompts directly related to mathematical topics or problem-solving.  
Validate that all text properties are non-empty, appropriately formatted, and align with the type of component. If invalid, regenerate the content to correct the issue. 
Ensure no component text is repeated. 
Ensure that the text does not include the character '. If the character is present, remove it.
Ensure each component question is not empty string or null starts with a capital letter and ends with a ? char. Titles do not require a ? char. 
Add a title for every 3 components, ensuring the form alternates consistently between titles and groups of three components. Titles:  
Cannot be the last component in the form.  
Should summarize or introduce the next set of questions or components, maintaining relevance to the subject.  
Should align with the subject but do not end with a ? char.  
The form must follow this pattern:  
Title,Component 1,Title,Component 2,Component 3,Component 4, Title, Component 4, Component 5 ,Component 6, and keep title and 3 questions like that.  
The final component cant be a title.
Ensure each component has appropriate "colors" properties based on its type, with colors to create an elegant and modern design. Each component must use a unique color scheme, and the text must always contrast clearly against the background for readability. Follow these guidelines for selecting colors:
Colors must be in the format #XXXXXX, Use light colors for backgrounds and dark colors for text, or vice versa, for 'combobox, 'selectedItemBackgroundColor' and 'selectedItemTextColor' to have strong contrast to ensure readability and accessibility.
Avoid using the same color for multiple components in the same form.
Use complementary or analogous colors to create harmony between elements in the form.
Introduce occasional accent colors (e.g., vibrant hues) for highlights, focusing on important elements like selected options or error messages.
'textbox' components, include meaningful and specific questions and must have secondary text that are hint to the solution.
Questions in 'textbox' components should explore open-ended ideas or gather feedback specific to the subject. A "secondaryText" property must provide a helpful hint or guidance for answering, ensuring clarity and alignment with the subject.
'combobox' components should present multiple-choice options that are meaningful and relevant to the subject, ensuring variety and depth .
'combobox' components, include a clear and engaging question with at least two unique and meaningful options order should start from 1.
'star' components should gather ratings or preferences specifically tied to the subject matter, offering a clear way for the user to express their opinion or feedback.
'star' components, include a concise and relevant prompt encouraging users to provide a rating.
'scale-bar' components should capture numeric feedback or measurements along a defined range must has additionalData. 
'scale-bar' components include a meaningful and context-specific question as the text property.
'scale-bar' additionalData must have {min: integer ,max: integer,unit: string}, 'min': The minimum value of the scale, which must be an integer and less than 'max': The maximum value of the scale, which must be an integer and greater,'unit': A string representing the unit of measurement.
The first component must always be a title with the text "User Info" and randomly elegant colors for the textColor, backgroundColor, and borderColor fields, ensuring text is highly readable.
The second component must always be a textbox with the text "Email" and randomly elegant colors as described above for textboxes.
Questions and titles must be thoughtful and contextually aligned with the subject: "${subject}". Avoid generic or overly broad questions and ensure that all content provides value in understanding or interacting with the subject.
Ensure the generated colors maintain visual harmony, high contrast, and an aesthetically pleasing design while varying across components.


Schema: ${jsonSchema}
`



                    ,



                },
                {
                    role: "user",
                    content: `Generate a modular form for "${subject}"`,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            stream: false,
            response_format: { type: "json_object" },
        });

        const formJson = JSON.parse(chatCompletion.choices[0].message.content);

        // Update theme based on user selection
        formJson.theme = theme;


        // Adjust colors if the theme is custom
        if (theme !== 'custom') {
            formJson.components = formJson.components.map((component) => ({
                ...component,
                colors: {}, // Set colors as an empty object for the custom theme
            }));
        }

        // Validate components
        formJson.components.forEach((component) => {

            if (!['textbox', 'star', 'combobox', 'title', 'scale-bar'].includes(component.type)) {
                return res.status(400).json({ error: `Invalid component type: ${component.type}` });
            }
            // Validate the text property
            if (!component.text || typeof component.text !== 'string') {
                return res.status(400).json({ error: 'Each component must have a valid text field.' });
            }

            if (component.type === 'combobox' && (!component.options || component.options.length < 2)) {
                throw new Error(
                    `Invalid ComboBox component: ${component.text}. ComboBox components must include at least two options.`
                );
            }
            // Specific validation for 'scale-bar'
            if (component.type === 'scale-bar') {
                if (
                    !component.additionalData ||
                    typeof component.additionalData !== 'object' ||
                    typeof component.additionalData.min !== 'number' ||
                    typeof component.additionalData.max !== 'number' ||
                    component.additionalData.min >= component.additionalData.max ||
                    !component.additionalData.unit ||
                    typeof component.additionalData.unit !== 'string'
                ) {
                    return res.status(400).json({
                        error: `'Scale-bar' components must include a valid 'additionalData' object with 'min', 'max', and 'unit' properties.`,
                    });
                }
            }

            // Validate colors for 'custom' theme
            if (theme === 'custom' && component.colors) {
                if (typeof component.colors !== 'object' || Array.isArray(component.colors)) {
                    return res.status(400).json({ error: 'Colors must be a valid object for custom themes.' });
                }
            }

        });


        // Map the form JSON to the Mongoose Form model
        const form = new Form({
            name: formJson.name,
            theme: formJson.theme,
            designData: formJson.designData,
            components: formJson.components.map((component) => ({
                type: component.type,
                text: component.text,
                secondaryText: component.secondaryText || '',
                order: component.order,
                options: component.options
                    ? component.options.map((option) => ({
                        option_text: option.option_text || '',
                        order: option.order || 0,
                    }))
                    : [], // Ensure an empty array if no options are present
                colors: component.colors || {},
                additionalData: component.additionalData || {},
            })),
        });


        const formObject = form.toObject();

        // Convert `Map` to plain objects for each component's `colors`
        formObject.components = formObject.components.map((component) => {
            if (component.colors instanceof Map) {
                component.colors = Object.fromEntries(component.colors);
            }
            if(component.additionalData instanceof Map)
            {
                component.additionalData =  Object.fromEntries(component.additionalData);
            }
            return component;
        });
        console.log(formJson);
        console.log("Serialized Form Object:", JSON.stringify(formObject, null, 2));

        res.json(formObject);

    } catch (error) {
        console.error("Error generating modular form:", error.message);
        if (error.response) {
            console.error("API Error Details:", error.response.data);
        }
        res.status(500).json({ success: false, error: error.message });
    }
});



router.post('/send-email/:id', async (req, res) => {
    const user = res.locals.user;

    if (!user || !user.email) {
        return res.status(401).send('User not authenticated or email not found.');
    }

    const email = user.email;
    const htmlContent = req.body.htmlContent;
    const formId = req.params.id; // Extract the Form ID from the route

    console.log(htmlContent);
    console.log(email);
    console.log('Form ID:', formId);

    if (!email || !htmlContent || !formId) {
        return res.status(400).json({ error: 'Email, HTML content, and Form ID are required.' });
    }

    try {
        // Read the CSS file
        const cssPath = path.join(__dirname, '..', 'public', 'stylesheets', 'builder.css');
        const cssStyles = await readFile(cssPath, 'utf8');

        // Embed the CSS into the HTML content
        const styledHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                ${cssStyles}
                .readonly-container {
                    border: 1px solid #ccc;
                    padding: 10px;
                    background-color: #f9f9f9;
                    overflow: auto;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    color: #333;
                }
                .email-title {
                    text-align: center;
                    font-size: 20px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-title">Form ${formId} has been created successfully!</div>
            <div class="readonly-container" readonly>
                ${htmlContent}
            </div>
        </body>
        </html>
        `;

        const transporter = createTransport({
            service: 'Gmail', // Or any other email provider
            auth: {
                user: process.env.email, // Your email
                pass: process.env.pass, // Your email password
            },
        });

        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: 'Your Selected Form Preview',
            html: styledHtmlContent, // Send the styled HTML content
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});




module.exports = router;

