import { Item } from "../models/item";
import { keyable } from "../utils/tool";
import { Database } from "../models";

export interface ItemServiceI {
  create(title:string, ownerID:string, groupID:string, pillarID:string): Promise<Item>,
  remove(id:string): Promise<void>,
  findAll(): Promise<Item[]>,
  findOne(whereCL:keyable): Promise<Item>,
  update(id:string, fields:keyable): Promise<void>,
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
        {
          model: this.db.user,
          as: 'facilitator',
        },
        {
          model: this.db.group,
          as: 'group',
        }
      ],
    });
    return items;
  }

  public findOne = async (whereCl: keyable) => {
    const item = await this.db.item.findOne({
      include: [
        {
          model: this.db.user,
          as: 'owner',
        },
        {
          model: this.db.group,
          as: 'group',
        },
        {
          model: this.db.pillar,
          as: 'pillar',
        },
        {
          model: this.db.action,
          as: 'actions',
        },
      ],
      where: whereCl,
    });

    return item;
  }

  public update = async (id: string, fields: keyable) => {
    await this.db.item.update(
      fields,
      { where: { id } },
    );
  }
}

