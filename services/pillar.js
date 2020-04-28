import models from '../models/index.js';
const { Action, Board, Item, Pillar, User } = models;

const create = async (title, boardID, position) => {
  const newPillar = await Pillar.create({ title, position });
  await newPillar.setBoard(boardID);
  return newPillar;
};


const findOne = async (whereCl) => {
  const pillar = await Pillar.findOne({
    include: [
      {
        model: Board,
        as: 'board',
      },
      {
        model: Item,
        as: 'items',
        order: [['createdAt', 'ASC']],
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
    where: whereCl,
  });
  return pillar;
}


const remove = async (id) => {
  await Pillar.destroy({
    where: { id },
  });
}


const updateTitle = async (id, title) => {
  await Pillar.update(
    { title },
    { where: { id } },
  );
}


export default {
  create,
  findOne,
  remove,
  updateTitle,
}
