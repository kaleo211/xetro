const model = require('../models');

const pillarSvc = {};

pillarSvc.create = async (title, boardID, position) => {
  const newPillar = await model.Pillar.create({ title, position });
  await newPillar.setBoard(boardID);
  return newPillar;
};

module.exports = pillarSvc;
