const pillarSvc = require('./pillar');
const model = require('../models');

const boardSvc = {};

boardSvc.create = async (name, facilitatorId, groupId) => {
  const newBoard = await model.Board.create({
    name,
    stage: 'created',
  });

  await newBoard.setFacilitator(facilitatorId);
  await newBoard.setGroup(groupId);

  await pillarSvc.create(':)', newBoard.id);
  await pillarSvc.create(':|', newBoard.id);
  await pillarSvc.create(':(', newBoard.id);

  return newBoard;
};

module.exports = boardSvc;
