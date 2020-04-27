const { Board, User, Pillar, Item, Action, } = require('../models');
import { isBlank } from '../utils/tool';


const includes = [
  {
    model: User,
    as: 'facilitator',
  },
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

const create = async (name, facilitatorID, groupID, pillarSvc) => {
  if (isBlank(name)) {}

  const newBoard = await Board.create({
    name,
    stage: 'created',
  });

  await newBoard.setFacilitator(facilitatorID);
  await newBoard.setGroup(groupID);

  await pillarSvc.create(':)', newBoard.id, 0);
  await pillarSvc.create(':|', newBoard.id, 1);
  await pillarSvc.create(':(', newBoard.id, 2);

  return newBoard;
};


const findAll = async (whereCl) => {
  const boards = await Board.findAll({
    include: [{
      model: User,
      as: 'facilitator',
    }, {
      model: Group,
      as: 'group',
    }],
    where: whereCl,
  });

  return boards;
}


const fineOne = async (whereCl) => {
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


module.exports = {
  create,
  findAll,
  fineOne,
};
