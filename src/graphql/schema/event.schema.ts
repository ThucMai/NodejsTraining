import { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import { getRepository } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
import { ItemStatus, AvailableItem, ActiveItem, Deleted } from '../../utils/variable';
import { createEventRule, updateEventRule } from '../validate/event.validate';
import { GraphQLDateTime } from 'graphql-scalars';

const IDField = {
  id: { type: GraphQLID }
};

const EventFields = {
  event_name: { type: GraphQLString },
  description: { type: GraphQLString },
  event_date_start: { type: GraphQLDateTime },
  event_date_end: { type: GraphQLDateTime },
  voucher_quantity: { type: GraphQLString },
  voucher_released: { type: GraphQLString },
  status: { type: GraphQLString },
}

// Define EventType
export const EventType = new GraphQLObjectType({
  name: 'event',
  fields: () => ({...IDField, ...EventFields})
});

const event = {
  type: EventType,
  args: IDField,
  resolve: async (_parent: unknown, args: { id: number }) => {
    const eventRepository = getRepository(EventEntity);
    return await eventRepository.findOne({ where: { id: args.id, ...AvailableItem }});
  }
};

const events = {
  type: new GraphQLList(EventType), // Return a list of EventType
  resolve: async () => {
    const eventRepository = getRepository(EventEntity);
    return await eventRepository.find({ where: AvailableItem});
  }
};

export const eventQuery = { event, events };


const addEvent = {
  type: EventType,
  args: EventFields,
  resolve: async (_parent: unknown, args: {
    event_name: string, description: string, event_date_start: Date,
    event_date_end: Date, voucher_quantity: number, voucher_released: number, status: string
  }) => {
    const { error } = createEventRule(args);
    if (error) {
      throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
    }

    const eventRepository = getRepository(EventEntity);
    const newEvent = eventRepository.create({
      event_name: args.event_name, description: args.description, event_date_start: args.event_date_start,
      event_date_end: args.event_date_end, voucher_quantity: args.voucher_quantity,
      voucher_released: args.voucher_released, status: args.status
    });
    return await eventRepository.save(newEvent);
  }
};

const updateEvent = {
  type: EventType,
  args: {...IDField, ...EventFields},
  resolve: async (_parent: unknown, args: {
    id: number, event_name: string, description: string, event_date_start: Date,
    event_date_end: Date, voucher_quantity: number, voucher_released: number, status: string
  }) => {
    const { error } = updateEventRule(args);
    if (error) {
      throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
    }

    const eventRepository = getRepository(EventEntity);
    const event = await eventRepository.findOne({ where: {id: args.id, ...ActiveItem, ...AvailableItem}});
    if (!event) throw new Error('User not found');

    event.event_name = args.event_name || event.event_name;
    event.description = args.description || event.description;
    event.event_date_start = args.event_date_start || event.event_date_start;
    event.event_date_end = args.event_date_end || event.event_date_end;
    event.voucher_quantity = args.voucher_quantity || event.voucher_quantity;
    event.voucher_released = args.voucher_released || event.voucher_released;
    event.status = args.status || event.status;
    return await eventRepository.save(event);
  }
};

const deleteEvent = {
  type: EventType,
  args: IDField,
  resolve: async (_parent: unknown, args: {id: number}) => {
    const eventRepository = getRepository(EventEntity);
    const event = await eventRepository.findOne({ where: {id: args.id}});
    if (!event) throw new Error('Event not found');
    
    event[Deleted] = true;
    return await eventRepository.save(event);
  }
}

export const eventMutation = { addEvent, updateEvent, deleteEvent };