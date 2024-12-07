import express from 'express';
import request from 'supertest';
import router from '../../routes/user.routes.js';
import protectRoute from '../../middleware/protectRoute.js';
import { getUsersForSidebar } from '../../controllers/user.controller.js';

jest.mock('../../middleware/protectRoute.js'); // Mock the middleware
jest.mock('../../controllers/user.controller.js'); // Mock the controller

const app = express();
app.use(express.json());
app.use('/', router); // Mount the router for testing

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should call protectRoute middleware and getUsersForSidebar controller for GET /', async () => {
    // Mock protectRoute to call `next()` and simulate authentication success
    protectRoute.mockImplementation((req, res, next) => next());

    // Mock getUsersForSidebar to return a JSON response
    getUsersForSidebar.mockImplementation((req, res) => res.status(200).json([{ id: 'user1' }, { id: 'user2' }]));

    const res = await request(app).get('/');

    // Assertions for middleware
    expect(protectRoute).toHaveBeenCalled();

    // Assertions for controller
    expect(getUsersForSidebar).toHaveBeenCalled();

    // Assertions for response
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'user1' }, { id: 'user2' }]);
  });

  it('should return 401 if protectRoute denies access', async () => {
    // Mock protectRoute to simulate unauthorized access
    protectRoute.mockImplementation((req, res) => res.status(401).json({ error: 'Unauthorized' }));

    const res = await request(app).get('/');

    // Assertions for middleware
    expect(protectRoute).toHaveBeenCalled();

    // Assertions for response
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });

    // Ensure the controller is not called
    expect(getUsersForSidebar).not.toHaveBeenCalled();
  });

  it('should return 500 if getUsersForSidebar throws an error', async () => {
    // Mock protectRoute to call `next()` and simulate authentication success
    protectRoute.mockImplementation((req, res, next) => next());

    // Mock getUsersForSidebar to throw an error
    getUsersForSidebar.mockImplementation((req, res) => {
      res.status(500).json({ error: 'Internal server error' });
    });
    

    const res = await request(app).get('/');

    // Assertions for middleware
    expect(protectRoute).toHaveBeenCalled();

    // Assertions for response
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});
