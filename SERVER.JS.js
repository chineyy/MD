const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Mock prediction function - replace with your actual ML model
function predictTrash(imagePath) {
    // This is a mock implementation
    // In a real app, you would use TensorFlow.js, Python with Flask, etc.
    const classes = ['Recyclable', 'Organic', 'Hazardous', 'Non-recyclable'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const randomConfidence = Math.random() * 0.8 + 0.2; // Between 0.2 and 1.0
    
    return {
        class: randomClass,
        confidence: randomConfidence,
        image_path: `/annotated_${path.basename(imagePath)}`
    };
}

// Prediction endpoint
app.post('/predict', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
        // In a real app, you would process the image here with your ML model
        const result = predictTrash(req.file.path);
        
        // For demo purposes, we'll just return a mock result
        res.json(result);
    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ error: 'Prediction failed' });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});