https://www.youtube.com/watch?v=bMYZSi_LZ2w&ab_channel=CodinginFlow

VERCEL SETUP

Go to storage, and Create Database - Postgres

Select name and region

Quickstart -> Prisma 

    Added to schema.prisma

    datasource db {
    provider = "postgresql"
    url = env("POSTGRES_PRISMA_URL") // uses connection pooling
    directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection
    }


Next the need the env variables -> .env.local
# prisma can't read from .env.local file, so it has to be a normal .env file

    Copy variables snippet and paste to .env


AUTH.JS

https://authjs.dev/getting-started -> Next.js for installation

1) Generate AUTH_SECRET env variable
    AUTH_SECRET for our env file - automatically generated with npx auth secret

2) Next we need to set up an auth.ts file, which we will place in our src folder - copy snippet from auth docs

3) Next we need a route handler - with the specific folder structure

4) Create middleware(optional) - 
    //adding the middleware, insures that users aren't automatically logged out after 30 days // jf. auth.js documentation 
    With the middleware, if users has been at the page within this 30 days, no need to log in after session expiration

    create middleware.ts and copy code from docs - This has to be named middleware.ts explicitly for it to work
        This file connects to our auth.ts file

    There was issues with a library on built, so the middleware is outcommented by adding _middleware.ts, so we no longer run by the middleware

CONNECTING TO DATABASE

    We are using Prisma , https://authjs.dev/getting-started/adapters/prisma 

    So we need to add Prisma adapter to auth.ts

    //Docs

        import NextAuth from "next-auth"
        import { PrismaAdapter } from "@auth/prisma-adapter"
        import { PrismaClient } from "@prisma/client"
        
        const prisma = new PrismaClient()
        
        export const { handlers, auth, signIn, signOut } = NextAuth({
        adapter: PrismaAdapter(prisma),
        providers: [],
        })
    
    We will put our prisma client into a separate file in the lib folder (best practise), so that we can reuse it throughout our app, when we want to make db operations to update a user for example

    See prisma.ts in lib folder - Code copied from https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices of db.ts file example

    All this code is required because:

    
    //this code ensures that we reuse the same/previous prisma client when adding changes to or project, instead of generating a new prisma client for every change

    // TODO/ADDITION: make this edge-compatible: by default prisma doesn't work on edge - to run on auth by middleware we need it to be edge compatible ?? see more https://authjs.dev/getting-started/adapters/prisma - Edge Compatibility

    //so we declare the const neon and const adapter and assign and import to Pool and PrismaNeon, 
    To the new Pool, we pass a connectionString from .env
    To the adapter of PrismaNeon we pass the neon object
    and at last we pass the adapter object to our PrismaClient, and now it will work inside our middleware 


DATABASE SCHEMA

    We want to add models to our schema.prisma to generate tables for our db. - // All the models are copied from schema example https://authjs.dev/getting-started/adapters/prisma under PostgreSQL

    We rename our tables using the @@map function 

    We use Session instead of JWT: 


        //Session: 
        + centralized control (easy revocation) 
        - performance overhead (DB request for every page access)

        //JWT: 
        + self-contained (requires fewer DB requests) 
        - Can't be revoked, so you need to refresh token mechanism, for instance if you ban a user, or user changes password, you can't destroy their current sessions, so if they are logged in with JWT, they will be able to log in in a certain amount of time, even if they are banned, or password has been changed - you can't force them to log out - this can be worked around, with a very short token expiration, and automatic regeneration of token of expiration, but the refresh mechanism has to be implented by your self


    We make a few modifications to the tables snippet from docs by removing the optional Authenticator settings


    Then we want to push our schema to the database by running npx prisma db push

    //when we go to our vercel db - storage, and click the browse input we see our different tables has been created, - sessions, users ect.

    Lastly for the setup we need to connect our auth.ts with the prisma adapter

        We have set up the prisma client, and then in auth.ts we add (and import) adapter: PrismaAdapter to which we pass our prisma client which we import from our lib folder, and now our next auth is connected to our database


AUTHENTICATION PROVIDERS

Google: 

    create project
    In API & Services,

        OAuth consent screen
            Scopes
                add: auth/userinfo.email & .profile

            Testusers: no need
        
        Credentials:

            OAuth client


We end up with client side authentication
For server side authentication see video tutorial

    using getSession for await auth() - instead of calling await auth() for several pages, the getSession does it in one single request for several pages
    
    using <form> for server components instead of Button component
    and more

    Benefits of server and client authentication see 1:17:00 in video

    static rendering of cached pages instead of dymanic rendering ect.

    Check Partial PreRendering  - new Next.js feature