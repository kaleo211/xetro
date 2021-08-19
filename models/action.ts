import { v4 as uuid} from 'uuid';
import { Model, Sequelize, STRING, BuildOptions, UUID, BelongsToSetAssociationMixin } from 'sequelize';
import { User } from './user';
import { Group } from './group';
import { Board } from './board';
import { Item } from './item';
import { ActionI } from '../types/models';

export class Action extends Model<ActionI> {
  id: string;
  title: string;
  stage: string;

  public setOwner!: BelongsToSetAssociationMixin<User, string>;
  public setGroup!: BelongsToSetAssociationMixin<Group, string>;
  public setBoard!: BelongsToSetAssociationMixin<Board, string>;
  public setItem!: BelongsToSetAssociationMixin<Item, string>;
}

export type ActionStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Action);

export function ActionFactory(sequelize: Sequelize): ActionStatic {
  return sequelize.define("Action", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: UUID,
      defaultValue: () => uuid(),
    },
    title: {
      type: STRING,
    },
    stage: {
      type: STRING,
      defaultValue: 'created',
    },
  }) as ActionStatic;
}
