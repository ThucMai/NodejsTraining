import { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import { getManager, getRepository } from 'typeorm';
import { VoucherEntity } from '../entities/voucher.entity';
import { GraphQLDateTime } from 'graphql-scalars';
import { generateVoucherCode } from '../../utils/function';
import { EventEntity } from '../entities/event.entity';
import { createVoucherRule, updateVoucherRule } from '../validate/voucher.validate';
import { ActiveItem, AvailableItem, ItemStatus } from '../../utils/variable';

const IDField = {
  id: { type: GraphQLID }
};
const VoucherFields = {
  event_id: { type: GraphQLInt },
  voucher_code: { type: GraphQLString },
  issued_to: { type: GraphQLString },
  issue_date: { type: GraphQLDateTime },
  expired_date: { type: GraphQLDateTime },
  status: { type: GraphQLString }
};

// Define VoucherType
export const VoucherType = new GraphQLObjectType({
  name: 'voucher',
  fields: () => ({...IDField, ...VoucherFields})
});

const voucher = {
  type: VoucherType,
  args: IDField,
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

export const voucherQuery = { voucher, vouchers };


const addVoucher = {
  type: VoucherType,
  args: VoucherFields,
  resolve: async (_parent: unknown, args: {
    event_id: number, voucher_code: string, issued_to: string,
    issue_date: Date, expired_date: Date, status: string
  }) => {
    const { error } = createVoucherRule(args);
    if (error) {
      throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
    }

    return await getManager().transaction(async transactionalEntityManager => {
      const voucherRepository = transactionalEntityManager.getRepository(VoucherEntity);
      const eventRepository = transactionalEntityManager.getRepository(EventEntity);

      if(!args.event_id) {
        throw new Error('Missing event_id');
      }

      const event = await eventRepository.findOne({ where: {id: args.event_id, ...AvailableItem, ...ActiveItem }});
      if (!event) {
        throw new Error('Event is not exist or inactive');
      }
      if (event.voucher_quantity <= event.voucher_released) {
        throw new Error('Number of voucher is maximum');
      }
      let voucherCode = args.voucher_code ?? '';

      if (voucherCode) {
        const isCodeExist = await voucherRepository.findOne({ where: {voucher_code: voucherCode, ...AvailableItem}});
        if (isCodeExist) {
          throw new Error('Voucher code already exist');
        }
      } else {
        voucherCode = generateVoucherCode(7);
        while (await voucherRepository.findOne({ where: {voucher_code: voucherCode, ...AvailableItem}})) {
          voucherCode = generateVoucherCode(7);
        }
      }

      const newVoucher = voucherRepository.create({
        event_id: args.event_id, voucher_code: voucherCode, issued_to: args.issued_to,
        issue_date: args.issue_date, expired_date: args.expired_date, status: args.status
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
  args: {...IDField, ...VoucherFields},
  resolve: async (_parent: unknown, args: {
    id: number, event_id: number, voucher_code: string, issued_to: string,
    issue_date: Date, status: string
  }) => {
    const { error } = updateVoucherRule(args);
    if (error) {
      throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
    }

    const voucherRepository = getRepository(VoucherEntity);
    const voucher = await voucherRepository.findOne({ where: {id: args.id, ...AvailableItem}});
    if (!voucher) {
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
    
    voucher.event_id = args.event_id || voucherUpdate.event_id;
    voucher.voucher_code = voucherCode;
    voucher.issued_to = args.issued_to || voucherUpdate.issued_to;
    voucher.issue_date = args.issue_date || voucherUpdate.issue_date;
    voucher.status = args.status || voucherUpdate.status;
    return await voucherRepository.save(voucher);
  }
};

const deleteVoucher = {
  type: VoucherType,
  args: IDField,
  resolve: async (_parent: unknown, args: {id: number}) => {
    const voucherRepository = getRepository(VoucherEntity);
    const voucher = await voucherRepository.findOne({ where: {id: args.id}});
    if (!voucher) throw new Error('User not found');
    
    voucher.status = 'Inactive';
    return await voucherRepository.save(voucher);
  }
}

export const voucherMutation = { addVoucher, updateVoucher, deleteVoucher };