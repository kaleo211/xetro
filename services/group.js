const { Op } = require('sequelize');
const model = require('../models');
const { isBlank } = require('../utils/tool');

const include = [{
  model: model.User,
  as: 'members',
  through: {},
}];

const search = async (query) => {
  const { name } = query;

  const where = {};
  if (!isBlank(name)) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  const groups = await model.Group.findAll({ include, where });
  return groups;
};

const setFacilitator = async (groupID, facilitatorID) => {
  const group = await model.Group.findOne({where: {id: groupID}});
  if (!group) {
    throw new Error('no group found');
  }

  const facilitator = await  model.User.findOne({where: {id: facilitatorID}});
  if (!facilitator) {
    throw new Error('no facilitator found');
  }

  await group.setFacilitator(facilitator);
}

module.exports = {
  search,
  setFacilitator,
};
