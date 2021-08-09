import { Action } from '../models/action';
import { Board } from '../models/board';
import { User } from '../models/user';
import { Op } from 'sequelize';
import { Database } from 'models';
import { keyable } from 'utils/tool';
import { Group } from 'models/group';

const include = [
  {
    model: User,
    as: 'members',
    through: {},
  }
];

const includesForEach = [
  {
    model: User,
    as: 'members',
    include: [
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
  },
  {
    model: User,
    as: 'facilitator',
  },
  {
    model: Board,
    as: 'boards',
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
    include: [
      {
        model: User,
        as: 'owner',
      }
    ],
  },
];

export interface GroupServiceI {
  addMember(groupID:string, userID:string): Promise<void>,
  findOne(whereCl:keyable): Promise<Group>,
  findOrCreateByName(name:string): Promise<Group>,
  remove(id:string): Promise<void>,
  // searchByName(name:string): Promise<Group[]>,
  setFacilitator(groupID:string, facilitatorID:string): Promise<void>,
};

export class GroupService implements GroupServiceI {
  db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  public addMember = async (groupID: string, userID: string) => {
    const group = await this.db.group.findOne({ where: {id: groupID }});
    if (group) {
      await group.addMembers(userID);
      console.info('new user is added to group', group.name);
    }
  }

  public findOne = async (whereCl: keyable) => {
    const group = await this.db.group.findOne({
      include: includesForEach,
      where: whereCl,
    });
    return group;
  }

  public findOrCreateByName = async (name: string) => {
    const [newGroups, created] = await this.db.group.findOrCreate({
      where: { name },
    });
    return newGroups;
  }


  public remove = async (id: string) => {
    await this.db.group.destroy({
      where: { id },
    });
  };


  // public searchByName = async (name: string) => {
  //   const where = {};
  //   if (name && name != "") {
  //     where.name = { [Op.iLike]: `%${name}%` };
  //   }

  //   const groups = await this.db.group.findAll({ include, where });
  //   return groups;
  // };


  public setFacilitator = async (groupID: string, facilitatorID: string) => {
    const group = await this.db.group.findOne({where: {id: groupID}});
    if (!group) {
      throw new Error('no group found');
    }

    const facilitator = await User.findOne({where: {id: facilitatorID}});
    if (!facilitator) {
      throw new Error('no facilitator found');
    }

    await group.setFacilitator(facilitator);
  }
}

