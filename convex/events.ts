import { v } from "convex/values";

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
    participants: v.optional(v.array(v.string()))
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

export const create = mutation({
  args: {
    title: v.string(),
    date: v.number(),
    description: v.string(),
    image: v.optional(v.string()),
    location: v.string(),
    slots: v.number(),
    organiser: v.string(),
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const events = await ctx.db.query("events").collect();

    const event = await ctx.db.insert("events", {
      eventId: `${events.length}`,
      title: args.title,
      date: args.date,
      description: args.description,
      image: args.image || "",
      location: args.location,
      slots: args.slots,
      participants: [],
      organiser: args.organiser
    });

    return event;
  },
});