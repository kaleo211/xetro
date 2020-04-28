import { Op } from 'sequelize';
import models from '../models/index.js';
const { Action, Group, User } = models;

const create = async (email, firstName, lastName, microsoftID) => {
  await User.create({
    email,
    firstName,
    lastName,
    microsoftID,
  });
}


const findAll = async (whereCl) => {
  const users = await User.findAll({
    include: [
      {
        model: Group,
        as: 'groups',
        through: {},
      }
    ],
  });

  return users;
}


const findOne = async (whereCl) => {
  const user = await User.findOne({
    include: [
      {
        model: Group,
        as: 'groups',
        through: {},
      },
      {
        model: Action,
        as: 'actions',
        where: {
          stage: {
            [Op.ne]: 'done',
          },
        },
        required: false,
      }
    ],
    where: whereCl,
  })

  return user;
};


const findOrCreateByEmail = async (email, user) => {
  const users = await User.findOrCreate({
    where: { email },
    defaults: user,
  });
  return users;
}


const updateMicrosoftID = async (email, id) => {
  await User.update({
    microsoftID: id,
  }, {
    where: { email }
  });
}


const updateByEmail = async (email, user) => {
  await User.update(user, {
    where: { email },
  });
}


export default {
  create,
  findAll,
  findOne,
  findOrCreateByEmail,
  updateByEmail,
  updateMicrosoftID,
};
