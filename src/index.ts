import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 5050;

const startServer = async (): Promise<void> => {
  try {
    console.log('🚀 Starting TechFynite Backend Server...');
    console.log('📋 Environment:', process.env.NODE_ENV || 'development');
    
    // Connect to database
    console.log('🔌 Connecting to database...');
    await connectDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('🎉 Server started successfully!');
      console.log('='.repeat(50));
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
      console.log('='.repeat(50));
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}
