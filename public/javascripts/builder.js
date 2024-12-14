
let questionCount=1;
let componentCount=1;
let mode;
let  elementCache = new Map();
let colorCycleInterval = null;

const colors = ['#2ee7fc', '#d1f032', '#fd2629', '#ff8914']; // Custom colors for the dots


async function fetchFormData(formId) {
    const response = await fetch(`/forms/${formId}`);
    if (!response.ok) {
        throw new Error(`Failed to load form: ${response.statusText}`);
    }
    return await response.json();
}

async function fetchFormIds() {
    try {
        const response = await fetch('/forms/list');
        const forms = await response.json();
        $('#form-id').append(
            forms.map(form => `<option value="${form._id}">${form._id}</option>`)
        );
    } catch (error) {
        console.error('Error fetching form IDs:', error);
    }
}



function getElementById(id) {
    // Check if the element is already in the cache
    if (elementCache.has(id)) {
        return elementCache.get(id);
    }

    // If not, fetch it from the DOM
    const element = document.getElementById(id);

    // Add it to the cache for future use
    if (element) {
        elementCache.set(id, element);
    }

    return element;
}

const defaultTitlePreview = (isCustomMode) => {
    const previewHtml = createTitlePreview("User Info", isCustomMode);
    componentCount++;
    return previewHtml;
}
const defaultEmailPreview = (isCustomMode) => {
    const previewHtml = createTextBoxPreview("Email", "Enter your email address", isCustomMode);
    componentCount++;
    questionCount++;
    return previewHtml
}



const generateTitlePreview = (isCustomMode, colors = {}) => {
    const finalColors = isCustomMode ? {...getTitleColors(), ...colors} : colors;
    const previewHtml = createTitlePreview("User Info", isCustomMode, finalColors)
    componentCount++;
    return previewHtml;

};

const generateEmailPreview = (isCustomMode, colors = {}) => {
    const finalColors = isCustomMode ? {...getTextBoxColors(), ...colors} : colors;
    const previewHtml = createTextBoxPreview("Email", "Enter your email address", isCustomMode, finalColors)
    componentCount++;
    questionCount++;
    return previewHtml;

};

// Function to reset the entire preview
function resetPreview() {
    // Clear the form preview area
    $('#form-preview').empty();

    // Reset component and question counters
    componentCount = 1;
    questionCount = 1;

    const isCustomMode = $('#theme-selection').val() === 'custom';
    // Add the default components back with color support
    appendToFormPreview(defaultTitlePreview(isCustomMode), true);
    appendToFormPreview(defaultEmailPreview(isCustomMode), true);


}





// Function to get Title colors
function getTitleColors() {
    return {
        textColor: $('#title-text-color').val(),
        backgroundColor: $('#title-background-color').val(),
        borderColor: $('#title-border-color').val(),
    };
}


function createTitlePreview(titleText, isCustomMode,colors={}) {
    if (Object.keys(colors).length === 0) { colors = isCustomMode ? getTitleColors() : {}}
    console.log(isCustomMode + "_" + colors);
    let previewHtml = `
                <div class="form-group preview-card" id="component-${componentCount}" draggable="true"
                    data-type="title"
                    data-text="${titleText}"
                    ${generateDataAttributes(colors)}
                    style="display: flex; flex-direction: column; align-items: flex-start; padding: 5px 0;">
                    <div style="width: 100%;">
                        <textarea class="textareaPreview" readonly
                            style="font-weight: bold; font-size: 1.5rem; width: 100%; height: auto; border: none; background: transparent; resize: none;">${titleText}</textarea>
                    </div>
            `;

    if (isCustomMode) {
        // Add the collapsible "Colors" section
        previewHtml += generateCollapsibleColorsSection(`component-${componentCount}`, colors,false);
    }

    previewHtml += generateRemoveButton();
    return previewHtml;
}

// Function to create ComboBox Preview
function createComboBoxPreview(questionText, isCustomMode,colors={},options={}) {
    if (Object.keys(colors).length === 0) { colors = isCustomMode ? getComboBoxColors() : {}}
    if (Object.keys(options).length === 0) { options = getComboBoxOptions()}
    if (options.length < 2) {
        alert('ComboBox requires at least 2 options.');
        return null;
    }

    let previewHtml = `
                <div class="form-group preview-card" id="component-${componentCount}" draggable="true"
                    data-type="combobox"
                    data-question="${questionText}"
                    data-options='${JSON.stringify(options)}'
                    ${generateDataAttributes(colors)}>
                    <textarea class="textareaPreview" style="width: 100%"
                        readonly>${questionCount}. ${questionText}</textarea>
                    <select class="form-control combo-box-style mt-2" style="width: 100%;">`;

    options.forEach(option => {
        previewHtml += `<option>${option.order}. ${option.option_text}</option>`;
    });

    previewHtml += `</select>`;

    if (isCustomMode) {
        // Add the collapsible "Colors" section
        previewHtml += generateCollapsibleColorsSection(`component-${componentCount}`, colors,true);
    }

    previewHtml += generateRemoveButton();
    return previewHtml;
}


// Function to create TextBox Preview
function createTextBoxPreview(questionText, hintText, isCustomMode,colors={}) {
    if (Object.keys(colors).length === 0) {
        colors = isCustomMode ? getTextBoxColors() : {};
    }
    let previewHtml = `
                <div class="form-group preview-card" id="component-${componentCount}" draggable="true"
                    data-type="textbox"
                    data-question="${questionText}"
                    data-hint="${hintText}"
                    ${generateDataAttributes(colors)}>
                    <textarea class="textareaPreview" style="width: 100%"
                        readonly>${questionCount}. ${questionText}</textarea>
                    <div class="hint-row" style="display: flex; align-items: center; margin-left: 20px;">
                        <i class="fas fa-info-circle" style="margin-right: 8px; color: #3498db;"></i>
                        <span class="hint-text" style="font-size: 0.9rem; color: #7f8c8d;">${hintText}</span>
                    </div>
            `;

    if (isCustomMode) {
        // Add the collapsible "Colors" section
        previewHtml += generateCollapsibleColorsSection(`component-${componentCount}`, colors,true);
    }

    previewHtml += generateRemoveButton();
    return previewHtml;

}

function createScaleBarPreview(questionText, isCustomMode, colors = {}, additionalData = {}) {
    // Ensure colors are provided for custom mode
    if (Object.keys(colors).length === 0) {
        colors = isCustomMode ? getScaleBarColors() : {};
    }
    // Check if options are empty, then populate with default values
    if (Object.keys(additionalData).length === 0) {
       additionalData= getScaleBarAdditionalData();
    }
    const { min, max, unit } = additionalData;

    // Generate preview HTML
    let previewHtml = `
        <div class="form-group preview-card" id="component-${componentCount}" draggable="true"
            data-type="scale-bar"
            data-question="${questionText}"
            ${generateDataAttributes(additionalData)}
            ${generateDataAttributes(colors)}>
            <textarea class="textareaPreview" style="width: 100%" readonly>${questionCount}. ${questionText}</textarea>
            <div class="scale-bar-container mt-2" style="margin-left: 20px;">
                <input type="range" class="form-range" min="${min}" max="${max}" value="${max}" style="width: 100%;">
                <div class="scale-bar-info mt-2">
                    <span>Min: ${min} ${unit} </span>
                    <span style="float: right;">Max: ${max} ${unit}</span>
                </div>
            </div>
    `;

    // Add collapsible "Colors" section for custom mode
    if (isCustomMode) {
        previewHtml += generateCollapsibleColorsSection(`component-${componentCount}`, colors, true);
    }

    previewHtml += generateRemoveButton();
    return previewHtml;
}



// Function to create StarRating Preview
function createStarRatingPreview(questionText, isCustomMode,colors={}) {
    if (Object.keys(colors).length === 0) {
        colors = isCustomMode ? getStarRatingColors() : {};
    }

    let previewHtml = `
                <div class="form-group preview-card" id="component-${componentCount}" draggable="true"
                    data-type="star"
                    data-question="${questionText}"
                    ${generateDataAttributes(colors)}>
                    <textarea class="textareaPreview" style="width: 100%"
                        readonly>${questionCount}. ${questionText}</textarea>
                    <div class="star-rating mt-2" style="margin-left: 20px;">★★★★★</div>
            `;

    if (isCustomMode) {
        // Add the collapsible "Colors" section
        previewHtml += generateCollapsibleColorsSection(`component-${componentCount}`, colors,true);
    }

    previewHtml += generateRemoveButton();
    return previewHtml;
}


// Function to get ComboBox options
function getComboBoxOptions() {
    const options = [];
    $('.option-list .option-input').each(function (index) {
        const optionText = $(this).val().trim();
        if (optionText) {
            options.push({option_text: optionText, order: index + 1});
        }
    });
    return options;
}

// Function to get ComboBox colors
function getComboBoxColors() {
    return {
        backgroundColor: $('#combobox-background-color').val(),
        itemTextColor: $('#combobox-item-text-color').val(),
        selectedItemTextColor: $('#combobox-selected-item-text-color').val(),
        dropdownBackgroundColor: $('#combobox-dropdown-background-color').val(),
        selectedItemBackgroundColor: $('#combobox-selected-item-background-color').val(),
    };
}
// Function to get TextBox colors
function getTextBoxColors() {
    return {
        backgroundColor: $('#textbox-background-color').val(),
        textColor: $('#textbox-text-color').val(),
        hintColor: $('#textbox-hint-color').val(),
        focusedHintColor: $('#textbox-focused-hint-color').val(),
        boxStrokeColor: $('#textbox-box-stroke-color').val(),
        focusedBoxStrokeColor: $('#textbox-focused-box-stroke-color').val(),
        errorTextColor: $('#textbox-error-text-color').val(),
        counterTextColor: $('#textbox-counter-text-color').val(),
        cursorColor: $('#textbox-cursor-color').val(),
        placeholderColor: $('#textbox-placeholder-color').val(),
        helperTextColor: $('#textbox-helper-text-color').val(),
    };
}

// Function to get StarRating colors
function getStarRatingColors() {
    return {
        starFillColor: $('#star-fill-color').val(),
        secondaryStarFillColor: $('#secondary-star-fill-color').val(),
    };
}

// Utility function to generate data attributes for colors
function generateDataAttributes(data) {
    return Object.entries(data)
        .map(([key, value]) => {
            // Convert camelCase to kebab-case and prefix with 'data-'
            const kebabKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            return `data-${kebabKey}="${value}"`;
        })
        .join(' ');
}
function generateCollapsibleColorsSection(componentId, colors,withMargin) {
    const colorPickers = generateColorPickers(colors, componentId, true); // Generate color pickers
    return `
                <button type="button" class="btn btn-icon toggle-collapse mt-2" data-target="#colors-${componentId}" style="${withMargin ? 'margin-top: 20px;' : 'margin-left:15px;'}">
                    <i class="fas fa-palette"
                       style="

                          margin-right: 5px;
                          background: linear-gradient(45deg, orange, red);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;">
                    </i>
                    <span style=" font-weight: bold;">Colors</span>
                    <i class="fas fa-chevron-down toggle-icon" style="color: #fff; margin-left: 10px;"></i>
                </button>
                <div id="colors-${componentId}" class="collapse mt-2" style="max-height: 0; overflow: hidden; ">
                    ${colorPickers}
                </div>
            `;
}


function generateColorPickers(colors, componentId) {
    let html = `<div class="colors-editor">`;
    Object.entries(colors).forEach(([key, value]) => {
        const displayKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
        html += `
                    <div class="color-picker-row" style="display: flex; align-items: center; margin-bottom: 10px; ">
                        <input
                            type="color"
                            class="color-picker"
                            data-key="${key}"
                            data-component-id="${componentId}"
                            value="${value}"
                            style="width: 40px; height: 30px; margin-right: 10px; border: none; background:#333333;"
                        />
                        <label style="font-size: 0.9rem; flex: 1;">${displayKey}</label>
                    </div>`;
    });
    html += '</div>';
    return html;
}




// Utility function to generate remove button HTML
function generateRemoveButton() {
    return `
                                            <button type="button" class="remove-component btn btn-icon" data-id="component-${componentCount}">
                                                <i class="fas fa-times" style="color: #e74c3c;"></i>
                                            </button>`;
}
function populateFormName(formName) {
    const formNameInput = $('#form-name'); // Select the form name input field
    if (formNameInput.length) {
        formNameInput.val(formName); // Set the form name value
    } else {
        console.error('Form name input field not found.');
    }
}
function applyTheme(theme, designData) {
    $('#theme-selection').val(theme);
    if (theme === 'custom') {
        $('.custom-options').removeClass('hidden');
        $('#background-color').val(designData?.backgroundColor || '#ffffff');
        $('#text-color').val(designData?.textColor || '#000000');
        $('#button-background-color').val(designData?.buttonBackgroundColor || '#007bff');
        $('#button-text-color').val(designData?.buttonTextColor || '#ffffff');
    } else {
        $('.custom-options').addClass('hidden');
        resetDesignColors();
    }
    return theme;
}


function resetDesignColors() {
    $('#background-color').val('');
    $('#text-color').val('');
    $('#button-background-color').val('');
    $('#button-text-color').val('');
}


// Function to reset the entire preview
function resetPreviewInit() {
    // Clear the form preview area
    $('#form-preview').empty();

    // Reset component and question counters
    componentCount =1;
    questionCount = 1;


}

function populateFormComponents(components, isCustomTheme) {
    let i = 0;
    components.forEach(component => {
        const previewHtml = createPreviewHtml(component, isCustomTheme, i++);
        if (previewHtml) {
            appendToFormPreview(previewHtml);
        }
    });
}

function createPreviewHtml(component, isCustomTheme, index) {
    const {type, text, secondaryText = '', options = [], colors = {}, additionalData= {}} = component; // Include secondaryText
    console.log(component);
    let previewHtml = '';
    // Handle special cases for the first two components by index
    if (index === 0) { // First component: User Info
        previewHtml = generateTitlePreview(isCustomTheme, colors);
    } else if (index === 1) { // Second component: Email
        previewHtml = generateEmailPreview(isCustomTheme, colors);
    } else {
        // Handle other components normally
        switch (type) {
            case 'combobox':
                previewHtml = createComboBoxPreview(text, isCustomTheme,colors,options);
                break;
            case 'textbox':
                previewHtml = createTextBoxPreview(text, secondaryText, isCustomTheme,colors);
                break;
            case 'star':
                previewHtml = createStarRatingPreview(text,isCustomTheme,colors);
                break;
            case 'title':
                previewHtml = createTitlePreview(text, isCustomTheme,colors);
                break;
            case 'scale-bar':
                previewHtml = createScaleBarPreview(text, isCustomTheme,colors,additionalData);
                break;
            default:
                console.error(`Unsupported component type: ${type}`);
                break;
        }
        componentCount++;
        if(type!== 'title')
        questionCount++;
        console.log(componentCount+ " " +questionCount);
    }

    return previewHtml;
}

function appendToFormPreview(html, isDefault = false) {
    const $component = $(html);

    if (isDefault) {
        $component.find('.remove-component').remove(); // Remove the delete button
    }

    $('#form-preview').append($component);
}


// Utility function to clear inputs
function clearInputs(type) {
    if (type === 'combobox') {
        $('#combobox-question').val('');
        $('.option-list').empty();
    } else if (type === 'textbox') {
        $('#textbox-question').val('');
        $('#textbox-hint').val('');
    } else if (type === 'star') {
        $('#star-question').val('');
    } else if (type === 'title') {
        $('#title-text').val('');
    }

    if (type !== 'title') {
        // Reset the input/textarea size
        const targetInput = $(`#${type}-question`);
        if (targetInput.length) {
            targetInput.css({width: '300px', height: '38px'}); // Reset to original size
        }
    } else {
        // Reset the input/textarea size
        const targetInput = $(`#${type}-text`);
        if (targetInput.length) {
            targetInput.css({width: '300px', height: '38px'}); // Reset to original size
        }
    }

}


// Validation Functions
function validateComboBox() {
    let questionText = $('#combobox-question').val().trim();

    if (!questionText) {
        alert('ComboBox requires a question.');
        return null;
    }

    if (!/\D/.test(questionText)) {
        alert('ComboBox question must contain at least one non-numeric character.');
        return null;
    }

    if (!questionText.endsWith('?')) {
        questionText += '?';
    }

    // Capitalize the first letter if it is alphabetic
    questionText = questionText.charAt(0).toUpperCase() + questionText.slice(1);

    // Check for duplicate question text
    const isDuplicateQuestion = $('#form-preview .textareaPreview').toArray().some(label => {
        return $(label).text().split('. ')[1] === questionText;
    });

    if (isDuplicateQuestion) {
        alert(`The question "${questionText}" already exists. Please enter a unique question.`);
        return null;
    }

    return questionText;
}

function validateTextBox() {
    let questionText = $('#textbox-question').val().trim();

    if (!questionText) {
        alert('TextBox requires a non-empty question.');
        return null;
    }

    if (!/\D/.test(questionText)) {
        alert('TextBox question must contain at least one non-numeric character.');
        return null;
    }

    if (!questionText.endsWith('?')) {
        questionText += '?';
    }

    // Capitalize the first letter if it is alphabetic
    questionText = questionText.charAt(0).toUpperCase() + questionText.slice(1);

    // Check for duplicate question text
    const isDuplicateQuestion = $('#form-preview .textareaPreview').toArray().some(label => {
        return $(label).text().split('. ')[1] === questionText;
    });

    if (isDuplicateQuestion) {
        alert(`The question "${questionText}" already exists. Please enter a unique question.`);
        return null;
    }

    return questionText;
}
function validateScaleBarOptions() {
    let questionText = $('#scale-bar-question').val().trim();

    if (!questionText) {
        alert('Scale bar requires a non-empty question.');
        return null;
    }

    if (!/\D/.test(questionText)) {
        alert('Scale bar question must contain at least one non-numeric character.');
        return null;
    }

    if (!questionText.endsWith('?')) {
        questionText += '?';
    }
    // Capitalize the first letter if it is alphabetic
    questionText = questionText.charAt(0).toUpperCase() + questionText.slice(1);

    // Check for duplicate question text
    const isDuplicateQuestion = $('#form-preview .textareaPreview').toArray().some(label => {
        return $(label).text().split('. ')[1] === questionText;
    });

    if (isDuplicateQuestion) {
        alert(`The question "${questionText}" already exists. Please enter a unique question.`);
        return null;
    }


    // Validate min and max values
    const minValueStr = $('#scale-bar-min-value').val().trim();
    const maxValueStr = $('#scale-bar-max-value').val().trim();


    // Check if they are valid integers (including negative numbers)
    if (!/^-?\d+$/.test(minValueStr) || !/^-?\d+$/.test(maxValueStr)) {
        alert('Scale bar min and max values must be valid integers.');
        return null;
    }

    const minValue = parseInt(minValueStr, 10);
    const maxValue = parseInt(maxValueStr, 10);

    if (minValue >= maxValue) {
        alert('Scale bar min value must be less than the max value.');
        return null;
    }
    // Validate unit is alphabetic only
    const unit = $('#scale-bar-unit').val().trim();
    if (unit && !/^[a-zA-Z]+$/.test(unit)) {
        alert('Scale bar unit must contain only alphabetic characters.');
        return null;
    }

    return questionText;
}

function validateStarRating() {
    let questionText = $('#star-question').val().trim();

    if (!questionText) {
        alert('5-Star Rating requires a non-empty question.');
        return null;
    }

    if (!/\D/.test(questionText)) {
        alert('5-Star Rating question must contain at least one non-numeric character.');
        return null;
    }

    if (!questionText.endsWith('?')) {
        questionText += '?';
    }

    // Capitalize the first letter if it is alphabetic
    questionText = questionText.charAt(0).toUpperCase() + questionText.slice(1);

    // Check for duplicate question text
    const isDuplicateQuestion = $('#form-preview .textareaPreview').toArray().some(label => {
        return $(label).text().split('. ')[1] === questionText;
    });

    if (isDuplicateQuestion) {
        alert(`The question "${questionText}" already exists. Please enter a unique question.`);
        return null;
    }

    return questionText;
}

function validateTitle() {
    let titleText = $('#title-text').val().trim();

    if (!titleText) {
        alert('Title requires a non-empty text.');
        return null;
    }

    if (!/\D/.test(titleText)) {
        alert('Title must contain at least one non-numeric character.');
        return null;
    }

    // Capitalize the first letter if it is alphabetic
    titleText = titleText.charAt(0).toUpperCase() + titleText.slice(1);

    return titleText;
}


// Function to collect design data based on the selected theme
function saveGetDesignData(theme) {
    if (theme === 'custom') {
        return {
            backgroundColor: $('#background-color').val(),
            textColor: $('#text-color').val(),
            buttonBackgroundColor: $('#button-background-color').val(),
            buttonTextColor: $('#button-text-color').val(),
        };
    }
    return {};
}

// Function to collect all components from the preview
function saveCollectComponents(theme) {
    const components = [];
    $('#form-preview .form-group').each(function (index) {
        const type = $(this).data('type') || 'unknown';
        const text = type === 'title' ? $(this).data('text') || '' : $(this).data('question') || ''; // Use `data-text` for titles, `data-question` for others

        const componentData = {
            type,
            text,
            order: index + 1,
        };

        if (type === 'combobox') {
            componentData.options = $(this).data('options') || [];
            componentData.colors = theme === 'custom' ? saveGetComboBoxColors($(this)) : {};
        } else if (type === 'textbox') {
            componentData.secondaryText = $(this).data('hint');
            componentData.colors = theme === 'custom' ? saveGetTextBoxColors($(this)) : {};
        } else if (type === 'star') {
            componentData.colors = theme === 'custom' ? saveGetStarColors($(this)) : {};
        } else if (type === 'title') {
            componentData.colors = theme === 'custom' ? saveGetTitleColors($(this)) : {};
        }
        else if (type === 'scale-bar') {
            componentData.additionalData = getAdditionalData($(this)) ;
            componentData.colors = theme === 'custom' ? saveGetScaleBarColors($(this)) : {};
        }

        components.push(componentData);
    });
    return components;
}
function getAdditionalData(element)
{
    return {
        min: element.data('min') || '',
        max: element.data('max') || '',
        unit: element.data('unit') || '',
    };
}

// Function to collect ComboBox colors
function saveGetComboBoxColors(element) {
    return {
        backgroundColor: element.data('background-color') || '',
        itemTextColor: element.data('item-text-color') || '',
        selectedItemTextColor: element.data('selected-item-text-color') || '',
        dropdownBackgroundColor: element.data('dropdown-background-color') || '',
        selectedItemBackgroundColor: element.data('selected-item-background-color') || '',
    };
}
function saveGetScaleBarColors(element) {
    return {
        textColor: element.data('text-color') || '',
        thumbAndTrailColor: element.data('thumb-and-trail-color') || '',
    };
}

function getScaleBarColors() {
    return {
        thumbAndTrailColor: $('#scale-bar-thumb-and-trail-color').val(),
        textColor: $('#scale-bar-text-color').val(),
    };
}
function getScaleBarAdditionalData() {
    return {
        min: parseFloat($('#scale-bar-min-value').val()) || 0,
        max : parseFloat($('#scale-bar-max-value').val()) || 100,
        unit : $('#scale-bar-unit').val() || '',
        };
}
// Function to collect TextBox colors
function saveGetTextBoxColors(element) {
    return {
        backgroundColor: element.data('background-color') || '',
        textColor: element.data('text-color') || '',
        hintColor: element.data('hint-color') || '',
        focusedHintColor: element.data('focused-hint-color') || '',
        boxStrokeColor: element.data('box-stroke-color') || '',
        focusedBoxStrokeColor: element.data('focused-box-stroke-color') || '',
        errorTextColor: element.data('error-text-color') || '',
        counterTextColor: element.data('counter-text-color') || '',
        cursorColor: element.data('cursor-color') || '',
        placeholderColor: element.data('placeholder-color') || '',
        helperTextColor: element.data('helper-text-color') || '',
    };
}

function saveGetTitleColors(element) {
    return {
        textColor: element.data('text-color') || '',
        backgroundColor: element.data('background-color') || '',
        borderColor: element.data('border-color') || '',
    };
}

// Function to collect Star Rating colors
function saveGetStarColors(element) {
    return {
        starFillColor: element.data('star-fill-color') || '',
        secondaryStarFillColor: element.data('secondary-star-fill-color') || '',
    };
}

// Function to save the form
async function saveForm(name, theme, designData, components) {
    const response = await fetch('/forms/save', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name,
            theme,
            designData,
            components,
        }),
    });

    const result = await response.json();
    if (response.ok) {
        window.location.href = `/success/${result.formId}`;
    } else {
        throw new Error(result.error || JSON.stringify(result) || 'Unknown server error');
    }

}






function updateQuestionNumbers() {
    const components = document.querySelectorAll('#form-preview .preview-card');
    let questionIndex = 0; // Separate counter for questions

    components.forEach((component) => {
        const type = component.dataset.type;

        if (type !== 'title') { // Skip titles
            const questionLabel = component.querySelector('.textareaPreview');
            if (questionLabel) {
                const textParts = questionLabel.value.split('. '); // Split on `. `
                const questionText = textParts.length > 1 ? textParts.slice(1).join('. ') : textParts[0];
                questionIndex++; // Increment only for questions
                questionLabel.value = `${questionIndex}. ${questionText}`;
            }
        }
    });
}
function showOverlay() {
    const overlay = document.getElementById('overlay');
    const dots = document.querySelectorAll('#loading-dots .dot');

    if (overlay) {
        overlay.style.visibility = 'visible';
    }

    let currentIndex = 0; // To track the current color

    // Start the color cycling interval
    colorCycleInterval = setInterval(() => {
        dots.forEach((dot, index) => {
            // Cycle through colors for each dot
            const colorIndex = (currentIndex + index) % colors.length;
            dot.style.backgroundColor = colors[colorIndex];
        });

        // Move to the next color in the cycle
        currentIndex = (currentIndex + 1) % colors.length;
    }, 500); // Change color every 500ms
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');

    if (overlay) {
        overlay.style.visibility = 'hidden';
    }

    // Clear the interval to stop color cycling
    if (colorCycleInterval) {
        clearInterval(colorCycleInterval);
        colorCycleInterval = null;
    }
}

function initializeSortable(previewListId, componentIds) {
    const previewList = getElementById(previewListId);

    if (!previewList) {
        console.error(`Preview list with ID "${previewListId}" not found.`);
        return;
    }

    // Initialize Sortable
    new Sortable(previewList, {
        animation: 150, // Smooth animation
        handle: '.preview-card', // Allow dragging on the entire card
        filter: componentIds.map(id => `#${id}`).join(', '), // Prevent these elements from being dragged
        onStart: function (evt) {
            const el = evt.item;
            if (componentIds.includes(el.id)) {
                evt.preventDefault(); // Cancel dragging for these components
            }
        },
        onEnd: function () {
            // Ensure specified components remain at the top in the correct order
            for (let i = componentIds.length - 1; i >= 0; i--) {
                const id = componentIds[i];
                const element = getElementById(id);
                if (element) {
                    previewList.prepend(element); // Prepend elements in reverse order
                }
            }

            updateQuestionNumbers(); // Update numbering after reordering
        },
    });

    // Append default previews
    appendToFormPreview(defaultTitlePreview(false), true);
    appendToFormPreview(defaultEmailPreview(false), true);
}

function initializeGenerateButton(buttonId, subjectInputId, themeSelectId) {
    const generateButton = getElementById(buttonId);

    if (!generateButton) {
        console.error(`Button with ID "${buttonId}" not found.`);
        return;
    }

    generateButton.addEventListener('click', async () => {
        const subject = getInputValue(subjectInputId);
        const theme = getSelectValue(themeSelectId, 'light'); // Default to 'light' theme

        if (!validateSubject(subject)) return;

        showOverlay();
        await generateForm(subject, theme);
        hideOverlay();
    });
}

// Function to retrieve input value
function getInputValue(inputId) {
    const inputElement = getElementById(inputId);
    return inputElement ? inputElement.value.trim() : '';
}

// Function to retrieve selected value with a default fallback
function getSelectValue(selectId, defaultValue) {
    const selectElement = getElementById(selectId);
    return selectElement ? selectElement.value : defaultValue;
}
// Function to validate subject input
function validateSubject(subject) {
    if (!subject) {
        alert('Please enter a subject for form generation.');
        return false;
    }
    return true;
}
async function generateForm(subject, theme) {
    try {
        const response = await fetch(`/forms/generate-form/${encodeURIComponent(subject)}/${encodeURIComponent(theme)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const rawText = await response.text();
        console.log('Raw Response Text:', rawText);

        const form = parseResponse(rawText);
        if (response.ok) {
            handleSuccessfulGeneration(form);
        } else {
            handleGenerationError(form.message);
        }
    } catch (error) {
        handleNetworkError(error);
    }
}
// Function to parse API response
function parseResponse(rawText) {
    try {
        return JSON.parse(rawText);
    } catch (error) {
        console.error('Error parsing response:', error);
        throw new Error('Invalid response format.');
    }
}
// Function to handle successful form generation
function handleSuccessfulGeneration(form) {
    console.log('Parsed JSON Response:', form);
    populateFormName(form.name); // Populate the form name
    mode = applyTheme(form.theme, form.designData); // Apply the selected theme
    resetPreviewInit(); // Clear the preview and reset counters
    populateFormComponents(form.components, form.theme === 'custom'); // Populate components into the preview
    updateQuestionNumbers(); // Update question numbering
}

// Function to handle API errors
function handleGenerationError(message) {
    alert(`Error generating form: ${message || 'Unexpected error occurred'}`);
}

// Function to handle network errors
function handleNetworkError(error) {
    alert(`Error: ${error.message || 'An unexpected error occurred'}`);
}

// Initialize theme selection change listener
function initializeThemeSelection() {
    const $themeSelection = $('#theme-selection'); // Use cached jQuery
    $themeSelection.on('change', function () {
        const newMode = $(this).val(); // Get the new mode
        const isCustomMode = newMode === 'custom';
        console.log(mode + " "+ newMode);
        const componentsList = $('#form-preview .form-group');

        if (componentsList.length > 2) {
            if (shouldResetPreview(mode, newMode)) {
                if (!confirmResetPreview(newMode)) {
                    // Revert to the previous mode if not confirmed
                    $(this).val(mode);
                    return;
                }
                resetPreview(); // Reset if confirmed
            }
        }
        else
        {
            resetPreview(); // Reset if confirmed
        }

        toggleCustomOptions(isCustomMode);
        mode = newMode; // Update the mode variable
    });
}
// Check if reset is necessary
function shouldResetPreview(currentMode, newMode) {
    return (
        (currentMode === "custom" && newMode !== "custom") ||
        (currentMode !== "custom" && newMode === "custom")
    );
}

// Show confirmation dialog
function confirmResetPreview(newMode) {
    return confirm(`Are you sure you want to change modes to ${newMode}? This will delete all the questions you created.`);
}

// Toggle visibility of custom options
function toggleCustomOptions(isCustomMode) {
    const $customOptions = $('.custom-options');
    const $collapsibleSections = $('.collapse');

    if (isCustomMode) {
        $customOptions.removeClass('hidden'); // Show custom options
        $collapsibleSections.removeClass('hidden'); // Ensure collapsibles are visible
    } else {
        $customOptions.addClass('hidden'); // Hide custom options
        $collapsibleSections.addClass('hidden').removeClass('open').css('max-height', '0'); // Hide collapsibles
    }
}

// Initialize ComboBox Option Adding
function initializeAddComboBoxOption() {
    $('.add-combobox-option').click(function () {
        const enteredText = getLastComboBoxOptionText();
        const existingOptionsCount = countComboBoxOptions();
        console.log(enteredText+" "+existingOptionsCount);

        if (!validateComboBoxOption(enteredText, existingOptionsCount)) {
            return;
        }
        removeDuplicateComboBoxOption(enteredText);
        appendComboBoxOption();
    });
}

// Get the text from the last ComboBox option input
function getLastComboBoxOptionText() {
    return $('.option-input:last').val()?.trim();
}

// Count the existing ComboBox options
function countComboBoxOptions() {
    return $('.option-list .option-input').length;
}

// Validate the new ComboBox option input
function validateComboBoxOption(enteredText, existingOptionsCount) {
    if (!enteredText && existingOptionsCount > 1) {
        alert('Please enter a valid option text.');
        return false;
    }
    return true;
}


// Remove duplicate ComboBox option
function removeDuplicateComboBoxOption(enteredText) {
    $('.option-list .option-input')
        .not(':last') // Exclude the last input field
        .filter(function () {
            return $(this).val().trim() === enteredText;
        })
        .closest('.option-item')
        .remove();
}

// Append a new ComboBox option to the list
function appendComboBoxOption() {
    const optionHtml = `
                <div class="option-item">
                    <input type="text" class="form-control option-input mt-2" placeholder="Enter option text" style="font-style: italic; font-size: 0.7rem;">
                    <button type="button" class="btn btn-icon remove-option">
                        <i class="fas fa-times" style="color: #e74c3c;"></i>
                    </button>
                </div>`;
    $('.option-list').append(optionHtml);
}

// Function to handle adding components to the form
function addComponentToForm(type) {
    const isCustomMode = mode === 'custom';
    let text;
    let hint;

    // Validate and get the text input for the component
    text = validateComponent(type);
    if (!text) return; // Exit if validation fails

    // Handle special cases like title-specific validation or hint for textboxes
    if (!validateSpecialCases(type, text)) return;

    // Handle hint for textboxes
    if (type === 'textbox') {
        hint = getHintForTextbox();
    }
    if(type==='scale-bar')
    {
        const min = parseFloat($('#scale-bar-min-value').val()) || 0;
        const max = parseFloat($('#scale-bar-max-value').val()) || 0;
        if(min>=max)
        {
            alert('Minimum value should be less than maximum value.');
            return null;
        }

    }


    // Generate preview HTML based on type
    const previewHtml = generateComponentPreview(type, text, hint, isCustomMode);
    if (!previewHtml) return; // Exit if preview generation fails
    componentCount++;

    if (type !== 'title') {
        questionCount++;
    }

    // Append the generated component to the preview
    appendToFormPreview(previewHtml);

    // Clear inputs for the next component
    clearInputs(type);
}

// Function to validate and retrieve text for a specific component type
function validateComponent(type) {
    switch (type) {
        case 'combobox':
            return validateComboBox();
        case 'textbox':
            return validateTextBox();
        case 'star':
            return validateStarRating();
        case 'title':
            return validateTitle();
        case 'scale-bar':
           return validateScaleBarOptions();
        default:
            alert('Invalid component type.');
            return null;
    }
}

// Function to validate special cases like titles or consecutive components
function validateSpecialCases(type) {
    if (type === 'title') {
        const lastComponentType = $('#form-preview .form-group').last().data('type');
        if (lastComponentType === 'title') {
            alert('Cannot add consecutive titles.');
            return false;
        }
    }
    return true;
}

// Function to get hint for textboxes
function getHintForTextbox() {
    const hint = $('#textbox-hint').val().trim();
    return hint || 'Enter answer here';
}

// Function to generate preview HTML for a component
function generateComponentPreview(type, text, hint, isCustomMode) {
    switch (type) {
        case 'combobox':
            return createComboBoxPreview(text, isCustomMode);
        case 'textbox':
            return createTextBoxPreview(text, hint, isCustomMode);
        case 'star':
            return createStarRatingPreview(text, isCustomMode);
        case 'title':
            return createTitlePreview(text, isCustomMode);
        case 'scale-bar':
            return createScaleBarPreview(text,isCustomMode);
        default:
            return null;
    }
}

// Main function to handle form saving
async function handleSaveForm() {
    const formName = getFormName();
    const saveButton = $('#save-form'); // Get the save button element
    if (!validateFormName(formName)) return;

    const componentsList = getFormComponents();
    if (!validateComponents(componentsList)) return;

    if (!validateTitlePlacement(componentsList)) return;

    const theme = mode;
    const designData = saveGetDesignData(theme);
    const components = saveCollectComponents(theme);

    saveButton.prop('disabled', true); // Disable the button
    try {
        await saveForm(formName, theme, designData, components);
    } catch (err) {
        console.error(err);
        alert(err);
    } finally {
        saveButton.prop('disabled', false); // Re-enable the button
    }
}
// Function to retrieve form name
function getFormName() {
    return $('#form-name').val().trim();
}
function getSelectedFormId() {
    const formId = $('#form-id').val(); // Get the form ID
    if (!formId) {
        alert('Please select a form ID.');
        return null;
    }
    return formId;
}
function handleFormLoadError(error) {
    console.error('Error loading form:', error);
    alert('Failed to load the form.');
}
// Main function to handle form saving
async function handleUpdateForm() {

    const formName = getFormName();

    const formId = $('#form-id').val().trim();
    const saveButton = $('#save-form'); // Get the save button element

    if (!validateFormName(formName)) return;

    const componentsList = getFormComponents();
    if (!validateComponents(componentsList)) return;

    if (!validateTitlePlacement(componentsList)) return;

    const theme = mode;
    const designData = saveGetDesignData(theme);
    const components = saveCollectComponents(theme);

    saveButton.prop('disabled', true); // Disable the button
    try {
        await updateForm(formId,formName, theme, designData, components);
    } catch (err) {
        console.error(err);
        alert(err);
    } finally {
        saveButton.prop('disabled', false); // Re-enable the button
    }
}

async function updateForm(formId, name, theme, designData, components) {
    const url = formId ? `/forms/${formId}` : '/forms/save'; // Use PUT if formId exists, otherwise POST
    const method = formId ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            theme,
            designData,
            components,
        }),
    });

    const result = await response.json();
    if (response.ok) {
        window.location.href = `/success/${result.formId}`;
    } else {
        throw new Error(result.error || 'Unknown server error'); // Rethrow the error
    }

}




// Function to validate the form name
function validateFormName(formName) {
    if (!formName) {
        alert('Form name cannot be empty.');
        return false;
    }
    return true;
}
function getFormComponents() {
    return $('#form-preview .form-group');
}

// Function to validate components
function validateComponents(componentsList) {
    if (componentsList.length <= 2) {
        alert('Please add at least one component before saving the form.');
        return false;
    }

    if (questionCount <= 1) {
        alert('Please add at least one question before saving the form.');
        return false;
    }

    return true;
}

// Function to validate title placement
function validateTitlePlacement(componentsList) {
    let validTitles = true;

    componentsList.each(function (index) {
        const type = $(this).data('type');
        if (type === 'title') {
            // Check if the next component exists and is not another title
            const nextComponent = componentsList.eq(index + 1);
            if (!nextComponent.length || nextComponent.data('type') === 'title') {
                alert('Each title must be followed by at least one component.');
                validTitles = false;
                return false; // Break the loop
            }
        }
    });

    return validTitles;
}

// Main function to handle auto-resizing of input elements
function handleAutoResize(element) {
    const maxWidth = calculateMaxWidth(element);
    const currentLineWidth = calculateCurrentLineWidth(element);
    element.style.width = `${Math.max(currentLineWidth, maxWidth)}px`;
}

// Function to calculate the maximum width based on all lines
function calculateMaxWidth(element) {
    if (!element.dataset.maxWidth) {
        element.dataset.maxWidth = '300'; // Default minimum width
    }

    const text = element.value;
    const lines = text.split('\n'); // Split text into lines
    let maxWidth = 300; // Start with the default minimum width

    lines.forEach(line => {
        const lineWidth = measureTextWidth(line, element) + 60; // Add padding for readability
        maxWidth = Math.max(maxWidth, lineWidth); // Update maxWidth if current line exceeds it
    });

    element.dataset.maxWidth = maxWidth; // Update the overall maxWidth
    return maxWidth;
}

// Function to calculate the width of the current line
function calculateCurrentLineWidth(element) {
    const text = element.value;
    const lines = text.split('\n');
    const currentLine = lines[lines.length - 1] || ''; // Handle empty last line

    return measureTextWidth(currentLine, element) + 60; // Add padding for readability
}

// Utility function to measure text width
function measureTextWidth(text, element) {
    const tempSpan = $('<span>')
        .text(text) // Set the text to measure
        .css({
            visibility: 'hidden',
            whiteSpace: 'nowrap',
            fontSize: $(element).css('font-size'),
            fontFamily: $(element).css('font-family'),
            position: 'absolute',
        })
        .appendTo('body');

    const textWidth = tempSpan.width();
    tempSpan.remove();
    return textWidth;
}

// Main function to handle form load
async function handleFormLoad() {
    const formId = getSelectedFormId();
    if (!formId) return;

    try {
        const form = await fetchFormData(formId);
        processLoadedForm(form);
        showToolbarAndSaveButton();
    } catch (error) {
        handleFormLoadError(error);
    }
}

// Function to process the loaded form data
function processLoadedForm(form) {
    console.log(form);
    populateFormName(form.name); // Populate the form name
    mode = applyTheme(form.theme, form.designData); // Apply theme
    resetPreviewInit(); // Reset preview
    populateFormComponents(form.components, form.theme === 'custom'); // Populate components
    updateQuestionNumbers(); // Update numbering
}

// Function to show toolbar and save button
function showToolbarAndSaveButton() {
    $('.row#toolbar-row.hidden').removeClass('hidden'); // Show the toolbar
    $('button#save-form.hidden').removeClass('hidden'); // Show the save button
}
