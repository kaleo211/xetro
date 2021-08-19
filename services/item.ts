import { Item } from "../models/item";
import { Keyable } from "../types/common";
import { Database } from "../models";

export interface ItemServiceI {
  create(title:string, ownerID:string, groupID:string, pillarID:string): Promise<Item>,
  remove(id:string): Promise<void>,
  findAll(): Promise<Item[]>,
  findOne(whereCL:Keyable): Promise<Item>,
  update(id:string, fields:Keyable): Promise<void>,
};

export class ItemService implements ItemServiceI {
  db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  public create = async (title: string, ownerID: string, groupID: string, pillarID: string) => {
    const newItem = await this.db.item.create({title});

    await newItem.setOwner(ownerID);
    await newItem.setPillar(pillarID);
    await newItem.setGroup(groupID);

    return newItem;
  };

  public remove = async (id: string) => {
    await this.db.item.destroy({
      where: { id },
    });
  };

  public findAll = async () => {
    const items = await this.db.item.findAll({
      include: [
        { model: this.db.user, as: 'facilitator' },
        { model: this.db.group, as: 'group' },
      ],
    });
    return items;
  }

  public findOne = async (whereCl: Keyable) => {
    const item = await this.db.item.findOne({
      include: [
        { model: this.db.user, as: 'owner' },
        { model: this.db.group, as: 'group' },
        { model: this.db.pillar, as: 'pillar' },
        { model: this.db.action, as: 'actions' },
      ],
      where: whereCl,
    });

    return item;
  }

  public update = async (id: string, fields: Keyable) => {
    await this.db.item.update(
      fields,
      { where: { id } },
    );
  }
}

