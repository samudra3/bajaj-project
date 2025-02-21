const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000; // You can change this

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(bodyParser.json()); // Parse JSON requests

// Store submitted JSON data (in-memory, for simplicity)
let submittedJson = null;

// Endpoint to handle JSON submission
app.post('/api/submit-json', (req, res) => {
  const jsonData = req.body;

  // Basic validation (ensure it’s an object)
  if (!jsonData || typeof jsonData !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON data' });
  }

  // Store the submitted JSON
  submittedJson = jsonData;
  console.log('Received JSON:', submittedJson);

  // Respond with success and options for the dropdown
  res.status(200).json({
    message: 'JSON submitted successfully',
    dropdownOptions: ['alphabets', 'numbers', 'highest_alphabet']
  });
});

// Endpoint to handle dropdown selections
app.post('/api/submit-dropdown', (req, res) => {
  const { selectedOptions } = req.body;

  if (!Array.isArray(selectedOptions)) {
    return res.status(400).json({ error: 'Selected options must be an array' });
  }

  console.log('Received dropdown selections:', selectedOptions);

  // Process selections (example logic)
  let responseData = {
    originalJson: submittedJson,
    selectedOptions: selectedOptions,
    processedResult: {}
  };

  // Example processing based on selections
  if (submittedJson) {
    if (selectedOptions.includes('alphabets')) {
      responseData.processedResult.alphabets = extractAlphabets(submittedJson);
    }
    if (selectedOptions.includes('numbers')) {
      responseData.processedResult.numbers = extractNumbers(submittedJson);
    }
    if (selectedOptions.includes('highest_alphabet')) {
      responseData.processedResult.highestAlphabet = findHighestAlphabet(submittedJson);
    }
  }

  res.status(200).json(responseData);
});

// Helper functions for processing
function extractAlphabets(json) {
  return JSON.stringify(json).match(/[a-zA-Z]+/g) || [];
}

function extractNumbers(json) {
  return JSON.stringify(json).match(/\d+/g) || [];
}

function findHighestAlphabet(json) {
  const alphabets = extractAlphabets(json);
  return alphabets.length > 0 ? alphabets.sort().slice(-1)[0] : null;
}

// Start the server
module.exports = app;