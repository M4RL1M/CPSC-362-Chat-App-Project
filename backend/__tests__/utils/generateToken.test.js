import jwt from 'jsonwebtoken';
import generateTokenAndSetCookie from '../../utils/generateToken.js';

jest.mock('jsonwebtoken'); // Mock the jsonwebtoken library

describe('generateTokenAndSetCookie', () => {
  let res;

  beforeEach(() => {
    res = {
      cookie: jest.fn(), // Mock the res.cookie function
    };
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should generate a token and set it as a cookie with correct properties', () => {
    // Mock jwt.sign to return a fake token
    jwt.sign.mockReturnValue('fakeToken');

    const userId = '12345';
    process.env.JWT_SECRET = 'testSecret'; // Set the JWT_SECRET for the test
    process.env.NODE_ENV = 'production'; // Set NODE_ENV to production for the test

    generateTokenAndSetCookie(userId, res);

    // Verify jwt.sign is called with correct arguments
    expect(jwt.sign).toHaveBeenCalledWith({ userId }, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });

    // Verify res.cookie is called with correct arguments
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'fakeToken', {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      sameSite: 'strict',
      secure: true, // NODE_ENV is production
    });
  });

  it('should set secure to false if NODE_ENV is "development"', () => {
    // Mock jwt.sign to return a fake token
    jwt.sign.mockReturnValue('fakeToken');

    const userId = '12345';
    process.env.JWT_SECRET = 'testSecret'; // Set the JWT_SECRET for the test
    process.env.NODE_ENV = 'development'; // Set NODE_ENV to development for the test

    generateTokenAndSetCookie(userId, res);

    // Verify res.cookie is called with secure set to false
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'fakeToken', {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      sameSite: 'strict',
      secure: true, // NODE_ENV is development
    });
  });
});
