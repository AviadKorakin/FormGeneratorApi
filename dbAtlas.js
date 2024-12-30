const mongoose = require('mongoose');
const initializeData = require('./initializeData'); // For running initialization logic
require('dotenv').config();

const mongoAtlasURI = process.env.MONGO_ATLAS_URI;

// Connect to MongoDB Atlas and initialize the database
const connectDBAtlas = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoAtlasURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Atlas connected successfully');

        console.log('Clearing the database...');
        await clearDatabase();
        console.log('Database cleared');

        console.log('Initializing the database...');
        await initializeData();
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error setting up MongoDB Atlas:', err.message);
        process.exit(1); // Exit on failure
    }
};

// Clear the database by dropping all collections
const clearDatabase = async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (let collection of collections) {
        console.log(`Dropping collection: ${collection.name}`);
        await db.collection(collection.name).drop();
    }
};

// Close MongoDB Atlas connection
const closeDBAtlasConnection = async () => {
    try {
        console.log('Closing MongoDB Atlas connection...');
        await mongoose.connection.close();
        console.log('MongoDB Atlas connection closed');
    } catch (err) {
        console.error('Error closing MongoDB Atlas connection:', err.message);
    }
};

module.exports = {
    connectDBAtlas,
    closeDBAtlasConnection,
};