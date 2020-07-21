import models from '../models/index.js';
const { Action, Group, Item, User } = models;

const includes = [
  {
    model: User,
    as: 'owner',
  },
  {
    model: Group,
    as: 'group',
  },
  {
    model: Item,
    as: 'item',
  },
];

export const create = async (title, ownerID, groupID, boardID, itemID) => {
  const newAction = await Action.create({title});

  await newAction.setOwner(ownerID);
  await newAction.setGroup(groupID);
  await newAction.setBoard(boardID);
  await newAction.setItem(itemID);

  return newAction;
};


const remove = async (id) => {
  await Action.destroy({
    where: { id },
  });
}


const findAll = async (whereCl) => {
  const actions = await Action.findAll({
    include: includes,
    where: whereCl,
    order: [['createdAt', 'DESC']],
  });

  return actions;
}


const findOne = async (whereCl) => {
  const action = await Action.findOne({
    include: includes,
    where: whereCl,
  });

  return action;
}


const update = async (id, fields) => {
  await Action.update(
    fields,
    { where: { id } },
  );
}

export default {
  create,
  remove,
  findAll,
  findOne,
  update,
};
