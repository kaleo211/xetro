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

module.exports = {
  search,
};
