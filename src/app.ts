import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/postRoutes';
import getRoutes from './routes/getRoutes';
import cors from 'cors';
import verifyGooglePubSubJWT from "./middlewares/googleAuth";

const app = express();
const PORT = 8080;

// enabling CORS for any unknown origin(https://xyz.example.com)
app.use(cors());

// Middleware
app.use(bodyParser.json({
  type(req) {
    // Ignore content-type header checking
    return true;
  }
}));

const connectionString = process.env.DATABASE_CONNECTION_STRING;

// MongoDB Connection
mongoose.connect(connectionString, { dbName: process.env.DATABASE_NAME })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// POST routes
app.use('/api/build', verifyGooglePubSubJWT, postRoutes);

// GET routes
app.use('/api/builds', getRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
