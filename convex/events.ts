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

export const addParticipant = mutation({
  args: {
    eventId: v.id("events"),
    participants: v.optional(v.array(v.object({
      name: v.string(),
      email: v.string(),
      username: v.string()
    })))
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const event = await ctx.db.patch(args.eventId, {
      participants: args.participants
    });

    return event;
  },
});