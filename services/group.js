import { Op } from 'sequelize';
import models from '../models/index.js';
const { Action, Board, Group, Item, User } = models;
import { isBlank } from '../utils/tool';

const include = [
  {
    model: User,
    as: 'members',
    through: {},
  }
];

const includesForEach = [
  {
    model: User,
    as: 'members',
    include: [
      {
        model: Action,
        as: 'actions',
        where: {
          stage: {
            [Op.ne]: 'done',
          },
        },
        required: false,
      }
    ],
  },
  {
    model: User,
    as: 'facilitator',
  },
  {
    model: Board,
    as: 'boards',
  },
  {
    model: Action,
    as: 'actions',
    where: {
      stage: {
        [Op.ne]: 'done',
      },
    },
    required: false,
    include: [
      {
        model: User,
        as: 'owner',
      }
    ],
  },
];


const addMember = async (groupID, userID) => {
  const group = await Group.findOne({ where: {id: groupID }});
  if (group) {
    await group.addMembers(userID);
    console.info('new user is added to group', group.name);
  }
}


const findOne = async (whereCl) => {
  const group = await Group.findOne({
    include: includesForEach,
    where: whereCl,
  });
  return group;
}


const findOrCreateByName = async (name) => {
  const newGroups = await Group.findOrCreate({
    where: { name },
  });
  return newGroups;
}


const remove = async (id) => {
  await Item.destroy({
    where: { id },
  });
};


const searchByName = async (name) => {
  const where = {};
  if (!isBlank(name)) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  const groups = await Group.findAll({ include, where });
  return groups;
};


const setFacilitator = async (groupID, facilitatorID) => {
  const group = await Group.findOne({where: {id: groupID}});
  if (!group) {
    throw new Error('no group found');
  }

  const facilitator = await User.findOne({where: {id: facilitatorID}});
  if (!facilitator) {
    throw new Error('no facilitator found');
  }

  await group.setFacilitator(facilitator);
}


export default {
  addMember,
  findOne,
  findOrCreateByName,
  remove,
  searchByName,
  setFacilitator,
};
