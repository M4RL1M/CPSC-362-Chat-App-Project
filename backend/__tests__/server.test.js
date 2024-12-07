import { startServer } from '../server.js';
import { server } from '../socket/socket.js';
import connectToMongoDB from '../db/connectToMongoDB.js';

jest.mock('../db/connectToMongoDB.js'); // Mock MongoDB connection
jest.mock('../socket/socket.js', () => ({
  app: {
    use: jest.fn(),
  },
  server: {
    listen: jest.fn((port, callback) => {
      if (callback) callback();
    }), // Mock server.listen to call the callback
  },
}));


describe('Server.js Tests', () => {
  it('should call server.listen and connectToMongoDB', () => {
    startServer();

    // Verify server.listen is called
    expect(server.listen).toHaveBeenCalledWith(
      process.env.PORT || 8000,
      expect.any(Function)
    );

    // Verify connectToMongoDB is called
    expect(connectToMongoDB).toHaveBeenCalled();

    // Mock console.log to verify log output
    console.log = jest.fn();
    startServer();
    expect(console.log).toHaveBeenCalledWith(
      `Server is running on port ${process.env.PORT || 8000}`
    );
  });
});
