import { v4 as uuid} from 'uuid';
import { Model, Sequelize, STRING, BuildOptions, UUID, VIRTUAL, BOOLEAN, DATE, Optional, INTEGER } from 'sequelize';

export interface UserI {
  id?: string;
  firstName: string;
  lastName: string;
  name?: string;
  initials?: string;
  email: string;
  last?: Date;
  // active: boolean;
  accessToken?: string;
}
interface UserCreationAttributesI extends Optional<UserI, 'id'|'name'|'initials'|'last'|'accessToken'> {}


export class User extends Model<UserI> {
  public firstName: string;
  public lastName: string;
  public email: string;

  public id: string;
  public name: string;
  public initials: string;
  public accessToken: string;

  // constructor(firstName: string, lastName: string, email: string) {
  //   // super({ id: uuid(), firstName, lastName, email });
  //   this.firstName = firstName;
  //   this.lastName = lastName;
  //   this.email = email;
  // }
}

export type UserStatic = (typeof Model) & {
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
        const first = this.get('firstName') as string;
        const last = this.get('lastName') as string;
        if (first && last) {
          return first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase();
        }
        return '';
      },
    },
    email: STRING,
    last: DATE,
    // active: {
    //   type: new VIRTUAL(BOOLEAN),
    //   get() {
    //     const gap = new Date().getTime() - new Date(this.get('last')).getTime();
    //     return gap < 3 * 60 * 1000;
    //   },
    // },
    accessToken: STRING(2000),
  });
}
