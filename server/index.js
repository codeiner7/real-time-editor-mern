const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Document = require('./models/Document');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

let cursors = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinDocument', (documentId, username) => {
    socket.join(documentId);
    socket.username = username;
  });

  socket.on('cursorMove', ({ documentId, username, cursorPos }) => {
    cursors[username] = cursorPos;
    io.to(documentId).emit('updateCursors', cursors);
  });

  socket.on('sendChanges', ({ documentId, content }) => {
    socket.to(documentId).emit('receiveChanges', content);
  });

  socket.on('saveDocument', async ({ documentId, content }) => {
    try {
      await Document.findByIdAndUpdate(documentId, { content });
    } catch (error) {
      console.error('Error saving document:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete cursors[socket.username];
    io.emit('updateCursors', cursors);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
