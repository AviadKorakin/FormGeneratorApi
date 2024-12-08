const mongoose = require('mongoose');
const { exec } = require('child_process'); // For running Docker commands

const mongoURI = 'mongodb://127.0.0.1:27017/formgenerator-api';

const connectDB = async () => {
    try {
        console.log('Starting Docker Compose...');
        await runDockerCompose();

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');

        console.log('Clearing the database...');
        await clearDatabase();
        console.log('Database cleared');
    } catch (err) {
        console.error('Error setting up the database:', err.message);
        process.exit(1); // Exit on failure
    }
};

// Run Docker Compose to start the MongoDB container
const runDockerCompose = () => {
    return new Promise((resolve, reject) => {
        exec('docker-compose up -d', (error, stdout, stderr) => {
            if (error) {
                console.error('Error starting Docker Compose:', stderr);
                return reject(error);
            }
            console.log('Docker Compose started successfully:', stdout);
            resolve();
        });
    });
};

// Stop Docker container to put it in "exit" status
const stopDockerContainer = (containerName = 'mongodb') => {
    return new Promise((resolve, reject) => {
        exec(`docker stop ${containerName}`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error stopping Docker container:', stderr);
                return reject(error);
            }
            console.log(`Docker container stopped successfully: ${stdout}`);
            resolve();
        });
    });
};

// Clear the database by dropping all collections
const clearDatabase = async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (let collection of collections) {
        await db.collection(collection.name).drop();
    }
};

// Clean up database and stop Docker container
const closeDBConnection = async () => {
    try {
        console.log('Closing MongoDB connection...');
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error('Error closing MongoDB connection:', err.message);
    }

    try {
        console.log('Stopping Docker container...');
        await stopDockerContainer(); // Provide the name of your Docker container
    } catch (err) {
        console.error('Error stopping Docker container:', err.message);
    }
};

module.exports = {
    connectDB,
    closeDBConnection
};
