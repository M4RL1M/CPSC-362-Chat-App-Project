import User from '../../models/user.model.js';
import { getUsersForSidebar } from '../../controllers/user.controller.js';

jest.mock('../../models/user.model.js'); // Mock the User model

describe('getUsersForSidebar', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        _id: 'loggedInUserId',
      },
    }; // Mocked request
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    }; // Mocked response
    jest.clearAllMocks(); // Clear mocks before each test
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore console.error after all tests
  });

  it('should return filtered users excluding the logged-in user', async () => {
    // Mock the User.find method to return a list of users excluding the logged-in user
    User.find.mockResolvedValue([
      {
        _id: 'user1',
        fullname: 'John Doe',
        username: 'johndoe',
        gender: 'male',
        profilePic: 'profilePicUrl',
      },
      {
        _id: 'user2',
        fullname: 'Jane Doe',
        username: 'janedoe',
        gender: 'female',
        profilePic: 'profilePicUrl2',
      },
    ]);

    await getUsersForSidebar(req, res);

    // Ensure User.find was called with the correct query
    expect(User.find).toHaveBeenCalledWith({ _id: { $ne: 'loggedInUserId' } });

    // Ensure the correct response is sent
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        _id: 'user1',
        fullname: 'John Doe',
        username: 'johndoe',
        gender: 'male',
        profilePic: 'profilePicUrl',
      },
      {
        _id: 'user2',
        fullname: 'Jane Doe',
        username: 'janedoe',
        gender: 'female',
        profilePic: 'profilePicUrl2',
      },
    ]);
  });

  it('should return 500 if an error occurs', async () => {
    // Simulate an error in User.find
    User.find.mockImplementation(() => {
      throw new Error('Database error');
    });

    await getUsersForSidebar(req, res);

    // Ensure the response is a 500 Internal Server Error
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });

    // Ensure the error is logged
    expect(console.error).toHaveBeenCalledWith('Error in getUsersForSidebar',
      'Database error');
  });
});
