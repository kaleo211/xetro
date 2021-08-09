import { Item } from "models/item";
import { keyable } from "utils/tool";
import { Database } from "../models";
import { Action } from "../models/action";
import { Group } from "../models/group";
import { Pillar } from "../models/pillar";
import { User } from "../models/user";

const includes = [
  {
    model: User,
    as: 'owner',
  },
  {
    model: Group,
    as: 'group',
  },
  {
    model: Pillar,
    as: 'pillar',
  },
  {
    model: Action,
    as: 'actions',
  },
];

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
          model: User,
          as: 'facilitator',
        },
        {
          model: Group,
          as: 'group',
        }
      ],
    });
    return items;
  }

  public findOne = async (whereCl: keyable) => {
    const item = await this.db.item.findOne({
      include: includes,
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

