import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    type: v.union(
      v.literal("all"),
      v.literal("fixed"),
      v.literal("form"),
    )
  },
  handler: async(ctx, args) => {
    const groups = await ctx.db.query("groups").collect();

    if (args.type === "fixed") {
      return groups.filter(group => group.fixed);
    }

    if (args.type === "form") {
      return groups.filter(group => !group.fixed);
    }

    return groups;
  }
});

export const create = mutation({
  args: {
    value: v.string(),
    label: v.string(),
    disable: v.optional(v.boolean()),
    fixed: v.optional(v.boolean()),
    group: v.string()
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Not authenticated");

    const group = await ctx.db.insert("groups", {
      ...args
    });

    return group;
  }
});

// In the database, groups are stored as these "values". We turn the values into the group option
// here so that they appear in the form.
export const transform = query({
  args: {
    groups: v.array(v.string())
  },
  handler: async(ctx, args) => {
    const groups = await ctx.db.query("groups").collect();

    const transformed = [];

    for (const group of args.groups) {
      const groupInfo = groups.find(g => g.value === group);
      if (groupInfo) transformed.push(groupInfo);
    }

    return transformed;
  }
});