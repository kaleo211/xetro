export interface IConfig {
  dell: IDellConfig
  database: IDatabaseConfig
  app: IAppConfig
}

export interface IDellConfig {
  clientID: string
  clientSecret: string
  userinfo: string
  authDomain: string
}

export interface IDatabaseConfig {
  username: string
  password: string
  database: string
  host: string
  port: number
  dialect: string
  logging?: boolean
}

export interface IAppConfig {
  address: string
  sessionSecret: string
}
