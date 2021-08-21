import { v4 as uuid} from 'uuid';
import { Model, Sequelize, STRING, BuildOptions, UUID, BelongsToSetAssociationMixin } from 'sequelize';
import { User } from './user';
import { Group } from './group';
import { Board } from './board';
import { Item } from './item';
import { TaskI } from '../types/models';

export class Task extends Model<TaskI> {
  id: string;
  title: string;
  stage: string;

  public setOwner!: BelongsToSetAssociationMixin<User, string>;
  public setGroup!: BelongsToSetAssociationMixin<Group, string>;
  public setBoard!: BelongsToSetAssociationMixin<Board, string>;
  public setItem!: BelongsToSetAssociationMixin<Item, string>;
}

export type TaskStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Task);

export function TaskFactory(sequelize: Sequelize): TaskStatic {
  return sequelize.define("Task", {
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
  }) as TaskStatic;
}
