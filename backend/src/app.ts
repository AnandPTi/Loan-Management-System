// src/app.ts
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import loanRoutes from './routes/loanRoutes';
import adminRoutes from './routes/adminRoutes';
import verifierRoutes from './routes/verifierRoutes';

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Add error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verifier', verifierRoutes); // Add verifier routes



// Create initial admin user
import { User } from './models/User';
import bcrypt from 'bcrypt';

const createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'anandp@gmail.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('anandP12@', 10);
      const admin = new User({
        email: 'anandp@gmail.com',
        password: hashedPassword,
        name: 'Anand P',
        phone: '1234567890',
        address: 'Admin Address',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createInitialAdmin();

// Add a test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;


// import express from 'express';
// import { connectDB } from './config/database';
// import authRoutes from './routes/authRoutes';
// import loanRoutes from './routes/loanRoutes';
// import adminRoutes from './routes/adminRoutes';

// const app = express();
// app.use(express.json());

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/loans', loanRoutes);
// app.use('/api/admin', adminRoutes);

// // Create initial admin user
// import { User } from './models/User';
// import bcrypt from 'bcrypt';



// const createInitialAdmin = async () => {
//   try {
//     const adminExists = await User.findOne({ email: 'anandp@gmail.com' });
//     if (!adminExists) {
//       const hashedPassword = await bcrypt.hash('anandP12@', 10);
//       const admin = new User({
//         email: 'anandp@gmail.com',
//         password: hashedPassword,
//         name: 'Anand P',
//         phone: '1234567890',
//         address: 'Admin Address',
//         role: 'admin'
//       });
//       await admin.save();
//       console.log('Admin user created successfully');
//     }
//   } catch (error) {
//     console.error('Error creating admin user:', error);
//   }
// };

// createInitialAdmin();

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
