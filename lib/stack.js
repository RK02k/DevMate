// lib/stack.js
import { createStackServerApp } from "@stackframe/stack";

export const stackServerApp = createStackServerApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  secret: process.env.STACK_SECRET_SERVER_KEY,
});
