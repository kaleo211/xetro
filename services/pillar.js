const model = require('../models');

const pillarSvc = {};

pillarSvc.create = async (title, boardID) => {
  const newPillar = await model.Pillar.create({ title });
  await newPillar.setBoard(boardID);
  return newPillar;
};

module.exports = pillarSvc;
