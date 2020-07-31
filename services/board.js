import models from '../models/index.js';
const { Action, Board, Group, Item, Pillar, User } = models;
import { isBlank } from '../utils/tool';


const includes = [
  {
    model: Group,
    as: 'group',
  },
  {
    model: Pillar,
    as: 'pillars',
    include: [
      {
        model: Item,
        as: 'items',
        include: [
          {
            model: Action,
            as: 'actions',
            include: [
              {
                model: User,
                as: 'owner',
              }
            ],
          }
        ],
      }
    ],
  },
];


const create = async (name, groupID, pillarSvc) => {
  if (isBlank(name)) {}

  const [newBoard, created] = await Board.findOrCreate({
    where: {
      groupID,
      stage: 'created',
    },
    defaults: {
      name,
      stage: 'created',
    },
  });
  await newBoard.setGroup(groupID);

  console.info(created ? 'created new' : 'found existing', newBoard.name);
  if (created) {
    await pillarSvc.create(':D', newBoard.id, 0);
    await pillarSvc.create(':|', newBoard.id, 1);
    await pillarSvc.create(':(', newBoard.id, 2);
  }

  return newBoard;
};


const findAll = async (whereCl) => {
  const boards = await Board.findAll({
    include: [{
      model: Group,
      as: 'group',
    }],
    where: whereCl,
  });

  return boards;
}


const findOne = async (whereCl) => {
  const board = await Board.findOne({
    include: includes,
    order: [
      [{ model: Pillar, as: 'pillars' }, 'position', 'ASC'],
      [{ model: Pillar, as: 'pillars' }, { model: Item, as: 'items' }, 'likes', 'DESC'],
      [{ model: Pillar, as: 'pillars' }, { model: Item, as: 'items' }, 'createdAt', 'ASC'],
      [{ model: Pillar, as: 'pillars' }, { model: Item, as: 'items' }, { model: Action, as: 'actions' }, 'createdAt', 'ASC'],
    ],
    where: whereCl,
  });

  return board;
}


const update = async (id, fields) => {
  await Board.update(
    fields,
    { where: { id } },
  );
}


export default {
  create,
  findAll,
  findOne,
  update,
};
