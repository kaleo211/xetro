import { v4 as uuid} from 'uuid';
import { Model, Sequelize, STRING, BuildOptions, UUID, VIRTUAL, BOOLEAN, DATE } from 'sequelize';

export class User extends Model {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  initials: string;
  email: string;
  last: Date;
  active: boolean;
  accessToken: string;
}

export type UserStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): User;
}

export function UserFactory(sequelize: Sequelize): UserStatic {
  return <UserStatic>sequelize.define("User", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: UUID,
      defaultValue: () => uuid(),
    },
    firstName: STRING,
    lastName: STRING,
    name: {
      type: new VIRTUAL(STRING),
      get() {
        return `${this.get('firstName')} ${this.get('lastName')}`;
      },
    },
    initials: {
      type: new VIRTUAL(STRING),
      get() {
        const first = this.get('firstName');
        const last = this.get('lastName');
        if (first && last) {
          return first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase();
        }
        return '';
      },
    },
    email: STRING,
    last: DATE,
    active: {
      type: new VIRTUAL(BOOLEAN),
      get() {
        const gap = new Date().getTime() - new Date(this.get('last')).getTime();
        return gap < 3 * 60 * 1000;
      },
    },
    accessToken: STRING(2000),
  })
}
