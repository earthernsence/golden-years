import { v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    username: v.string(),
    signupTime: v.number(),
    admin: v.boolean(),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    image: v.optional(v.string()),
    groups: v.optional(v.array(v.string())),
    events: v.optional(v.array(v.object({
      eventId: v.string(),
      title: v.string(),
      date: v.number(),
      description: v.string(),
      image: v.optional(v.string()),
      location: v.string(),
      participants: v.optional(v.array(v.object({
        name: v.string(),
        email: v.string(),
        username: v.string()
      }))),
      organiser: v.object({
        name: v.string(),
        email: v.string(),
        username: v.string()
      })
    })))
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const user = await ctx.db.insert("users", {
      userId,
      name: args.name,
      email: args.email,
      username: args.username,
      signupTime: args.signupTime,
      admin: args.admin,
      bio: args.bio,
      location: args.location,
      image: args.image,
      groups: args.groups,
      events: args.events
    });

    return user;
  }
});

export const usernames = query({
  handler: async ctx => {
    const users = await ctx.db.query("users").collect();

    return users.map(user => user.username);
  }
});

export const getUser = query({
  args: {
    username: v.string()
  },
  handler: async(ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", q =>
        q.eq("username", args.username)
      ).collect();

    if (!user) return null;

    return user.pop();
  }
});

export const updateEvents = mutation({
  args: {
    userId: v.id("users"),
    events: v.optional(v.array(v.object({
      eventId: v.string(),
      title: v.string(),
      date: v.number(),
      description: v.string(),
      image: v.optional(v.string()),
      location: v.string(),
      participants: v.optional(v.array(v.object({
        name: v.string(),
        email: v.string(),
        username: v.string()
      }))),
      organiser: v.object({
        name: v.string(),
        email: v.string(),
        username: v.string()
      })
    })))
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const user = await ctx.db.patch(args.userId, {
      events: args.events
    });

    return user;
  }
});