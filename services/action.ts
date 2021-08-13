import { Database } from "../models/index";
import { Action } from "../models/action";
import { keyable } from "../utils/tool";

export interface ActionServiceI {
  create(title:string, ownerID:string, groupID:string, boardID:string, itemID:string): Promise<Action>,
  remove(id:string): Promise<void>,
  findAll(whereCl:keyable): Promise<Action[]>,
  findOne(whereCl:keyable): Promise<Action>,
  update(id:string, fields:keyable): Promise<void>,
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

  public findAll = async (whereCl: keyable) => {
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

  public findOne = async (whereCl: keyable) => {
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

  public update = async (id: string, fields: keyable) => {
    await this.db.action.update(
      fields,
      { where: { id } },
    );
  }
}
