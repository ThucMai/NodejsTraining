import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { MockMongoose } from 'mock-mongoose';
import Redis from 'ioredis-mock';
import { EventLockService } from '../services/event_lock.service';
import { EventLockModel } from '../entities/event_lock.entity';
import { AuthRequest } from '../middleware/auth.middleware';

let eventLockService: EventLockService;
let mongoServer: MongoMemoryServer;

const mockUserId = '671079a28471f0e3b4493a21';
const mockEventId = '67107d9acf7dee8fad38f981';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
  new MockMongoose(mongoose);

  eventLockService = new EventLockService();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('EventLockService.editable', () => {
  it('should return true when event is editable by the current user', async () => {
    // Arrange: Set up mock data in the database
    const mockEventLock = new EventLockModel({
      event_id: mockEventId,
      user_id: mockUserId,
      time_lock: new Date()
    });
    await mockEventLock.save();

    const mockRequest: Partial<AuthRequest> = {
      user: { id: mockUserId }
    };
    const req = mockRequest as AuthRequest;

    // Act: Call the `editable` method
    const result = await eventLockService.editable('mockEventId', req);

    // Assert: Check if the result is true (event is editable by the current user)
    expect(result).toBe(true);
  });

  it('should return false when the event is locked by another user', async () => {
    // Arrange: Set up a lock for a different user
    const mockEventLock = new EventLockModel({
      event_id: 'mockEventId',
      user_id: 'other-user-id',
      time_lock: new Date()
    });
    await mockEventLock.save();

    const mockRequest: Partial<AuthRequest> = {
      user: { id: mockUserId }
    };
    const req = mockRequest as AuthRequest;

    // Act: Call the `editable` method
    const result = await eventLockService.editable('mockEventId', req);

    // Assert: Check if the result is false (event is locked by another user)
    expect(result).toBe(false);
  });
});