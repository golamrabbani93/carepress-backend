import { TRole } from './user.interface'

export const Role: TRole[] = ['ADMIN', 'USER']

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const
