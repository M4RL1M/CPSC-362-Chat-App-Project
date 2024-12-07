import mongoose from 'mongoose';
import connectToMongoDB from '../../db/connectToMongoDB';

jest.mock('mongoose'); // Mock mongoose module

describe('connectToMongoDB', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('should log success message when connection is successful', async () => {
    mongoose.connect.mockResolvedValueOnce(); // Simulate successful connection

    console.log = jest.fn(); // Mock console.log

    await connectToMongoDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_DB_URI);
    expect(console.log).toHaveBeenCalledWith('Connected to MongoDB');
  });

  it('should log error message when connection fails', async () => {
    const errorMessage = 'Failed to connect';
    mongoose.connect.mockRejectedValueOnce(new Error(errorMessage)); // Simulate connection failure

    console.log = jest.fn(); // Mock console.log

    await connectToMongoDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_DB_URI);
    expect(console.log).toHaveBeenCalledWith('Error in connecting to MongoDB ', expect.any(Error));
  });
});
