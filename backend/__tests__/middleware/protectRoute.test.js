import jwt from 'jsonwebtoken';
import protectRoute from '../../middleware/protectRoute.js';
import User from '../../models/user.model.js';

jest.mock('jsonwebtoken'); // Mock jsonwebtoken
jest.mock('../../models/user.model.js'); // Mock User model

describe('protectRoute Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} }; // Mock request object
    res = { status: jest.fn(() => res), json: jest.fn() }; // Mock response object
    next = jest.fn(); // Mock next function
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('should return 401 if no token is provided', async () => {
    req.cookies.jwt = null; // No token

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - No Token Provided ' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is invalid', async () => {
    req.cookies.jwt = 'invalidToken';

    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token'); // Simulate token verification failure
    });

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - Invalid Token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if the user is not found', async () => {
    req.cookies.jwt = 'validToken';

    jwt.verify.mockReturnValue({ userId: '12345' }); // Mock decoded token
    const mockSelect = jest.fn().mockResolvedValue(null); // Mock user not found
    User.findById.mockReturnValue({ select: mockSelect }); // Mock chainable method

    await protectRoute(req, res, next);

    expect(User.findById).toHaveBeenCalledWith('12345');
    expect(mockSelect).toHaveBeenCalledWith('-password'); // Verify `.select` is called
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found ' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if the token is valid and the user exists', async () => {
    req.cookies.jwt = 'validToken';

    jwt.verify.mockReturnValue({ userId: '12345' }); // Mock decoded token
    const mockSelect = jest.fn().mockResolvedValue({ _id: '12345', username: 'testuser' }); // Mock user
    User.findById.mockReturnValue({ select: mockSelect }); // Mock chainable method

    await protectRoute(req, res, next);

    expect(User.findById).toHaveBeenCalledWith('12345');
    expect(mockSelect).toHaveBeenCalledWith('-password');
    expect(req.user).toEqual({ _id: '12345', username: 'testuser' }); // Verify user is attached
    expect(next).toHaveBeenCalled();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    req.cookies.jwt = 'validToken';

    jwt.verify.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(next).not.toHaveBeenCalled();
  });
});
