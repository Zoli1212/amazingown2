import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  try {
    if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

    if (cached.conn) {
      return cached.conn
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }

      cached.promise = mongoose.connect(MONGODB_URI, opts)
    }

    try {
      cached.conn = await cached.promise
    } catch (e) {
      cached.promise = null
      throw e
    }

    return cached.conn
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error('Failed to connect to database')
  }
}
