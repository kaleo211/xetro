import { v4 as uuid} from 'uuid';
import { Model, Sequelize, STRING, BuildOptions, UUID, BelongsToManyAddAssociationMixin } from 'sequelize';
import { User } from './user';

export class Group extends Model {
  id: string;
  name: string;

  public addMembers!: BelongsToManyAddAssociationMixin<User, string>;
  public setFacilitator!: BelongsToManyAddAssociationMixin<User, string>;
}

export type GroupStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Group);

export function GroupFactory(sequelize: Sequelize): GroupStatic {
  return sequelize.define("Group", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: UUID,
      defaultValue: () => uuid(),
    },
    name: STRING,
  }) as GroupStatic;
}
