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

export interface TaskI {
  id?: string;
  title: string;
  stage?: string;

  createdAt?: string;

  itemID?: string;
  ownerID?: string;
  owner?: UserI;
  boardID?: string;
  groupID?: string;
}

export interface BoardI {
  id?: string;
  name: string;
  stage: string;
  chat: string;
  locked: boolean;
  timer: number;

  pillars?: PillarI[];
}

export interface GroupI {
  id?: string;
  name: string;

  tasks?: TaskI[];
  members?: UserI[];
  facilitatorID?: string;
  boards?: BoardI[];
}

export interface ItemI {
  id?: string;
  title: string;
  likes?: number;
  stage?: string;
  end?: Date;

  tasks?: TaskI[];
  pillarID?: string;
  boardID?: string;
  groupID?: string;
}

export interface PillarI {
  id?: string;
  title: string;
  position?: number;

  boardID?: string;
  items?: ItemI[];
}
