import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Message from "../../models/message.model";

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

describe('Message Model Test Suite', () => {
  it('should create and save a message successfully', async () => {
    const validMessage = new Message({
      senderId: new mongoose.Types.ObjectId(),
      receiverId: new mongoose.Types.ObjectId(),
      message: 'Hello, this is a test message!',
    });

    const savedMessage = await validMessage.save();

    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.senderId).toBeDefined();
    expect(savedMessage.receiverId).toBeDefined();
    expect(savedMessage.message).toBe('Hello, this is a test message!');
    expect(savedMessage.createdAt).toBeDefined();
    expect(savedMessage.updatedAt).toBeDefined();
  });

  it('should fail if required fields are missing', async () => {
    const messageWithoutRequiredFields = new Message({});

    let error;
    try {
      await messageWithoutRequiredFields.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.senderId).toBeDefined();
    expect(error.errors.receiverId).toBeDefined();
    expect(error.errors.message).toBeDefined();
  });

  it('should reference valid ObjectIds for senderId and receiverId', async () => {
    const invalidMessage = new Message({
      senderId: 'invalid_object_id',
      receiverId: 'invalid_object_id',
      message: 'This message has invalid references!',
    });

    let error;
    try {
      await invalidMessage.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
    expect(error.errors.senderId).toBeDefined();
    expect(error.errors.receiverId).toBeDefined();
  });
});
