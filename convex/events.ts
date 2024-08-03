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

export const getEventByUUID = query({
  args: {
    id: v.id("events")
  },
  handler: async(ctx, args) => {
    const event = await ctx.db.get(args.id);

    if (!event) return null;

    return event;
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
    team: v.string(),
    exclusive: v.boolean()
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
      organiser: args.organiser,
      team: args.team,
      exclusive: args.exclusive
    });

    return event;
  },
});

export const update = mutation({
  args: {
    eventId: v.string(),
    title: v.string(),
    date: v.number(),
    description: v.string(),
    location: v.string(),
    slots: v.number(),
    image: v.optional(v.string()),
    team: v.string(),
    exclusive: v.boolean()
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const { eventId, ...rest } = args;

    const event = await ctx.db
      .query("events")
      .withIndex("by_event_id", q =>
        q.eq("eventId", eventId)
      ).collect();

    if (!event) return null;

    const convexId = event.pop()?._id;

    if (!convexId) return null;

    const updatedEvent = await ctx.db.patch(convexId, {
      ...rest
    });

    return updatedEvent;
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const existingEvent = await ctx.db.get(args.id);

    if (!existingEvent) throw new Error("Not found!");

    const parts = existingEvent.participants;
    const id = existingEvent.eventId;

    if (parts.length !== 0) {
      for (const part of parts) {
        const user = await ctx.db.query("users")
          .withIndex("by_user", q => (
            q.eq("userId", part)
          )).collect();

        const events = user[0].events.filter(event => event !== id);

        await ctx.db.patch(user[0]._id, {
          events
        });
      }
    }

    const event = await ctx.db.delete(args.id);

    return event;
  }
});

export const removeImage = mutation({
  args: { id: v.optional(v.string()) },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    if (!args.id) throw new Error("No ID provided in removeImage");

    const existingEvent = await ctx.db
      .query("events")
      .withIndex("by_event_id", q =>
        q.eq("eventId", `${args.id}`)
      ).collect();

    const convexId = existingEvent.pop()?._id;

    if (!convexId) return null;

    if (!existingEvent) throw new Error("Event not found.");

    const event = await ctx.db.patch(convexId, {
      image: undefined
    });

    return event;
  }
});

export const getEmailAddresses = query({
  args: { id: v.id("events") },
  handler: async(ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    if (!args.id || args.id === undefined) throw new Error("Event ID could not be found");

    const allUsers = await ctx.db.query("users").collect();

    const participants = allUsers.filter(user => user.events.includes(args.id));

    return participants.map(user => user.email);
  }
});