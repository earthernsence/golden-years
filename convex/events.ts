import { v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async ctx => {
    const events = await ctx.db.query("events").collect();

    return events;
  }
});