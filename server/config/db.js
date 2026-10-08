const mongoose = require('mongoose');
const dns = require('dns');

// On Windows and certain network configurations, Node.js fails to resolve MongoDB Atlas SRV records
// by default. Setting public DNS servers (Google 8.8.8.8 & Cloudflare 1.1.1.1) prevents querySrv ECONNREFUSED.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[DNS Warning]: Could not set custom DNS servers:', dnsErr.message);
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ [MongoDB Error]: Neither MONGO_URI nor MONGODB_URI is defined in server/.env');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ [MongoDB Atlas Connected] Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.error('Tip: Make sure your MongoDB Atlas connection string in server/.env is valid and your IP address is whitelisted in Atlas Network Access (0.0.0.0/0).');
  }
};

module.exports = connectDB;
