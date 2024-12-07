import { sendMessage, getMessages } from '../../controllers/message.controller.js';
import Conversation from '../../models/conversation.model.js';
import Message from '../../models/message.model.js';
import { getReceiverSocketId } from '../../socket/socket.js';
import { io } from '../../socket/socket.js';

jest.mock('../../models/conversation.model.js'); // Mock Conversation model
jest.mock('../../models/message.model.js'); // Mock Message model
jest.mock('../../socket/socket.js', () => ({
  io: { to: jest.fn(() => ({ emit: jest.fn() })) },
  getReceiverSocketId: jest.fn(),
}));

describe('Additional Message Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { _id: 'senderId' },
    }; // Mocked request
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    }; // Mocked response
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('sendMessage', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'receiverId' }, body: { message: 'Hello!' }, user: { _id: 'senderId' } };
    res = { status: jest.fn(() => res), json: jest.fn() };
    jest.clearAllMocks();
  });

  it('should emit a message if receiverSocketId exists', async () => {
    const mockMessage = { _id: 'msg1', message: 'Hello!', senderId: 'senderId', receiverId: 'receiverId' };

    // Mock Conversation and Message behavior
    Conversation.findOne.mockResolvedValue(null);
    Conversation.create.mockResolvedValue({ participants: ['senderId', 'receiverId'], message: [], save: jest.fn() });
    Message.mockImplementation(() => ({ ...mockMessage, save: jest.fn() }));

    // Mock the socket behavior
    getReceiverSocketId.mockReturnValue('receiverSocketId');

    await sendMessage(req, res);

    // Verify `io.to().emit` is called
    expect(io.to).toHaveBeenCalledWith('receiverSocketId');
    expect(io.to().emit).toHaveBeenCalledWith('newMessage', expect.objectContaining(mockMessage));

    // Verify response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockMessage));
  });

  it('should not emit a message if receiverSocketId does not exist', async () => {
    const mockMessage = { _id: 'msg1', message: 'Hello!', senderId: 'senderId', receiverId: 'receiverId' };

    // Mock Conversation and Message behavior
    Conversation.findOne.mockResolvedValue(null);
    Conversation.create.mockResolvedValue({ participants: ['senderId', 'receiverId'], message: [], save: jest.fn() });
    Message.mockImplementation(() => ({ ...mockMessage, save: jest.fn() }));

    // Mock the socket behavior
    getReceiverSocketId.mockReturnValue(null);

    await sendMessage(req, res);

    // Verify `io.to().emit` is not called
    expect(io.to).not.toHaveBeenCalled();

    // Verify response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockMessage));
  });
});

  describe('getMessages', () => {
    it('should handle missing senderId gracefully', async () => {
      req.user._id = null; // No senderId

      await getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal sever error" });
    });

    it('should return an empty array if no messages exist in the conversation', async () => {
      req.params.id = 'receiverId';

      Conversation.findOne.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({ participants: ['senderId', 'receiverId'], message: [] }),
      }));

      await getMessages(req, res);

      expect(Conversation.findOne).toHaveBeenCalledWith({
        participants: { $all: ['senderId', 'receiverId'] },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return 200 if the conversation does not exist', async () => {
      req.params.id = 'receiverId';

      Conversation.findOne.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null),
      }));

      await getMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});
