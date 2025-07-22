/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as applications from "../applications.js";
import type * as chatPermissions from "../chatPermissions.js";
import type * as comments from "../comments.js";
import type * as dashboard from "../dashboard.js";
import type * as email from "../email.js";
import type * as http from "../http.js";
import type * as interviews from "../interviews.js";
import type * as jobs from "../jobs.js";
import type * as resume from "../resume.js";
import type * as stream from "../stream.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  applications: typeof applications;
  chatPermissions: typeof chatPermissions;
  comments: typeof comments;
  dashboard: typeof dashboard;
  email: typeof email;
  http: typeof http;
  interviews: typeof interviews;
  jobs: typeof jobs;
  resume: typeof resume;
  stream: typeof stream;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
