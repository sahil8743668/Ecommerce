const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error.middleware');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join_user', (userId) => socket.join(userId));
  socket.on('join_admin', () => socket.join('admin'));

  socket.on('user_message', ({ userId, text }) => {
    io.to('admin').emit('new_message', {
      userId,
      text,
      time: new Date()
    });
  });

  socket.on('admin_message', ({ userId, text }) => {
    io.to(userId).emit('admin_reply', {
      text,
      time: new Date()
    });
  });

  socket.on('disconnect', () =>
    console.log('Socket disconnected:', socket.id)
  );
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/coupons', require('./routes/coupon.routes'));
app.use('/api/wallet', require('./routes/wallet.routes'));
app.use('/api/loyalty', require('./routes/loyalty.routes'));
app.use('/api/referral', require('./routes/referral.routes'));
app.use('/api/returns', require('./routes/return.routes'));
app.use('/api/banners', require('./routes/banner.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use("/api/search", require("./routes/search.routes"));
// Admin routes
app.use('/api/admin', require('./routes/admin.routes'));
app.use("/api/recommend", require("./routes/recommendation.routes"));
app.get('/', (_, res) =>
  res.json({ message: '🛒 A to Z Cart v2 API Running!' })
);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`✅ Server + Socket.io running on port ${PORT}`)
);