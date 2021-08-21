import { Database } from "../models/index";
import { Task } from "../models/task";
import { Keyable } from "../types/common";

export interface TaskServiceI {
  create(title:string, ownerID:string, groupID:string, boardID:string, itemID:string): Promise<Task>,
  remove(id:string): Promise<void>,
  findAll(whereCl:Keyable): Promise<Task[]>,
  findOne(whereCl:Keyable): Promise<Task>,
  update(id:string, fields:Keyable): Promise<void>,
}

export class TaskService implements TaskServiceI {
  db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  public create = async (title: string, ownerID: string, groupID: string, boardID: string, itemID: string) => {
    const newTask = await this.db.task.create({title});

    await newTask.setOwner(ownerID);
    await newTask.setGroup(groupID);
    await newTask.setBoard(boardID);
    await newTask.setItem(itemID);

    return newTask;
  };

  public remove = async (id: string) => {
    await this.db.task.destroy({
      where: { id },
    });
  }

  public findAll = async (whereCl: Keyable) => {
    const tasks = await this.db.task.findAll({
      include: [
        { model: this.db.user, as: 'owner' },
        { model: this.db.group, as: 'group' },
        { model: this.db.item, as: 'item' },
      ],
      where: whereCl,
      order: [['createdAt', 'DESC']],
    });

    return tasks;
  }

  public findOne = async (whereCl: Keyable) => {
    const task = await this.db.task.findOne({
      include: [
        { model: this.db.user, as: 'owner' },
        { model: this.db.group, as: 'group' },
        { model: this.db.item, as: 'item' },
      ],
      where: whereCl,
    });

    return task;
  }

  public update = async (id: string, fields: Keyable) => {
    await this.db.task.update(
      fields,
      { where: { id } },
    );
  }
}
