import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/user.model.js';
import generateTokenAndSetCookie from '../../utils/generateToken.js';
import { signup, login, logout } from '../../controllers/auth.controller.js';

jest.mock('../../models/user.model.js'); // Mock the User model
jest.mock('../../utils/generateToken.js'); // Mock the token utility
jest.mock('bcryptjs'); // Mock bcrypt

const app = express();
app.use(express.json());
app.post('/signup', signup);
app.post('/login', login);
app.post('/logout', logout);

describe('Auth Controller Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('Signup', () => {
    it('should return 400 if passwords do not match', async () => {
      const res = await request(app).post('/signup').send({
        fullname: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        confirmPassword: 'password321',
        gender: 'male',
      });
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Password do not match' });
    });
  
    it('should return 400 if the user already exists', async () => {
      User.findOne.mockResolvedValue({ username: 'johndoe' });
  
      const res = await request(app).post('/signup').send({
        fullname: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
      });
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'User already exists' });
    });
  
    it('should create a new user and return 201 with user data', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'John Doe',
        username: 'johndoe',
        profilePic: 'https://avatar.iran.liara.run/public/boy?username=johndoe',
      });
      
      generateTokenAndSetCookie.mockImplementation(() => {});
  
      const res = await request(app).post('/signup').send({
        fullname: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
      });
  
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        fullname: 'John Doe',
        username: 'johndoe',
        profilePic: 'https://avatar.iran.liara.run/public/boy?username=johndoe',
      });
      expect(User.prototype.save).toHaveBeenCalled();
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith(expect.any(String), res);
    });
  
    it('should return 400 if newUser.save() fails', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
    
      // Simulate `newUser.save()` throwing an error
      User.prototype.save = jest.fn(() => {
        throw new Error("Save failed");
      });
    
      const res = await request(app).post('/signup').send({
        fullname: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
      });
    
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Invalid User Data" });
    });
    
  
    it('should return 500 if an error occurs', async () => {
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
  
      const res = await request(app).post('/signup').send({
        fullname: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
      });
  
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });
  

  describe('Login', () => {
    it('should return 400 if the user is not found or password is incorrect', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.compare.mockResolvedValue(false);
  
      const res = await request(app).post('/login').send({
        username: 'johndoe',
        password: 'password123',
      });
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid username or password' });
    });
  
    it('should log in the user and return 200 with user data', async () => {
      const mockUser = {
        _id: 'user123',
        fullname: 'John Doe',
        username: 'johndoe',
        password: 'hashedPassword',
        profilePic: 'somePicUrl',
      };
  
      User.findOne.mockResolvedValue(mockUser); // Mock user lookup
      bcrypt.compare.mockResolvedValue(true); // Mock password comparison
      generateTokenAndSetCookie.mockImplementation(() => {}); // Mock token generation
  
      const res = await request(app).post('/login').send({
        username: 'johndoe',
        password: 'password123',
      });
  
      // Verify response
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        fullname: 'John Doe',
        username: 'johndoe',
        profilePic: 'somePicUrl',
      });
  
      // Verify `generateTokenAndSetCookie` is called with correct arguments
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith(mockUser._id, expect.any(Object));
    });
  
    it('should return 500 if an error occurs', async () => {
      // Mock `User.findOne` to throw an error
      User.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });
  
      const res = await request(app).post('/login').send({
        username: 'johndoe',
        password: 'password123',
      });
  
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
    });
  });
  

  describe('Logout', () => {
    it('should clear the JWT cookie and return 200', async () => {
      const res = await request(app).post('/logout');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Logged out successfully' });
    });
  
    it('should return 500 if an error occurs', async () => {
      // Mock `res.cookie` to throw an error
      const mockCookie = jest.spyOn(express.response, 'cookie').mockImplementation(() => {
        throw new Error('Cookie error');
      });
  
      const res = await request(app).post('/logout');
  
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal Server Error' });
  
      // Restore the original implementation
      mockCookie.mockRestore();
    });
  });
  
});
