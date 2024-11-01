export const Deleted = 'is_deleted';

export const ItemStatus = { Active: 'Active', Inactive: 'Inactive' };

export const ActiveItem = { status: ItemStatus.Active };

export const AvailableItem = { [Deleted]: false };

export const AvailableItemMongo = { $or: [
    { [Deleted]: false },
    { [Deleted]: { $exists: false } }
] };