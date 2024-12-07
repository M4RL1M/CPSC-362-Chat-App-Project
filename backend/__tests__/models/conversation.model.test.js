import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Conversation from '../../models/conversation.model'; // Adjust path based on your project structure

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect mongoose to the in-memory MongoDB server
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Disconnect mongoose and stop the in-memory MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Conversation Model Test Suite', () => {
  it('should create and save a conversation successfully', async () => {
    const validConversation = new Conversation({
      participants: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ],
      message: [],
    });

    const savedConversation = await validConversation.save();

    expect(savedConversation._id).toBeDefined();
    expect(savedConversation.participants).toHaveLength(2);
    expect(savedConversation.message).toHaveLength(0);
    expect(savedConversation.createdAt).toBeDefined();
    expect(savedConversation.updatedAt).toBeDefined();
  });

  it('should default the message array to an empty array', async () => {
    const conversationWithoutMessages = new Conversation({
      participants: [new mongoose.Types.ObjectId()],
    });

    const savedConversation = await conversationWithoutMessages.save();

    expect(savedConversation.message).toEqual([]); // Check default value
  });

  it('should fail if participants are missing', async () => {
    
  });

  it('should reference valid ObjectIds for participants and messages', async () => {
    const invalidConversation = new Conversation({
      participants: ['invalid_object_id'],
      message: ['invalid_object_id'],
    });

    let error;
    try {
      await invalidConversation.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
    expect(error.errors['participants.0']).toBeDefined();
    expect(error.errors['message.0']).toBeDefined();
  });
});
