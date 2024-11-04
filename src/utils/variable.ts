export const Deleted = 'is_deleted';

export const ItemStatus = { Active: 'Active', Inactive: 'Inactive' };

export const ActiveItem = { status: ItemStatus.Active };

export const AvailableItem = { [Deleted]: false };

export const AvailableItemMongo = { $or: [
    { [Deleted]: false },
    { [Deleted]: { $exists: false } }
] };

export const jwtSecret = process.env.JWT_SECRET || '';

export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';