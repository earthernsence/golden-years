import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

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
    id: v.optional(v.id("events"))
  },
  handler: async(ctx, args) => {
    if (!args.id) return null;

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
    endDate: v.number(),
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
      endDate: args.endDate,
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
    id: v.id("events"),
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

    const { id, ...rest } = args;

    const event = await ctx.db.get(id);

    if (!event) return null;

    const updatedEvent = await ctx.db.patch(id, {
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
  args: { id: v.optional(v.id("events")) },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    if (!args.id) throw new Error("No ID provided in removeImage");

    const existingEvent = await ctx.db.get(args.id);

    if (!existingEvent) throw new Error("Event not found.");

    const event = await ctx.db.patch(existingEvent._id, {
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

export const getSingleHours = query({
  args: { event: v.id("events") },
  handler: async(ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    const event = await ctx.db.get(args.event);

    if (!event) return 0;

    return (
      ((new Date(event.endDate || new Date())).getTime() -
      (new Date(event.date).getTime())) / 3600000
    );
  }
});

export const getTotalHours = query({
  args: { events: v.array(v.id("events")) },
  handler: async(ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    if (args.events.length === 0) return 0;

    const events: Doc<"events">[] = [];

    for (const event of args.events) {
      const e = await ctx.db.get(event);

      if (e) events.push(e);
    }

    if (events.length === 0) return 0;

    const datedEvents = events.map(event => ({
      endDate: new Date(event.endDate || new Date()).getTime(),
      date: new Date(event.date).getTime()
    }));

    const eventsToHours = datedEvents.map(event => (event.endDate - event.date) / 3600000);

    return eventsToHours.reduce((prev, curr) => prev + curr);
  }
});