import express from 'express';
import request from 'supertest';
import router from '../../routes/message.routes.js';
import protectRoute from '../../middleware/protectRoute.js';
import { getMessages, sendMessage } from '../../controllers/message.controller.js';

jest.mock('../../middleware/protectRoute.js'); // Mock the middleware
jest.mock('../../controllers/message.controller.js'); // Mock the controllers

const app = express();
app.use(express.json());
app.use('/api/messages', router); // Mount the router for testing

describe('Message Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('GET /:id', () => {
    it('should call protectRoute middleware and getMessages controller', async () => {
      // Mock protectRoute to call `next()` and simulate authentication success
      protectRoute.mockImplementation((req, res, next) => next());

      // Mock getMessages to return a success response
      getMessages.mockImplementation((req, res) =>
        res.status(200).json([{ id: 'msg1', message: 'Hello!' }])
      );

      const res = await request(app).get('/api/messages/123');

      // Verify middleware is called
      expect(protectRoute).toHaveBeenCalled();

      // Verify controller is called
      expect(getMessages).toHaveBeenCalled();

      // Verify response
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 'msg1', message: 'Hello!' }]);
    });

    it('should return 401 if protectRoute denies access', async () => {
      // Mock protectRoute to simulate unauthorized access
      protectRoute.mockImplementation((req, res) => res.status(401).json({ error: 'Unauthorized' }));

      const res = await request(app).get('/api/messages/123');

      // Verify middleware is called
      expect(protectRoute).toHaveBeenCalled();

      // Verify response
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });

      // Ensure the controller is not called
      expect(getMessages).not.toHaveBeenCalled();
    });
  });

  describe('POST /send/:id', () => {
    it('should call protectRoute middleware and sendMessage controller', async () => {
      // Mock protectRoute to call `next()` and simulate authentication success
      protectRoute.mockImplementation((req, res, next) => next());

      // Mock sendMessage to return a success response
      sendMessage.mockImplementation((req, res) =>
        res.status(201).json({ id: 'msg1', message: 'Hello!' })
      );

      const res = await request(app)
        .post('/api/messages/send/123')
        .send({ message: 'Hello!' });

      // Verify middleware is called
      expect(protectRoute).toHaveBeenCalled();

      // Verify controller is called
      expect(sendMessage).toHaveBeenCalled();

      // Verify response
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 'msg1', message: 'Hello!' });
    });

    it('should return 401 if protectRoute denies access', async () => {
      // Mock protectRoute to simulate unauthorized access
      protectRoute.mockImplementation((req, res) => res.status(401).json({ error: 'Unauthorized' }));

      const res = await request(app)
        .post('/api/messages/send/123')
        .send({ message: 'Hello!' });

      // Verify middleware is called
      expect(protectRoute).toHaveBeenCalled();

      // Verify response
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Unauthorized' });

      // Ensure the controller is not called
      expect(sendMessage).not.toHaveBeenCalled();
    });
  });
});
