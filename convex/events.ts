import { v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async ctx => {
    const events = await ctx.db.query("events").collect();

    return events;
  }
});

export const getSpecificEvent = query({
  args: {
    id: v.string()
  },
  handler: async(ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_event_id", q =>
        q.eq("eventId", args.id)
      ).collect();

    if (!event) return null;

    return event.pop();
  }
});