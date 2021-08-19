import { Database } from "../models/index";
import { Action } from "../models/action";
import { Keyable } from "../types/common";

export interface ActionServiceI {
  create(title:string, ownerID:string, groupID:string, boardID:string, itemID:string): Promise<Action>,
  remove(id:string): Promise<void>,
  findAll(whereCl:Keyable): Promise<Action[]>,
  findOne(whereCl:Keyable): Promise<Action>,
  update(id:string, fields:Keyable): Promise<void>,
}

export class ActionService implements ActionServiceI {
  db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  public create = async (title: string, ownerID: string, groupID: string, boardID: string, itemID: string) => {
    const newAction = await this.db.action.create({title});

    await newAction.setOwner(ownerID);
    await newAction.setGroup(groupID);
    await newAction.setBoard(boardID);
    await newAction.setItem(itemID);

    return newAction;
  };

  public remove = async (id: string) => {
    await this.db.action.destroy({
      where: { id },
    });
  }

  public findAll = async (whereCl: Keyable) => {
    const actions = await this.db.action.findAll({
      include: [
        { model: this.db.user, as: 'owner' },
        { model: this.db.group, as: 'group' },
        { model: this.db.item, as: 'item' },
      ],
      where: whereCl,
      order: [['createdAt', 'DESC']],
    });

    return actions;
  }

  public findOne = async (whereCl: Keyable) => {
    const action = await this.db.action.findOne({
      include: [
        { model: this.db.user, as: 'owner' },
        { model: this.db.group, as: 'group' },
        { model: this.db.item, as: 'item' },
      ],
      where: whereCl,
    });

    return action;
  }

  public update = async (id: string, fields: Keyable) => {
    await this.db.action.update(
      fields,
      { where: { id } },
    );
  }
}
