import { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt } from 'graphql';
import { getManager, getRepository, MoreThan } from 'typeorm';
import { EventLockEntity } from '../entities/event_lock.entity';
import { EventEntity } from '../entities/event.entity';
import { ItemStatus, AvailableItem, ActiveItem, Deleted } from '../../utils/variable';
import { createEventRule, updateEventRule } from '../validate/event.validate';
import { GraphQLDateTime } from 'graphql-scalars';
import { EventModel } from '../../entities/event.entity';
import { EventLockModel } from '../../entities/event_lock.entity';

const EventLockFields = {
  event_id: { type: GraphQLInt },
  user_id: { type: GraphQLInt },
  status: { type: GraphQLString },
  time_lock: { type: GraphQLString }
}
const time_lock = parseInt(process.env.TIME_LOCK_EVENT || '5');

// Define EventLockType
export const EventLockType = new GraphQLObjectType({
  name: 'event',
  fields: () => (EventLockFields)
});

const isEditable = async(event_id: number, user_id: number) => {
  return await getManager().transaction(async transactionalEntityManager => {
    const eventLockRepository = transactionalEntityManager.getRepository(EventLockEntity);
    const eventRepository = transactionalEntityManager.getRepository(EventEntity);

    const event = await eventRepository.findOne({ where: {id: event_id}});
    if (!event) throw new Error('Event not found');

    const eventLockByMe = await EventLockModel.findOne({
      where: {
        event_id: event_id,
        user_id: user_id,
        time_lock: MoreThan(new Date(new Date().getTime() - time_lock * 60000))
      }
    })

    if (eventLockByMe) return true;

    const eventLocked = await eventLockRepository.findOne({
      where: {
        event_id: event_id,
        time_lock: MoreThan(new Date(new Date().getTime() - time_lock * 60000))
      }
    })

    if (eventLocked) return false;
    return true;
  });
}

const deleteRow = async(event_id: number, user_id: number | null) => {
  const eventLockRepository = getRepository(EventLockEntity);
  let condition: { event_id: number; user_id?: number }  = {event_id: event_id};
  if (user_id) {
    condition = { ...condition, user_id: user_id };
  }
  return eventLockRepository.delete({})
};

const editable = {
  type: EventLockType,
  args: {event_id: { type: GraphQLInt }},
  resolve: async (_parent: unknown, args: { event_id: number }, context: { user?: { id: number }}) => {
    try {
      const user_id = context?.user?.id;
      if (!user_id) throw new Error('Unauthorized');

      return await isEditable(args.event_id, user_id!);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
};

export const eventLockQuery = { editable };

const enterEdit = {
  type: EventLockType,
  args: {event_id: { type: GraphQLInt }},
  resolve: async (_parent: unknown, args: { event_id: number }, context: { user?: { id: number }}) => {
    try {
      return await getManager().transaction(async transactionalEntityManager => {
        const user_id = context?.user?.id;
        if (!user_id) throw new Error('Unauthorized');
        const editable = await isEditable(args.event_id, user_id);
        if (!editable) {
          throw new Error('Cannot edit event');
        }
        const eventLockRepository = transactionalEntityManager.getRepository(EventLockEntity);
        await eventLockRepository.delete({event_id: args.event_id})

        const newEventLock = eventLockRepository.create({
          event_id: args.event_id,
          user_id: user_id,
          time_lock: new Date()
        });
        await eventLockRepository.save(newEventLock);
        return true;
      })
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}

const maintainEdit = {
  type: EventLockType,
  args: {event_id: { type: GraphQLInt }},
  resolve: async (_parent: unknown, args: { event_id: number }, context: { user?: { id: number }}) => {
    try {
      return await getManager().transaction(async transactionalEntityManager => {
        const user_id = context?.user?.id;
        if (!user_id) throw new Error('Unauthorized');
        const editable = await isEditable(args.event_id, user_id);
        if (!editable) throw new Error('Request is block');

        const eventLockRepository = transactionalEntityManager.getRepository(EventLockEntity);
        const result = await eventLockRepository.update(
          {
            event_id: args.event_id,
            user_id: user_id
          },
          {
            time_lock: new Date()
          }
        );
        return result ? true : false;
      })
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}

const deleteEventLock = {
  type: EventLockType,
  args: {
    event_id: { type: GraphQLInt },
    user_id: { type: GraphQLInt } 
  },
  resolve: async (_parent: unknown, args: { event_id: number, user_id: number | null }, context: { user?: { id: number }}) => {
    try {
      let user_id = args.user_id;
      if (!user_id) {
        user_id = context?.user?.id!;
      }
      if (!user_id) throw new Error('Unauthorized');

      return await deleteRow(args.event_id, user_id);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}

export const eventLockMutation = { enterEdit, maintainEdit, deleteEventLock };