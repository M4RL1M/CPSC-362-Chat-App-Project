import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from "../../models/user.model";

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory MongoDB server
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect and stop the in-memory MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Model Test Suite", () => {
  it("should create and save a user successfully", async () => {
    const validUser = new User({
      fullname: "Mai Ann",
      username: "maimai",
      password: "password123",
      gender: "female",
    });

    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.fullname).toBe("Mai Ann");
    expect(savedUser.username).toBe("maimai");
    expect(savedUser.password).toBe("password123");
    expect(savedUser.gender).toBe("female");
    expect(savedUser.profilePic).toBe(""); // Default value
  });

  it("should fail if required fields are missing", async () => {
    const userWithoutRequiredField = new User({ username: "maimai" });

    let error;
    try {
      await userWithoutRequiredField.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.fullname).toBeDefined();
    expect(error.errors.password).toBeDefined();
    expect(error.errors.gender).toBeDefined();
  });

  it("should fail if username is not unique", async () => {
    const user1 = new User({
      fullname: "John Doe",
      username: "johndoe",
      password: "password123",
      gender: "male",
    });
    const user2 = new User({
      fullname: "Jane Doe",
      username: "johndoe", // Duplicate username
      password: "password456",
      gender: "female",
    });

    await user1.save();

    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });

  it("should enforce enum values for gender", async () => {
    const userWithInvalidGender = new User({
      fullname: "John Doe",
      username: "johndoe",
      password: "password123",
      gender: "invalid_gender",
    });

    let error;
    try {
      await userWithInvalidGender.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.gender).toBeDefined();
  });
});
