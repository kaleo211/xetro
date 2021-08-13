import { Database } from "../models/index";
import { Action } from "../models/action";
import { Board } from "../models/board";
import { Group } from "../models/group";
import { Item } from "../models/item";
import { Pillar } from "../models/pillar";
import { User } from "../models/user";
import { keyable } from "../utils/tool";
import { PillarServiceI } from "./pillar";


const includes = [
  {
    model: Group,
    as: 'group',
  },
  {
    model: Pillar,
    as: 'pillars',
    include: [
      {
        model: Item,
        as: 'items',
        include: [
          {
            model: Action,
            as: 'actions',
            include: [
              {
                model: User,
                as: 'owner',
              }
            ],
          }
        ],
      }
    ],
  },
];

export interface BoardServiceI {
  create(name:string, groupID:string): Promise<Board>,
  findAll(whereCl:keyable): Promise<Board[]>,
  findOne(whereCl:keyable): Promise<Board>,
  update(id:string, fields:keyable): Promise<void>,
}

export class BoardService implements BoardServiceI {
  pillarService: PillarServiceI;
  db: Database;

  constructor(database: Database, pillarService: PillarServiceI) {
    this.pillarService = pillarService;
    this.db = database;
  }

  public create = async (name: string, groupID: string) => {
    if (name == '') {}

    const [newBoard, created] = await this.db.board.findOrCreate({
      where: {
        groupID,
        stage: 'created',
      },
      defaults: {
        name,
        stage: 'created',
      },
    });
    await newBoard.setGroup(groupID);

    console.info(created ? 'created new' : 'found existing', newBoard.name);
    if (created) {
      await this.pillarService.create(':D', newBoard.id);
      await this.pillarService.create(':|', newBoard.id);
      await this.pillarService.create(':(', newBoard.id);
    }

    return newBoard;
  };

  public findAll = async (whereCl: keyable) => {
    const boards = await this.db.board.findAll({
      include: [{
        model: Group,
        as: 'group',
      }],
      where: whereCl,
    });

    return boards;
  }

  public findOne = async (whereCl: keyable) => {
    const board = await this.db.board.findOne({
      include: includes,
      order: [
        [{ model: Pillar, as: 'pillars' }, 'position', 'ASC'],
        [{ model: Pillar, as: 'pillars' }, { model: Item, as: 'items' }, 'likes', 'DESC'],
        [{ model: Pillar, as: 'pillars' }, { model: Item, as: 'items' }, 'createdAt', 'ASC'],
        [{ model: Pillar, as: 'pillars' }, { model: Item, as: 'items' }, { model: Action, as: 'actions' }, 'createdAt', 'ASC'],
      ],
      where: whereCl,
    });

    return board;
  }

  public update = async (id: string, fields: keyable) => {
    await this.db.board.update(
      fields,
      { where: { id } },
    );
  }
}
