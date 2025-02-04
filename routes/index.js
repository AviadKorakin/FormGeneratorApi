var express = require("express");
const {
  ensureAuthenticated,
  ensureFirstStepAuthenticated,
  ensureSecondStepAuthenticated,
} = require("../middlewares");
var router = express.Router();
const Form = require("../models/Form"); // Import the updated Form model

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/form-builder", ensureAuthenticated, function (req, res, next) {
  res.render("form-builder", {
    title: "Build Form",
  });
});

router.get("/update-form", ensureAuthenticated, function (req, res, next) {
  res.render("update-form", {
    title: "Update Form",
  });
});
router.get("/remove-form", ensureAuthenticated, function (req, res, next) {
  res.render("remove-form", {
    title: "Remove Form",
  });
});
router.get("/feedbacks-viewer", ensureAuthenticated, function (req, res, next) {
  res.render("feedbacks-viewer", {
    title: "Feedback Viewer",
  });
});
router.get("/analytics-viewer", ensureAuthenticated, function (req, res, next) {
  res.render("analytics-viewer", {
    title: "Analytics Viewer",
  });
});

// Render Confirmation Success Page
router.get("/confirmation-success", ensureAuthenticated, (req, res) => {
  res.render("confirmation-success", { title: "Confirmation Success" });
});

// Render Confirmation Pending Page
router.get(
  "/confirmation-pending",
  ensureSecondStepAuthenticated,
  (req, res) => {
    res.render("confirmation-pending", { title: "Confirmation Pending" });
  },
);

router.get("/success/:id", ensureAuthenticated, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.render("success", { formId: null, error: "Form not found" });
    }
    res.render("success", { formId: form._id, error: null });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.render("success", {
        formId: null,
        error: "Form not found (404)",
      });
    }
    console.error("Error fetching form:", error);
    return res.render("success", { formId: null, error: "500" });
  }
});

router.get("/view-api-key", ensureAuthenticated, (req, res) => {
  // Check if user is logged in
  if (!res.locals.user) {
    return res.status(401).render("viewApiKey", {
      apiKey: null,
      error: "User is not logged in.",
    });
  }

  // Check if the user has an API key
  const apiKey = res.locals.user.api_key;
  if (!apiKey) {
    return res.status(404).render("viewApiKey", {
      apiKey: null,
      error: "API Key not found for the current user.",
    });
  }

  // Render the API key view
  return res.render("viewApiKey", {
    apiKey,
    error: null,
  });
});

module.exports = router;
