// @types/express-session.d.ts
import "express-session";

// declare module "express-session" {
//   interface SessionData {
//     userId: number; // or number, depending on your user ID type
//   }
// }

declare module "express-session" {
  export interface SessionData {
    userId: { [key: number]: any };
  }
}
