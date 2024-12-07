import express from 'express';
import request from 'supertest';
import router from '../../routes/auth.routes.js';
import { signup, login, logout } from '../../controllers/auth.controller.js';

jest.mock('../../controllers/auth.controller.js'); // Mock the controllers

const app = express();
app.use(express.json());
app.use('/api/auth', router); // Mount the router for testing

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  describe('POST /signup', () => {
    it('should call signup controller', async () => {
      // Mock signup to return a success response
      signup.mockImplementation((req, res) => res.status(201).json({ message: 'User created successfully' }));

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          fullname: 'John Doe',
          username: 'johndoe',
          password: 'password123',
          confirmPassword: 'password123',
          gender: 'male',
        });

      // Verify controller is called
      expect(signup).toHaveBeenCalled();

      // Verify response
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User created successfully');
    });
  });

  describe('POST /login', () => {
    it('should call login controller', async () => {
      // Mock login to return a success response
      login.mockImplementation((req, res) => res.status(200).json({ message: 'Login successful' }));

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'johndoe',
          password: 'password123',
        });

      // Verify controller is called
      expect(login).toHaveBeenCalled();

      // Verify response
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
    });
  });

  describe('POST /logout', () => {
    it('should call logout controller', async () => {
      // Mock logout to return a success response
      logout.mockImplementation((req, res) => res.status(200).json({ message: 'Logged out successfully' }));

      const res = await request(app).post('/api/auth/logout');

      // Verify controller is called
      expect(logout).toHaveBeenCalled();

      // Verify response
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });
});
