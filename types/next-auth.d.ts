import { DefaultSession } from "next-auth";

//the next-auth.d.ts, socalled typescript declaration files, we make to handle other attributes then the default attributes provided by auth.js
//in this case 'role', which we added to or user model/table, in order for typescript to recognize it as string or null if no role

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role: String | null;
  }
}
