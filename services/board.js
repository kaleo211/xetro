const pillarSvc = require('./pillar');
const model = require('../models');

const create = async (name, facilitatorID, groupID) => {
  const newBoard = await model.Board.create({
    name,
    stage: 'created',
  });

  await newBoard.setFacilitator(facilitatorID);
  await newBoard.setGroup(groupID);

  await pillarSvc.create(':)', newBoard.id);
  await pillarSvc.create(':|', newBoard.id);
  await pillarSvc.create(':(', newBoard.id);

  return newBoard;
};


module.exports = {
  create,
};
