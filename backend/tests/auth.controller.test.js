import request from 'supertest';
import { app } from "./socket/socket.js";
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

jest.mock('../models/user.model.js');
jest.mock('bcryptjs');

describe('Auth Controller - Signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if passwords do not match', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        fullname: 'John Doe',
        username: 'johndoe1',
        password: 'password123',
        confirmPassword: 'password321',
        gender: 'male'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Password do not match');
  });

  test('should return 400 if user already exists', async () => {
    User.findOne.mockResolvedValue({ username: 'johndoe' });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        fullname: 'John Doe',
        username: 'johndoe1',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  test('should create a new user if valid data is provided', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.prototype.save = jest.fn().mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        fullname: 'John Doe',
        username: 'johndoe1',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male'
      });

    expect(res.status).toBe(201);
    expect(User.prototype.save).toHaveBeenCalled();
  });
});