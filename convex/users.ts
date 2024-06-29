import { v } from "convex/values";

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
    groups: v.array(v.string()),
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
      exec: "",
      bio: args.bio,
      location: args.location,
      image: args.image,
      groups: args.groups,
      events: []
    });

    return user;
  }
});

export const update = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    groups: v.array(v.string())
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const { userId, ...rest } = args;

    const user = await ctx.db.patch(userId, {
      ...rest
    });

    return user;
  }
});

export const updateRole = mutation({
  args: {
    userId: v.string(),
    exec: v.string(),
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const dbUser = await ctx.db
      .query("users")
      .withIndex("by_username_userid", q =>
        q.eq("userId", args.userId || "")
      ).collect();

    const isRemovingRole = args.exec === "None";

    const groups = dbUser[0].groups;

    const newGroups = isRemovingRole
      ? groups.filter(group => group !== "exec2425")
      : groups.concat("exec2425");

    const user = await ctx.db.patch(dbUser[0]._id, {
      exec: isRemovingRole ? "" : args.exec,
      groups: newGroups
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

export const getUserById = query({
  args: {
    id: v.optional(v.union(v.string(), v.id("users"))),
  },
  handler: async(ctx, args) => {
    if (!args.id || args.id === undefined) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_username_userid", q =>
        q.eq("userId", args.id || "")
      ).collect();

    if (!user) return null;

    return user.pop();
  }
});

export const updateEvents = mutation({
  args: {
    userId: v.id("users"),
    events: v.array(v.string())
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

export const updateGroups = mutation({
  args: {
    userId: v.id("users"),
    groups: v.array(v.string())
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const user = await ctx.db.patch(args.userId, {
      groups: args.groups
    });

    return user;
  }
});