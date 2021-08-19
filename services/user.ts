import { User } from '../models/user';
import { Op } from 'sequelize';
import { UserI } from '../types/models';
import { Database } from '../models/index';
import { Keyable } from "../types/common";

export interface UserServiceI {
  create(email:string, firstName:string, lastName:string): Promise<void>,
  findAll(): Promise<User[]>,
  findOne(whereCL:Keyable): Promise<User>,
  findOrCreateByEmail(email:string, user:UserI): Promise<User>,
  updateByEmail(email:string, user:Keyable): Promise<void>,
};

export class UserService implements UserServiceI {
  db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  public create = async (email: string, firstName: string, lastName: string) => {
    await this.db.user.create({ email, firstName, lastName });
  }

  public findAll = async () => {
    const users = await this.db.user.findAll({
      include: [{ model: this.db.group, as: 'groups', through: {} }],
    });
    return users;
  }

  public findOne = async (whereCl: Keyable) => {
    const user = await this.db.user.findOne({
      include: [
        { model: this.db.group, as: 'groups', through: {} },
        {
          model: this.db.action,
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
    });

    return user;
  };

  public findOrCreateByEmail = async (email: string, user: User) => {
    const [users, created] = await this.db.user.findOrCreate({
      where: { email },
      defaults: user,
    });

    return users;
  }


  public updateByEmail = async (email: string, user: Keyable) => {
    await this.db.user.update(user, {
      where: { email },
    });
  }
}
