import { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import { getManager, getRepository } from 'typeorm';
import { VoucherEntity } from './entities/voucher.entity';
import { GraphQLDateTime } from 'graphql-scalars';
import { generateVoucherCode } from '../utils/function';
import { EventEntity } from './entities/event.entity';
import { ActiveItem, AvailableItem, ItemStatus } from '../utils/variable';

// Define VoucherType
export const VoucherType = new GraphQLObjectType({
  name: 'voucher',
  fields: () => ({
    id: { type: GraphQLID },
    event_id: { type: GraphQLInt },
    voucher_code: { type: GraphQLString },
    issued_to: { type: GraphQLString },
    issue_date: { type: GraphQLDateTime },
    status: { type: GraphQLString }
  })
});

const voucher = {
  type: VoucherType,
  args: { id: { type: GraphQLID } },
  resolve: async (_parent: unknown, args: { id: number }) => {
    const voucherRepository = getRepository(VoucherEntity);
    return await voucherRepository.findOne({ where: { id: args.id, ...AvailableItem }});
  }
};

const vouchers = {
  type: new GraphQLList(VoucherType),
  resolve: async () => {
    const voucherRepository = getRepository(VoucherEntity);
    return await voucherRepository.find({ where: AvailableItem});
  }
};

export const eventQuery = { voucher, vouchers };


const addVoucher = {
  type: VoucherType,
  args: {
    id: { type: GraphQLID },
    event_id: { type: GraphQLInt },
    voucher_code: { type: GraphQLString },
    issued_to: { type: GraphQLString },
    issue_date: { type: GraphQLDateTime },
    status: { type: GraphQLString }
  },
  resolve: async (_parent: unknown, args: {
    event_id: number, voucher_code: string, issued_to: string,
    issue_date: Date, status: string
  }) => {
    return await getManager().transaction(async transactionalEntityManager => {
      const voucherRepository = transactionalEntityManager.getRepository(VoucherEntity);
      const eventRepository = transactionalEntityManager.getRepository(EventEntity);
    
      if(!args.event_id) {
        return 'Missing event_id';
      }

      const event = await eventRepository.findOne({ where: {id: args.event_id, ...AvailableItem, ...ActiveItem }});
      if (!event) {
        return 'Event is not exist or inactive';
      }
      if (event.voucher_quantity <= event.voucher_released) {
        return 'Number of voucher is maximum';
      }

      let voucherCode = args.voucher_code ?? '';
      if (voucherCode) {
        const isCodeExist = await voucherRepository.findOne({ where: {voucher_code: voucherCode, ...AvailableItem}});
        if (isCodeExist) {
          return 'Voucher code already exist';
        }
      } else {
        voucherCode = generateVoucherCode(7);
        while (await voucherRepository.findOne({ where: {voucher_code: voucherCode, ...AvailableItem}})) {
          voucherCode = generateVoucherCode(7);
        }
      }
      
      const newVoucher = voucherRepository.create({
        event_id: args.event_id, voucher_code: voucherCode, issued_to: args.issued_to,
        issue_date: args.issue_date, status: args.status
      });
      await voucherRepository.save(newVoucher);
      await eventRepository.update(args.event_id, {
        voucher_released: event.voucher_released + 1
      });

      return newVoucher;
    });
  }
};

const updateVoucher = {
  type: VoucherType,
  args: {
    id: { type: GraphQLID },
    event_id: { type: GraphQLInt },
    voucher_code: { type: GraphQLString },
    issued_to: { type: GraphQLString },
    issue_date: { type: GraphQLDateTime },
    status: { type: GraphQLString }
  },
  resolve: async (_parent: unknown, args: {
    id: number, event_id: number, voucher_code: string, issued_to: string,
    issue_date: Date, status: string
  }) => {
    const voucherRepository = getRepository(VoucherEntity);
    const event = await voucherRepository.findOne({ where: {id: args.id, ...AvailableItem}});
    if (!event) {
      throw new Error('User not found or inactive');
    }

    const voucherUpdate = await voucherRepository.findOne({ where: {id: args.id, ...AvailableItem}});
    if (!voucherUpdate) {
      throw new Error('Voucher not exist');
  }
    let voucherCode = '';
    if (!args.voucher_code) {
      voucherCode = voucherUpdate.voucher_code;
    } else {
      const isExist = await voucherRepository.findOne({ where: {voucher_code: args.voucher_code, ...ActiveItem }});
      if (isExist) {
        return null;
      }
      voucherCode = args.voucher_code
    }
    
    event.event_id = args.event_id || voucherUpdate.event_id;
    event.voucher_code = voucherCode;
    event.issued_to = args.issued_to || voucherUpdate.issued_to;
    event.issue_date = args.issue_date || voucherUpdate.issue_date;
    event.status = args.status || voucherUpdate.status;
    return await voucherRepository.save(event);
  }
};

const deleteVoucher = {
  type: VoucherType,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (_parent: unknown, args: {id: number}) => {
    const voucherRepository = getRepository(VoucherEntity);
    const event = await voucherRepository.findOne({ where: {id: args.id}});
    if (!event) throw new Error('User not found');
    
    event.status = 'Inactive';
    return await voucherRepository.save(event);
  }
}

export const eventMutation = { addVoucher, updateVoucher, deleteVoucher };