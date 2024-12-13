import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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" });

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
                    enum: ["title", "textbox", "combobox", "star", "scale-bar"],
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

export async function generateForm(subject) {
    const jsonSchema = JSON.stringify(schema, null, 4);
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
            You are a form generator that outputs modular forms in JSON. 
            Each form must:

            - Contain at least 10 components.
            - Ensure each question starts with a capital letter and ends with a "?". Titles do not require a "?".
            - Add a title for every 3 questions. Titles should align with the subject but do not end with a "?". 
            - Ensure each component has appropriate color properties based on its type.
            - Include "options" only for ComboBox components.
            - Align all questions with the subject: "${subject}".
            - Ensure no question is repeated.
            Schema: ${jsonSchema}
          `,
                },
                {
                    role: "user",
                    content: `Generate a modular form for "${subject}"`,
                },
            ],
            model: "llama3-8b-8192",
            temperature: 0.5,
            stream: false,
            response_format: { type: "json_object" },
        });

        const form = JSON.parse(chatCompletion.choices[0].message.content);
        console.log("Generated Form:", JSON.stringify(form, null, 2));
        return form;
    } catch (error) {
        console.error("Error generating modular form:", error.message);
        if (error.response) {
            console.error("API Error Details:", error.response.data);
        }
    }
}

export async function main() {
    const subject = "User Feedback Survey";
    const form = await generateForm(subject);
    if (form) {
        console.log("Form generation completed successfully.");
    }
}

main();
