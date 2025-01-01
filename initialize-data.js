const Form = require('./models/Form'); // Import the Form model
const Feedback = require('./models/Feedback'); // Import the Feedback model
const User = require('./models/User');
/* Paste your JSON array of forms here */
const exampleForms = [{"designData":{"backgroundColor":"#f7f7f7","textColor":"#333333","buttonBackgroundColor":"#4caf50","buttonTextColor":"#ffffff"},"_id":"6762c6c4a1b1d4a374052e1a","name":"Survey about fun in the workplace","theme":"custom","components":[{"type":"title","text":"User Info","order":1,"options":[],"colors":{"textColor":"#2196F3","backgroundColor":"#FFFFFF","borderColor":"#CCCCCC"},"_id":"6762c823a1b1d4a374053213"},{"type":"textbox","text":"Email","secondaryText":"Enter your email address","order":2,"options":[],"colors":{"backgroundColor":"#FFFFFF","textColor":"#333333","hintColor":"#AAAAAA","focusedHintColor":"#666666","boxStrokeColor":"#CCCCCC","focusedBoxStrokeColor":"#4CAF50","errorTextColor":"#FF0000","counterTextColor":"#666666","cursorColor":"#333333","placeholderColor":"#AAAAAA","helperTextColor":"#666666"},"_id":"6762c823a1b1d4a374053214"},{"type":"title","text":"Introduction to the survey","order":3,"options":[],"colors":{"textColor":"#8BC34A","backgroundColor":"#FFFFFF","borderColor":"#CCCCCC"},"_id":"6762c823a1b1d4a374053215"},{"type":"textbox","text":"What do you like most about your workplace?","secondaryText":"Please provide your honest feedback","order":4,"options":[],"colors":{"backgroundColor":"#FFFFFF","textColor":"#333333","hintColor":"#AAAAAA","focusedHintColor":"#666666","boxStrokeColor":"#CCCCCC","focusedBoxStrokeColor":"#4CAF50","errorTextColor":"#FF0000","counterTextColor":"#666666","cursorColor":"#333333","placeholderColor":"#AAAAAA","helperTextColor":"#666666"},"_id":"6762c823a1b1d4a374053216"},{"type":"textbox","text":"What can be improved in your workplace?","secondaryText":"Your feedback is valuable to us","order":5,"options":[],"colors":{"backgroundColor":"#FFFFFF","textColor":"#333333","hintColor":"#AAAAAA","focusedHintColor":"#666666","boxStrokeColor":"#CCCCCC","focusedBoxStrokeColor":"#4CAF50","errorTextColor":"#FF0000","counterTextColor":"#666666","cursorColor":"#333333","placeholderColor":"#AAAAAA","helperTextColor":"#666666"},"_id":"6762c823a1b1d4a374053217"},{"type":"textbox","text":"How often do you participate in team-building activities?","secondaryText":"Please provide your honest feedback","order":6,"options":[],"colors":{"backgroundColor":"#FFFFFF","textColor":"#333333","hintColor":"#AAAAAA","focusedHintColor":"#666666","boxStrokeColor":"#CCCCCC","focusedBoxStrokeColor":"#4CAF50","errorTextColor":"#FF0000","counterTextColor":"#666666","cursorColor":"#333333","placeholderColor":"#AAAAAA","helperTextColor":"#666666"},"_id":"6762c823a1b1d4a374053218"},{"type":"title","text":"Workplace environment","order":7,"options":[],"colors":{"textColor":"#FF9800","backgroundColor":"#FFFFFF","borderColor":"#CCCCCC"},"_id":"6762c823a1b1d4a374053219"},{"type":"combobox","text":"How would you rate the overall atmosphere of your workplace?","order":8,"options":[{"option_text":"Excellent","order":1,"_id":"6762c6bfa1b1d4a374052e07"},{"option_text":"Good","order":2,"_id":"6762c6bfa1b1d4a374052e08"},{"option_text":"Fair","order":3,"_id":"6762c6bfa1b1d4a374052e09"},{"option_text":"Poor","order":4,"_id":"6762c6bfa1b1d4a374052e0a"}],"colors":{"backgroundColor":"#FFFFFF","itemTextColor":"#333333","selectedItemTextColor":"#4CAF50","dropdownBackgroundColor":"#FFFFFF","selectedItemBackgroundColor":"#4CAF50"},"_id":"6762c823a1b1d4a37405321a"},{"type":"combobox","text":"How would you rate the level of communication between team members?","order":9,"options":[{"option_text":"Excellent","order":1,"_id":"6762c6bfa1b1d4a374052e0c"},{"option_text":"Good","order":2,"_id":"6762c6bfa1b1d4a374052e0d"},{"option_text":"Fair","order":3,"_id":"6762c6bfa1b1d4a374052e0e"},{"option_text":"Poor","order":4,"_id":"6762c6bfa1b1d4a374052e0f"}],"colors":{"backgroundColor":"#FFFFFF","itemTextColor":"#333333","selectedItemTextColor":"#4CAF50","dropdownBackgroundColor":"#FFFFFF","selectedItemBackgroundColor":"#4CAF50"},"_id":"6762c823a1b1d4a37405321f"},{"type":"combobox","text":"How would you rate the level of support from your manager?","order":10,"options":[{"option_text":"Excellent","order":1,"_id":"6762c6bfa1b1d4a374052e11"},{"option_text":"Good","order":2,"_id":"6762c6bfa1b1d4a374052e12"},{"option_text":"Fair","order":3,"_id":"6762c6bfa1b1d4a374052e13"},{"option_text":"Poor","order":4,"_id":"6762c6bfa1b1d4a374052e14"}],"colors":{"backgroundColor":"#FFFFFF","itemTextColor":"#333333","selectedItemTextColor":"#4CAF50","dropdownBackgroundColor":"#FFFFFF","selectedItemBackgroundColor":"#4CAF50"},"_id":"6762c823a1b1d4a374053224"},{"type":"title","text":"Job satisfaction","order":11,"options":[],"colors":{"textColor":"#3F51B5","backgroundColor":"#FFFFFF","borderColor":"#CCCCCC"},"_id":"6762c823a1b1d4a374053229"},{"type":"star","text":"How satisfied are you with your job?","order":12,"options":[],"colors":{"starFillColor":"#FFD700","secondaryStarFillColor":"#CCCCCC"},"_id":"6762c823a1b1d4a37405322a"},{"type":"star","text":"How likely are you to recommend your workplace to a friend?","order":13,"options":[],"colors":{"starFillColor":"#FFD700","secondaryStarFillColor":"#CCCCCC"},"_id":"6762c823a1b1d4a37405322b"},{"type":"scale-bar","text":"How many hours do you work per week?","order":14,"options":[],"colors":{"textColor":"#333333","thumbAndTrailColor":"#4CAF50"},"additionalData":{"min":20,"max":60,"unit":"hours"},"_id":"6762c823a1b1d4a37405322c"},{"type":"scale-bar","text":"How many days per week do you feel stressed at work?","order":15,"options":[],"colors":{"textColor":"#333333","thumbAndTrailColor":"#4CAF50"},"additionalData":{"min":"","max":7,"unit":"days"},"_id":"6762c823a1b1d4a37405322d"}],"created_at":"2024-12-18T12:57:40.331Z","updated_at":"2024-12-18T13:03:31.254Z","__v":0},{"designData":{"backgroundColor":"#f7f7f7","textColor":"#333333","buttonBackgroundColor":"#4caf50","buttonTextColor":"#ffffff"},"_id":"6762c6d7a1b1d4a374052e6c","name":"Math Test Form","theme":"custom","components":[{"type":"title","text":"User Info","order":1,"options":[],"colors":{"textColor":"#212121","backgroundColor":"#C5CAE9","borderColor":"#7A288A"},"_id":"6762c6d7a1b1d4a374052e6d"},{"type":"textbox","text":"Email","secondaryText":"Enter your email address","order":2,"options":[],"colors":{"backgroundColor":"#FFFFFF","textColor":"#000000","hintColor":"#AAAAAA","focusedHintColor":"#666666","boxStrokeColor":"#DDDDDD","focusedBoxStrokeColor":"#AAAAAA","errorTextColor":"#FF0000","counterTextColor":"#666666","cursorColor":"#000000","placeholderColor":"#AAAAAA","helperTextColor":"#666666"},"_id":"6762c6d7a1b1d4a374052e6e"},{"type":"title","text":"Math Basics","order":3,"options":[],"colors":{"textColor":"#3498DB","backgroundColor":"#F1C40F","borderColor":"#E74C3C"},"_id":"6762c6d7a1b1d4a374052e6f"},{"type":"combobox","text":"What is the value of x in 2x + 5 = 11?","order":4,"options":[{"option_text":"2","order":1,"_id":"6762c6d4a1b1d4a374052e58"},{"option_text":"3","order":2,"_id":"6762c6d4a1b1d4a374052e59"},{"option_text":"4","order":3,"_id":"6762c6d4a1b1d4a374052e5a"}],"colors":{"backgroundColor":"#ECF0F1","itemTextColor":"#333333","selectedItemTextColor":"#FFFFFF","dropdownBackgroundColor":"#7F8C8D","selectedItemBackgroundColor":"#2ECC71"},"_id":"6762c6d7a1b1d4a374052e70"},{"type":"textbox","text":"Solve for y in the equation y - 3 = 7","secondaryText":"Use basic algebra to isolate y","order":5,"options":[],"colors":{"backgroundColor":"#FFFFFF","textColor":"#000000","hintColor":"#AAAAAA","focusedHintColor":"#666666","boxStrokeColor":"#DDDDDD","focusedBoxStrokeColor":"#AAAAAA","errorTextColor":"#FF0000","counterTextColor":"#666666","cursorColor":"#000000","placeholderColor":"#AAAAAA","helperTextColor":"#666666"},"_id":"6762c6d7a1b1d4a374052e74"},{"type":"combobox","text":"What is the formula for the area of a circle?","order":6,"options":[{"option_text":"A = πr^2","order":1,"_id":"6762c6d4a1b1d4a374052e5d"},{"option_text":"A = 2πr","order":2,"_id":"6762c6d4a1b1d4a374052e5e"},{"option_text":"A = πd","order":3,"_id":"6762c6d4a1b1d4a374052e5f"}],"colors":{"backgroundColor":"#ECF0F1","itemTextColor":"#333333","selectedItemTextColor":"#FFFFFF","dropdownBackgroundColor":"#7F8C8D","selectedItemBackgroundColor":"#2ECC71"},"_id":"6762c6d7a1b1d4a374052e75"},{"type":"title","text":"Geometry","order":7,"options":[],"colors":{"textColor":"#9B59B6","backgroundColor":"#1ABC9C","borderColor":"#16A085"},"_id":"6762c6d7a1b1d4a374052e79"},{"type":"star","text":"Rate your understanding of geometric shapes","order":8,"options":[],"colors":{"starFillColor":"#F1C40F","secondaryStarFillColor":"#E74C3C"},"_id":"6762c6d7a1b1d4a374052e7a"},{"type":"scale-bar","text":"How confident are you in solving geometry problems?","order":9,"options":[],"colors":{"textColor":"#000000","thumbAndTrailColor":"#2ECC71"},"additionalData":{"min":1,"max":10,"unit":"confidence level"},"_id":"6762c6d7a1b1d4a374052e7b"},{"type":"textbox","text":"What is the perimeter of a rectangle with length 6cm and width 4cm?","secondaryText":"Use the formula P = 2(l + w)","order":10,"options":[],"colors":{"backgroundColor":"#FFFFFF","textColor":"#000000","hintColor":"#AAAAAA","focusedHintColor":"#666666","boxStrokeColor":"#DDDDDD","focusedBoxStrokeColor":"#AAAAAA","errorTextColor":"#FF0000","counterTextColor":"#666666","cursorColor":"#000000","placeholderColor":"#AAAAAA","helperTextColor":"#666666"},"_id":"6762c6d7a1b1d4a374052e7c"},{"type":"combobox","text":"What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?","order":11,"options":[{"option_text":"Pythagorean Theorem","order":1,"_id":"6762c6d4a1b1d4a374052e65"},{"option_text":"Angle Sum Theorem","order":2,"_id":"6762c6d4a1b1d4a374052e66"},{"option_text":"Triangle Inequality Theorem","order":3,"_id":"6762c6d4a1b1d4a374052e67"}],"colors":{"backgroundColor":"#ECF0F1","itemTextColor":"#333333","selectedItemTextColor":"#FFFFFF","dropdownBackgroundColor":"#7F8C8D","selectedItemBackgroundColor":"#2ECC71"},"_id":"6762c6d7a1b1d4a374052e7d"},{"type":"title","text":"Algebra","order":12,"options":[],"colors":{"textColor":"#1ABC9C","backgroundColor":"#9B59B6","borderColor":"#16A085"},"_id":"6762c6d7a1b1d4a374052e81"},{"type":"star","text":"Rate your understanding of algebraic expressions","order":13,"options":[],"colors":{"starFillColor":"#F1C40F","secondaryStarFillColor":"#E74C3C"},"_id":"6762c6d7a1b1d4a374052e82"},{"type":"scale-bar","text":"How confident are you in solving algebraic equations?","order":14,"options":[],"colors":{"textColor":"#000000","thumbAndTrailColor":"#2ECC71"},"additionalData":{"min":1,"max":10,"unit":"confidence level"},"_id":"6762c6d7a1b1d4a374052e83"},{"type":"textbox","text":"Solve for x in the equation 2x^2 + 5x - 3 = 0","secondaryText":"Use the quadratic formula x = (-b ± √(b^2 - 4ac)) / 2a","order":15,"options":[],"colors":{"backgroundColor":"#FFFFFF","textColor":"#000000","hintColor":"#AAAAAA","focusedHintColor":"#666666","boxStrokeColor":"#DDDDDD","focusedBoxStrokeColor":"#AAAAAA","errorTextColor":"#FF0000","counterTextColor":"#666666","cursorColor":"#000000","placeholderColor":"#AAAAAA","helperTextColor":"#666666"},"_id":"6762c6d7a1b1d4a374052e84"}],"created_at":"2024-12-18T12:57:59.565Z","updated_at":"2024-12-18T12:57:59.565Z","__v":0},{"designData":{"backgroundColor":null,"textColor":null,"buttonBackgroundColor":null,"buttonTextColor":null},"_id":"6762c6ffa1b1d4a374052ebc","name":"Geographic Test Form","theme":"light","components":[{"type":"title","text":"User Info","order":1,"colors":{},"_id":"6762e662bbd5a34b8361afac","options":[]},{"type":"textbox","text":"Email","secondaryText":"Enter your email address","order":2,"colors":{},"_id":"6762e662bbd5a34b8361afad","options":[]},{"type":"title","text":"Geographic Location","order":3,"colors":{},"_id":"6762e662bbd5a34b8361afae","options":[]},{"type":"combobox","text":"Which continent do you live in?","order":4,"options":[{"option_text":"Africa","order":1,"_id":"6762c6fba1b1d4a374052ea4"},{"option_text":"Asia","order":2,"_id":"6762c6fba1b1d4a374052ea5"},{"option_text":"Europe","order":3,"_id":"6762c6fba1b1d4a374052ea6"},{"option_text":"North America","order":4,"_id":"6762c6fba1b1d4a374052ea7"},{"option_text":"South America","order":5,"_id":"6762c6fba1b1d4a374052ea8"},{"option_text":"Australia","order":6,"_id":"6762c6fba1b1d4a374052ea9"},{"option_text":"Antarctica","order":7,"_id":"6762c6fba1b1d4a374052eaa"}],"colors":{},"_id":"6762e662bbd5a34b8361afaf"},{"type":"textbox","text":"What is the capital of your country?","secondaryText":"Type the name of the capital city of your country","order":5,"colors":{},"_id":"6762e662bbd5a34b8361afb7","options":[]},{"type":"textbox","text":"What is the largest city in your country?","secondaryText":"Type the name of the largest city in your country","order":6,"colors":{},"_id":"6762e662bbd5a34b8361afb8","options":[]},{"type":"textbox","text":"What is the longest river in your country?","secondaryText":"Try to look on google maps, its might help","order":7,"colors":{},"_id":"6762e662bbd5a34b8361afb9","options":[]},{"type":"title","text":"Geographic Features","order":8,"colors":{},"_id":"6762e662bbd5a34b8361afba","options":[]},{"type":"star","text":"How would you rate your knowledge of geography?","order":9,"colors":{},"_id":"6762e662bbd5a34b8361afbb","options":[]},{"type":"scale-bar","text":"How many countries have you visited?","order":10,"colors":{},"additionalData":{"min":"","max":100,"unit":"countries"},"_id":"6762e662bbd5a34b8361afbc","options":[]},{"type":"title","text":"Geographic Preferences","order":11,"colors":{},"_id":"6762e662bbd5a34b8361afbd","options":[]},{"type":"textbox","text":"What is your favorite type of geographic feature?","secondaryText":"Type the name of your favorite type of geographic feature","order":12,"colors":{},"_id":"6762e662bbd5a34b8361afbe","options":[]},{"type":"combobox","text":"What is your favorite type of geographic location?","order":13,"options":[{"option_text":"Mountain","order":1,"_id":"6762c6fba1b1d4a374052eb7"},{"option_text":"Beach","order":2,"_id":"6762c6fba1b1d4a374052eb8"},{"option_text":"City","order":3,"_id":"6762c6fba1b1d4a374052eb9"}],"colors":{},"_id":"6762e662bbd5a34b8361afbf"},{"type":"star","text":"How would you rate your overall satisfaction with the geographic test?","order":14,"colors":{},"_id":"6762e662bbd5a34b8361afc3","options":[]},{"type":"scale-bar","text":"How likely are you to recommend this geographic test to others?","order":15,"colors":{},"additionalData":{"min":"","max":10,"unit":"rating"},"_id":"6762e662bbd5a34b8361afc4","options":[]}],"created_at":"2024-12-18T12:58:39.069Z","updated_at":"2024-12-18T15:12:34.556Z","__v":1}];
/* Paste your JSON array of feedbacks here */
const exampleFeedbacks = [
    //form1
    {
        "_id": "6762cda0ffc32b1d46b0e14c",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "aviad825@gmail.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "Nothing", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "3. Fair", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "never", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "2.5", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "5 days", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "38 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "1.5", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "add a Sony playstation", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "4. Poor", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "2. Good", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-18T13:26:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e15c",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "user2@example.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "The team spirit", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "2. Good", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "Monthly", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "3.0", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "2 days", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "40 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "4.0", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "Better coffee", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "3. Fair", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "1. Excellent", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-18T13:30:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e16c",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "user3@example.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "The flexible hours", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "1. Excellent", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "Weekly", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "4.0", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "1 day", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "35 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "4.5", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "More remote work options", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "1. Excellent", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "1. Excellent", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-18T13:32:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e17c",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "user4@example.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "The challenging tasks", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "3. Fair", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "Rarely", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "3.5", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "3 days", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "45 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "3.5", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "More frequent team events", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "2. Good", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "3. Fair", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-18T13:34:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e17d",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "user5@example.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "The office snacks", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "4. Poor", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "Never", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "2.0", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "6 days", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "50 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "1.0", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "Better lighting", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "4. Poor", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "3. Fair", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-18T13:40:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e17e",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "user6@example.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "The career growth opportunities", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "1. Excellent", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "Quarterly", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "5.0", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "0 days", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "30 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "5.0", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "Nothing, it's great!", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "1. Excellent", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "1. Excellent", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-18T13:42:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e17f",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "user7@example.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "The mentorship program", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "2. Good", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "Annually", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "4.0", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "4 days", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "40 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "3.5", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "Flexible start times", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "2. Good", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "3. Fair", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-18T13:45:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e180",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "user8@example.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "The diversity of the team", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "2. Good", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "Weekly", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "3.5", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "3 days", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "42 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "3.0", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "More team outings", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "3. Fair", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "3. Fair", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-18T13:47:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e181",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "user9@example.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "The holiday parties", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "4. Poor", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "Rarely", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "2.5", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "5 days", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "48 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "2.0", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "More vacation days", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "4. Poor", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "3. Fair", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-18T13:50:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e182",
        "formId": "6762c6c4a1b1d4a374052e1a",
        "email": "user10@example.com",
        "responses": {
            "What do you like most about your workplace?": { "answer": "The collaborative environment", "type": "textbox", "order": 4 },
            "How would you rate the overall atmosphere of your workplace?": { "answer": "2. Good", "type": "combobox", "order": 8 },
            "How often do you participate in team-building activities?": { "answer": "Bi-weekly", "type": "textbox", "order": 6 },
            "How satisfied are you with your job?": { "answer": "4.5", "type": "star", "order": 12 },
            "How many days per week do you feel stressed at work?": { "answer": "1 day", "type": "scale-bar", "order": 15 },
            "How many hours do you work per week?": { "answer": "32 hours", "type": "scale-bar", "order": 14 },
            "How likely are you to recommend your workplace to a friend?": { "answer": "4.0", "type": "star", "order": 13 },
            "What can be improved in your workplace?": { "answer": "More cross-team collaboration", "type": "textbox", "order": 5 },
            "How would you rate the level of communication between team members?": { "answer": "2. Good", "type": "combobox", "order": 9 },
            "How would you rate the level of support from your manager?": { "answer": "1. Excellent", "type": "combobox", "order": 10 }
        },
        "date": "2024-12-17T15:42:56.486Z", // Yesterday's date
        "__v": 0
    },
    //form 2
    {
        "_id": "6762cda0ffc32b1d46b0e20a",
        "formId": "6762c6d7a1b1d4a374052e6c",
        "email": "student1@example.com",
        "responses": {
            "What is the value of x in 2x + 5 = 11?": { "answer": "2. 3", "type": "combobox", "order": 4 },
            "Solve for y in the equation y - 3 = 7": { "answer": "y = 10", "type": "textbox", "order": 5 },
            "What is the formula for the area of a circle?": { "answer": "1. A = πr^2", "type": "combobox", "order": 6 },
            "Rate your understanding of geometric shapes": { "answer": "4.0", "type": "star", "order": 8 },
            "How confident are you in solving geometry problems?": { "answer": "7 confidence level", "type": "scale-bar", "order": 9 },
            "What is the perimeter of a rectangle with length 6cm and width 4cm?": { "answer": "20 cm", "type": "textbox", "order": 10 },
            "What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?": { "answer": "2. Angle Sum Theorem", "type": "combobox", "order": 11 },
            "Rate your understanding of algebraic expressions": { "answer": "3.0", "type": "star", "order": 13 },
            "How confident are you in solving algebraic equations?": { "answer": "6 confidence level", "type": "scale-bar", "order": 14 },
            "Solve for x in the equation 2x^2 + 5x - 3 = 0": { "answer": "x = -3, x = 0.5", "type": "textbox", "order": 15 }
        },
        "date": "2024-12-18T14:00:56.486Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e20b",
        "formId": "6762c6d7a1b1d4a374052e6c",
        "email": "student1@example.com",
        "responses": {
            "What is the value of x in 2x + 5 = 11?": { "answer": "3. 4", "type": "combobox", "order": 4 },
            "Solve for y in the equation y - 3 = 7": { "answer": "y = 10", "type": "textbox", "order": 5 },
            "What is the formula for the area of a circle?": { "answer": "1. A = πr^2", "type": "combobox", "order": 6 },
            "Rate your understanding of geometric shapes": { "answer": "2.0", "type": "star", "order": 8 },
            "How confident are you in solving geometry problems?": { "answer": "5 confidence level", "type": "scale-bar", "order": 9 },
            "What is the perimeter of a rectangle with length 6cm and width 4cm?": { "answer": "20 cm", "type": "textbox", "order": 10 },
            "What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?": { "answer": "1. Pythagorean Theorem", "type": "combobox", "order": 11 },
            "Rate your understanding of algebraic expressions": { "answer": "5.0", "type": "star", "order": 13 },
            "How confident are you in solving algebraic equations?": { "answer": "8 confidence level", "type": "scale-bar", "order": 14 },
            "Solve for x in the equation 2x^2 + 5x - 3 = 0": { "answer": "x = -1, x = 3", "type": "textbox", "order": 15 }
        },
        "date": "2024-12-17T11:32:23.786Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e20c",
        "formId": "6762c6d7a1b1d4a374052e6c",
        "email": "student2@example.com",
        "responses": {
            "What is the value of x in 2x + 5 = 11?": { "answer": "1. 2", "type": "combobox", "order": 4 },
            "Solve for y in the equation y - 3 = 7": { "answer": "y = 10", "type": "textbox", "order": 5 },
            "What is the formula for the area of a circle?": { "answer": "2. A = 2πr", "type": "combobox", "order": 6 },
            "Rate your understanding of geometric shapes": { "answer": "1.0", "type": "star", "order": 8 },
            "How confident are you in solving geometry problems?": { "answer": "3 confidence level", "type": "scale-bar", "order": 9 },
            "What is the perimeter of a rectangle with length 6cm and width 4cm?": { "answer": "20 cm", "type": "textbox", "order": 10 },
            "What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?": { "answer": "3. Triangle Inequality Theorem", "type": "combobox", "order": 11 },
            "Rate your understanding of algebraic expressions": { "answer": "4.0", "type": "star", "order": 13 },
            "How confident are you in solving algebraic equations?": { "answer": "7 confidence level", "type": "scale-bar", "order": 14 },
            "Solve for x in the equation 2x^2 + 5x - 3 = 0": { "answer": "x = 0.5, x = -3", "type": "textbox", "order": 15 }
        },
        "date": "2024-12-17T15:12:12.123Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e20d",
        "formId": "6762c6d7a1b1d4a374052e6c",
        "email": "student3@example.com",
        "responses": {
            "What is the value of x in 2x + 5 = 11?": { "answer": "2. 3", "type": "combobox", "order": 4 },
            "Solve for y in the equation y - 3 = 7": { "answer": "y = 10", "type": "textbox", "order": 5 },
            "What is the formula for the area of a circle?": { "answer": "1. A = πr^2", "type": "combobox", "order": 6 },
            "Rate your understanding of geometric shapes": { "answer": "3.0", "type": "star", "order": 8 },
            "How confident are you in solving geometry problems?": { "answer": "6 confidence level", "type": "scale-bar", "order": 9 },
            "What is the perimeter of a rectangle with length 6cm and width 4cm?": { "answer": "20 cm", "type": "textbox", "order": 10 },
            "What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?": { "answer": "2. Angle Sum Theorem", "type": "combobox", "order": 11 },
            "Rate your understanding of algebraic expressions": { "answer": "5.0", "type": "star", "order": 13 },
            "How confident are you in solving algebraic equations?": { "answer": "8 confidence level", "type": "scale-bar", "order": 14 },
            "Solve for x in the equation 2x^2 + 5x - 3 = 0": { "answer": "x = 1, x = -3", "type": "textbox", "order": 15 }
        },
        "date": "2024-12-16T14:21:45.987Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e20e",
        "formId": "6762c6d7a1b1d4a374052e6c",
        "email": "student4@example.com",
        "responses": {
            "What is the value of x in 2x + 5 = 11?": { "answer": "2. 3", "type": "combobox", "order": 4 },
            "Solve for y in the equation y - 3 = 7": { "answer": "y = 10", "type": "textbox", "order": 5 },
            "What is the formula for the area of a circle?": { "answer": "3. A = πd", "type": "combobox", "order": 6 },
            "Rate your understanding of geometric shapes": { "answer": "2.0", "type": "star", "order": 8 },
            "How confident are you in solving geometry problems?": { "answer": "4 confidence level", "type": "scale-bar", "order": 9 },
            "What is the perimeter of a rectangle with length 6cm and width 4cm?": { "answer": "20 cm", "type": "textbox", "order": 10 },
            "What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?": { "answer": "2. Angle Sum Theorem", "type": "combobox", "order": 11 },
            "Rate your understanding of algebraic expressions": { "answer": "4.0", "type": "star", "order": 13 },
            "How confident are you in solving algebraic equations?": { "answer": "4 confidence level", "type": "scale-bar", "order": 14 },
            "Solve for x in the equation 2x^2 + 5x - 3 = 0": { "answer": "x = -1, x = 1.5", "type": "textbox", "order": 15 }
        },
        "date": "2024-12-15T10:05:12.657Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e20f",
        "formId": "6762c6d7a1b1d4a374052e6c",
        "email": "student5@example.com",
        "responses": {
            "What is the value of x in 2x + 5 = 11?": { "answer": "2. 3", "type": "combobox", "order": 4 },
            "Solve for y in the equation y - 3 = 7": { "answer": "y = 10", "type": "textbox", "order": 5 },
            "What is the formula for the area of a circle?": { "answer": "1. A = πr^2", "type": "combobox", "order": 6 },
            "Rate your understanding of geometric shapes": { "answer": "3.0", "type": "star", "order": 8 },
            "How confident are you in solving geometry problems?": { "answer": "7 confidence level", "type": "scale-bar", "order": 9 },
            "What is the perimeter of a rectangle with length 6cm and width 4cm?": { "answer": "20 cm", "type": "textbox", "order": 10 },
            "What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?": { "answer": "2. Angle Sum Theorem", "type": "combobox", "order": 11 },
            "Rate your understanding of algebraic expressions": { "answer": "4.0", "type": "star", "order": 13 },
            "How confident are you in solving algebraic equations?": { "answer": "6 confidence level", "type": "scale-bar", "order": 14 },
            "Solve for x in the equation 2x^2 + 5x - 3 = 0": { "answer": "x = 2, x = -1", "type": "textbox", "order": 15 }
        },
        "date": "2024-12-14T09:45:32.127Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e210",
        "formId": "6762c6d7a1b1d4a374052e6c",
        "email": "student6@example.com",
        "responses": {
            "What is the value of x in 2x + 5 = 11?": { "answer": "1. 2", "type": "combobox", "order": 4 },
            "Solve for y in the equation y - 3 = 7": { "answer": "y = 10", "type": "textbox", "order": 5 },
            "What is the formula for the area of a circle?": { "answer": "3. A = πd", "type": "combobox", "order": 6 },
            "Rate your understanding of geometric shapes": { "answer": "2.0", "type": "star", "order": 8 },
            "How confident are you in solving geometry problems?": { "answer": "5 confidence level", "type": "scale-bar", "order": 9 },
            "What is the perimeter of a rectangle with length 6cm and width 4cm?": { "answer": "20 cm", "type": "textbox", "order": 10 },
            "What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?": { "answer": "3. Triangle Inequality Theorem", "type": "combobox", "order": 11 },
            "Rate your understanding of algebraic expressions": { "answer": "3.0", "type": "star", "order": 13 },
            "How confident are you in solving algebraic equations?": { "answer": "7 confidence level", "type": "scale-bar", "order": 14 },
            "Solve for x in the equation 2x^2 + 5x - 3 = 0": { "answer": "x = 0, x = -1", "type": "textbox", "order": 15 }
        },
        "date": "2024-12-14T11:23:45.987Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e211",
        "formId": "6762c6d7a1b1d4a374052e6c",
        "email": "student7@example.com",
        "responses": {
            "What is the value of x in 2x + 5 = 11?": { "answer": "3. 4", "type": "combobox", "order": 4 },
            "Solve for y in the equation y - 3 = 7": { "answer": "y = 10", "type": "textbox", "order": 5 },
            "What is the formula for the area of a circle?": { "answer": "1. A = πr^2", "type": "combobox", "order": 6 },
            "Rate your understanding of geometric shapes": { "answer": "4.0", "type": "star", "order": 8 },
            "How confident are you in solving geometry problems?": { "answer": "8 confidence level", "type": "scale-bar", "order": 9 },
            "What is the perimeter of a rectangle with length 6cm and width 4cm?": { "answer": "20 cm", "type": "textbox", "order": 10 },
            "What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?": { "answer": "2. Angle Sum Theorem", "type": "combobox", "order": 11 },
            "Rate your understanding of algebraic expressions": { "answer": "5.0", "type": "star", "order": 13 },
            "How confident are you in solving algebraic equations?": { "answer": "6 confidence level", "type": "scale-bar", "order": 14 },
            "Solve for x in the equation 2x^2 + 5x - 3 = 0": { "answer": "x = 1.5, x = -2.5", "type": "textbox", "order": 15 }
        },
        "date": "2024-12-14T13:05:32.127Z",
        "__v": 0
    },
    {
        "_id": "6762cda0ffc32b1d46b0e212",
        "formId": "6762c6d7a1b1d4a374052e6c",
        "email": "student8@example.com",
        "responses": {
            "What is the value of x in 2x + 5 = 11?": { "answer": "2. 3", "type": "combobox", "order": 4 },
            "Solve for y in the equation y - 3 = 7": { "answer": "y = 10", "type": "textbox", "order": 5 },
            "What is the formula for the area of a circle?": { "answer": "1. A = πr^2", "type": "combobox", "order": 6 },
            "Rate your understanding of geometric shapes": { "answer": "2.0", "type": "star", "order": 8 },
            "How confident are you in solving geometry problems?": { "answer": "4 confidence level", "type": "scale-bar", "order": 9 },
            "What is the perimeter of a rectangle with length 6cm and width 4cm?": { "answer": "20 cm", "type": "textbox", "order": 10 },
            "What is the name of the theorem that states that the sum of the interior angles of a triangle is 180 degrees?": { "answer": "3. Triangle Inequality Theorem", "type": "combobox", "order": 11 },
            "Rate your understanding of algebraic expressions": { "answer": "3.0", "type": "star", "order": 13 },
            "How confident are you in solving algebraic equations?": { "answer": "5 confidence level", "type": "scale-bar", "order": 14 },
            "Solve for x in the equation 2x^2 + 5x - 3 = 0": { "answer": "x = -1, x = 2", "type": "textbox", "order": 15 }
        },
        "date": "2024-12-14T15:18:45.987Z",
        "__v": 0
    },

    {
        "_id": "6762e71452fe5b9343295dd0",
        "formId": "6762c6ffa1b1d4a374052ebc",
        "email": "user1@example.com",
        "responses": {
            "How likely are you to recommend this geographic test to others?": { "answer": "9 rating", "type": "scale-bar", "order": 15 },
            "What is the largest city in your country?": { "answer": "New York", "type": "textbox", "order": 6 },
            "How would you rate your knowledge of geography?": { "answer": "4.0", "type": "star", "order": 9 },
            "How would you rate your overall satisfaction with the geographic test?": { "answer": "5.0", "type": "star", "order": 14 },
            "What is the longest river in your country?": { "answer": "Mississippi", "type": "textbox", "order": 7 },
            "Which continent do you live in?": { "answer": "4. North America", "type": "combobox", "order": 4 },
            "How many countries have you visited?": { "answer": "15 countries", "type": "scale-bar", "order": 10 },
            "What is the capital of your country?": { "answer": "Washington D.C.", "type": "textbox", "order": 5 },
            "What is your favorite type of geographic location?": { "answer": "3. City", "type": "combobox", "order": 13 },
            "What is your favorite type of geographic feature?": { "answer": "lakes", "type": "textbox", "order": 12 }
        },
        "date": "2024-12-18T14:45:12.499Z",
        "__v": 0
    },
    {
        "_id": "6762e71452fe5b9343295dd1",
        "formId": "6762c6ffa1b1d4a374052ebc",
        "email": "user2@example.com",
        "responses": {
            "How likely are you to recommend this geographic test to others?": { "answer": "6 rating", "type": "scale-bar", "order": 15 },
            "What is the largest city in your country?": { "answer": "Mumbai", "type": "textbox", "order": 6 },
            "How would you rate your knowledge of geography?": { "answer": "3.5", "type": "star", "order": 9 },
            "How would you rate your overall satisfaction with the geographic test?": { "answer": "3.0", "type": "star", "order": 14 },
            "What is the longest river in your country?": { "answer": "Ganges", "type": "textbox", "order": 7 },
            "Which continent do you live in?": { "answer": "2. Asia", "type": "combobox", "order": 4 },
            "How many countries have you visited?": { "answer": "3 countries", "type": "scale-bar", "order": 10 },
            "What is the capital of your country?": { "answer": "New Delhi", "type": "textbox", "order": 5 },
            "What is your favorite type of geographic location?": { "answer": "1. Mountain", "type": "combobox", "order": 13 },
            "What is your favorite type of geographic feature?": { "answer": "rivers", "type": "textbox", "order": 12 }
        },
        "date": "2024-12-18T14:55:12.499Z",
        "__v": 0
    },
    {
        "_id": "6762e71452fe5b9343295dd2",
        "formId": "6762c6ffa1b1d4a374052ebc",
        "email": "user3@example.com",
        "responses": {
            "How likely are you to recommend this geographic test to others?": { "answer": "7 rating", "type": "scale-bar", "order": 15 },
            "What is the largest city in your country?": { "answer": "Beijing", "type": "textbox", "order": 6 },
            "How would you rate your knowledge of geography?": { "answer": "2.5", "type": "star", "order": 9 },
            "How would you rate your overall satisfaction with the geographic test?": { "answer": "4.0", "type": "star", "order": 14 },
            "What is the longest river in your country?": { "answer": "Yangtze", "type": "textbox", "order": 7 },
            "Which continent do you live in?": { "answer": "2. Asia", "type": "combobox", "order": 4 },
            "How many countries have you visited?": { "answer": "10 countries", "type": "scale-bar", "order": 10 },
            "What is the capital of your country?": { "answer": "Beijing", "type": "textbox", "order": 5 },
            "What is your favorite type of geographic location?": { "answer": "2. Beach", "type": "combobox", "order": 13 },
            "What is your favorite type of geographic feature?": { "answer": "lakes", "type": "textbox", "order": 12 }
        },
        "date": "2024-12-18T15:05:12.499Z",
        "__v": 0
    },
    {
        "_id": "6762e71452fe5b9343295dd3",
        "formId": "6762c6ffa1b1d4a374052ebc",
        "email": "user4@example.com",
        "responses": {
            "How likely are you to recommend this geographic test to others?": { "answer": "9 rating", "type": "scale-bar", "order": 15 },
            "What is the largest city in your country?": { "answer": "Tokyo", "type": "textbox", "order": 6 },
            "How would you rate your knowledge of geography?": { "answer": "4.5", "type": "star", "order": 9 },
            "How would you rate your overall satisfaction with the geographic test?": { "answer": "5.0", "type": "star", "order": 14 },
            "What is the longest river in your country?": { "answer": "Shinano", "type": "textbox", "order": 7 },
            "Which continent do you live in?": { "answer": "2. Asia", "type": "combobox", "order": 4 },
            "How many countries have you visited?": { "answer": "20 countries", "type": "scale-bar", "order": 10 },
            "What is the capital of your country?": { "answer": "Tokyo", "type": "textbox", "order": 5 },
            "What is your favorite type of geographic location?": { "answer": "1. Mountain", "type": "combobox", "order": 13 },
            "What is your favorite type of geographic feature?": { "answer": "mountains", "type": "textbox", "order": 12 }
        },
        "date": "2024-12-18T15:15:12.499Z",
        "__v": 0
    },
    {
        "_id": "6762e71452fe5b9343295dd4",
        "formId": "6762c6ffa1b1d4a374052ebc",
        "email": "user5@example.com",
        "responses": {
            "How likely are you to recommend this geographic test to others?": { "answer": "6 rating", "type": "scale-bar", "order": 15 },
            "What is the largest city in your country?": { "answer": "São Paulo", "type": "textbox", "order": 6 },
            "How would you rate your knowledge of geography?": { "answer": "3.0", "type": "star", "order": 9 },
            "How would you rate your overall satisfaction with the geographic test?": { "answer": "4.0", "type": "star", "order": 14 },
            "What is the longest river in your country?": { "answer": "Amazon", "type": "textbox", "order": 7 },
            "Which continent do you live in?": { "answer": "5. South America", "type": "combobox", "order": 4 },
            "How many countries have you visited?": { "answer": "2 countries", "type": "scale-bar", "order": 10 },
            "What is the capital of your country?": { "answer": "Brasília", "type": "textbox", "order": 5 },
            "What is your favorite type of geographic location?": { "answer": "2. Beach", "type": "combobox", "order": 13 },
            "What is your favorite type of geographic feature?": { "answer": "rainforests", "type": "textbox", "order": 12 }
        },
        "date": "2024-12-18T15:25:12.499Z",
        "__v": 0
    },
    {
        "_id": "6762e71452fe5b9343295dd5",
        "formId": "6762c6ffa1b1d4a374052ebc",
        "email": "user6@example.com",
        "responses": {
            "How likely are you to recommend this geographic test to others?": { "answer": "8 rating", "type": "scale-bar", "order": 15 },
            "What is the largest city in your country?": { "answer": "London", "type": "textbox", "order": 6 },
            "How would you rate your knowledge of geography?": { "answer": "4.5", "type": "star", "order": 9 },
            "How would you rate your overall satisfaction with the geographic test?": { "answer": "4.5", "type": "star", "order": 14 },
            "What is the longest river in your country?": { "answer": "Thames", "type": "textbox", "order": 7 },
            "Which continent do you live in?": { "answer": "3. Europe", "type": "combobox", "order": 4 },
            "How many countries have you visited?": { "answer": "12 countries", "type": "scale-bar", "order": 10 },
            "What is the capital of your country?": { "answer": "London", "type": "textbox", "order": 5 },
            "What is your favorite type of geographic location?": { "answer": "3. City", "type": "combobox", "order": 13 },
            "What is your favorite type of geographic feature?": { "answer": "coastlines", "type": "textbox", "order": 12 }
        },
        "date": "2024-12-18T15:35:12.499Z",
        "__v": 0
    },
    {
        "_id": "6762e71452fe5b9343295dd6",
        "formId": "6762c6ffa1b1d4a374052ebc",
        "email": "user7@example.com",
        "responses": {
            "How likely are you to recommend this geographic test to others?": { "answer": "10 rating", "type": "scale-bar", "order": 15 },
            "What is the largest city in your country?": { "answer": "Sydney", "type": "textbox", "order": 6 },
            "How would you rate your knowledge of geography?": { "answer": "5.0", "type": "star", "order": 9 },
            "How would you rate your overall satisfaction with the geographic test?": { "answer": "5.0", "type": "star", "order": 14 },
            "What is the longest river in your country?": { "answer": "Murray", "type": "textbox", "order": 7 },
            "Which continent do you live in?": { "answer": "6. Australia", "type": "combobox", "order": 4 },
            "How many countries have you visited?": { "answer": "30 countries", "type": "scale-bar", "order": 10 },
            "What is the capital of your country?": { "answer": "Canberra", "type": "textbox", "order": 5 },
            "What is your favorite type of geographic location?": { "answer": "2. Beach", "type": "combobox", "order": 13 },
            "What is your favorite type of geographic feature?": { "answer": "reefs", "type": "textbox", "order": 12 }
        },
        "date": "2024-12-18T15:45:12.499Z",
        "__v": 0
    }




];

const initializeData = async () => {
    try {
        console.log('Initializing database with sample data...');

        // Check if forms already exist to avoid duplicate initialization
        const existingForms = await Form.find();
        if (existingForms.length > 0) {
            console.log('Initial data already exists. Skipping initialization.');
            return;
        }

        // Create a fake user directly using `create`
        const savedUser = await User.create({
            githubId: 'fakeGithubId123',
            username: 'fakeUser',
            email: 'fakeuser@example.com',
            confirmed: true,
        });

        // Assign the fake user's ID to all forms
        exampleForms.forEach(form => {
            form.userId = savedUser._id; // Use the saved user's ID
        });


        // Insert example forms
        const insertedForms = await Form.insertMany(exampleForms);
        console.log('Sample forms have been added successfully.');

        // Prepare feedback based on inserted forms (initially empty)
        if (exampleFeedbacks.length > 0) {
            const feedbacksToInsert = [];
            for (const feedback of exampleFeedbacks) {
                // Find the form using the formId
                const form = insertedForms.find(f => f._id.toString() === feedback.formId);
                if (form) {
                    // Push the feedback directly into the feedback array
                    feedbacksToInsert.push({
                        formId: form._id,
                        email: feedback.email,
                        responses: feedback.responses,
                        date: feedback.date,
                    });
                } else {
                    console.warn(`Form with ID ${feedback.formId} not found.`);
                }
            }

            // Insert feedback into the database
            await Feedback.insertMany(feedbacksToInsert);
            console.log('Sample feedback has been added successfully.');
        } else {
            console.log('No feedbacks to initialize. You can dynamically add them later.');
        }
    } catch (err) {
        console.error('Error initializing data:', err.message);
    }
};

module.exports = initializeData;
