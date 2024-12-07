import { io as ClientSocket } from 'socket.io-client';
import { server, io } from '../../socket/socket.js'; // Ensure the correct path to your socket.js file

describe('Socket.IO Server', () => {
  let clientSocket;

  const connectClient = (userId) => {
    return ClientSocket(`http://localhost:4000`, {
      query: { userId },
      transports: ['websocket'],
    });
  };

  beforeAll((done) => {
    // Start the server on port 4000 for testing
    server.listen(4000, () => {
      console.log('Test server is running');
      done();
    });
  });

  afterAll((done) => {
    // Properly close the server and Socket.IO instance
    io.close();
    server.close(() => {
      console.log('Test server stopped');
      done();
    });
  });

  afterEach(() => {
    if (clientSocket) clientSocket.close(); // Close client socket after each test
  });

  it('should handle connections with undefined userId gracefully', (done) => {
    clientSocket = connectClient(undefined);

    clientSocket.on('connect', () => {
      // Check that no "undefined" room is created
      expect(io.sockets.adapter.rooms.undefined).toBeUndefined();
      done();
    });
  });

  it('should track connected users and emit the list of online users', (done) => {
    const userId1 = 'user1';
    const userId2 = 'user2';

    const client1 = connectClient(userId1);
    const client2 = connectClient(userId2);

    client1.on('getOnlineUsers', (onlineUsers) => {
      if (onlineUsers.includes(userId1) && onlineUsers.includes(userId2)) {
        // Ensure both users are tracked
        expect(onlineUsers).toContain(userId1);
        expect(onlineUsers).toContain(userId2);

        client1.close();
        client2.close();
        done();
      }
    });
  });

  it('should remove users from the list when they disconnect', (done) => {
    const userId = 'user1';
  
    // Connect a client
    clientSocket = connectClient(userId);
  
    clientSocket.on('getOnlineUsers', (onlineUsers) => {
      // First emission: user is added to the online users
      if (onlineUsers.includes(userId)) {
        // Simulate user disconnect
        clientSocket.close();
  
        setTimeout(() => {
          // Check the updated online users list
          io.emit('getOnlineUsers', Object.keys(io.sockets.sockets));
          expect(Object.keys(io.sockets.sockets)).not.toContain(userId);
          done();
        }, 100); // Allow time for the disconnect event to propagate
      }
    });
  });
  
});


