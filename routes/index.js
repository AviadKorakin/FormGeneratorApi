var express = require('express');
const axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/form-builder', function (req, res, next) {
  res.render('form-builder', {
    title: 'Build Form',
  });
});

router.get('/update-form', function (req, res, next) {
  res.render('update-form', {
    title: 'Update Form',
  });
});
router.get('/remove-form', function (req, res, next) {
  res.render('remove-form', {
    title: 'Remove Form',
  });
});
router.get('/feedbacks-viewer', function (req, res, next) {
  res.render('feedbacks-viewer', {
    title: 'Feedback Viewer',
  });
});
router.get('/analytics-viewer', function (req, res, next) {
  res.render('analytics-viewer', {
    title: 'Analytics Viewer',
  });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Render Register Page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Render Confirmation Success Page
router.get('/confirmation-success', (req, res) => {
  res.render('confirmation-success', { title: 'Confirmation Success' });
});

// Render Confirmation Pending Page
router.get('/confirmation-pending', (req, res) => {
  res.render('confirmation-pending', { title: 'Confirmation Pending' });
});



router.get('/success/:id', async (req, res) => {
  const formId = req.params.id;

  try {
    // Access the dynamic port
    const port = global.PORT;

    // Log the port to the console for debugging
    console.log(`Dynamic port retrieved: ${port}`);

    // Validate the formId using the /forms/:id route
    const response = await axios.get(`http://localhost:${port}/forms/${formId}`);

    // If the form exists, render the success page
    res.render('success', { formId: response.data._id, error: null });
  } catch (error) {
    // If the ID is invalid or the form doesn't exist, handle the error
    if (error.response && error.response.status === 404) {
      return res.render('success', { formId: null, error: 'Form not found (404)' });
    }
    console.error('Error fetching form:', error);
    return res.status(500).send('Failed to validate Form ID');
  }
});



module.exports = router;
