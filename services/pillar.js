const model = require('../models');

const pillarSvc = {};

pillarSvc.create = async (title, boardId) => {
  const newPillar = await model.Pillar.create({ title });
  await newPillar.setBoard(boardId);
  return newPillar;
};

module.exports = pillarSvc;
