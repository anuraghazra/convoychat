import { StringSchema } from 'yup'

declare module 'yup' {
  interface StringSchema {
    objectId(this: any, ...args: any): any
  }
}
