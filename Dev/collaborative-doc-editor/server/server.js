const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000', // Add the origin of your Angular app
        methods: ['GET', 'POST'],
    },
});

// MongoDB connection
mongoose.connect('mongodb+srv://ayush:qMyxXcwm5G69KZ3@cluster0.dcubcr0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// Define MongoDB Schema and Model (document)
const Document = mongoose.model('Document', { content: String });

// Socket.io handling
io.on('connection', (socket) => {

    socket.on('updateDocument', async (content) => {
        try {
            const document = await Document.findOne();
            if (document) {
                document.content = content;
                await document.save();
            } else {
                await Document.create({ content });
            }
            socket.broadcast.emit('documentUpdated', content);
        } catch (error) {
            console.error(error);
        }
    });

    // Send current document content to newly connected user
    Document.findOne().then((document) => {
        if (document) {
            socket.emit('documentUpdated', document.content);
        }
    });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
