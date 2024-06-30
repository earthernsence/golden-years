import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
    description: v.string(),
    location: v.string(),
    lead: v.string(),
    groupValue: v.string(),
    link: v.string()
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Not authenticated");

    const { lead, ...rest } = args;

    const leader = await ctx.db.query("users")
      .withIndex("by_username", q => q.eq("username", lead))
      .first();

    if (!leader) throw new Error("Leader could not be found.");

    const teams = await ctx.db.query("teams").collect();

    const team = await ctx.db.insert("teams", {
      ...rest,
      members: [leader.userId],
      teamId: `${teams.length}`,
      lead: leader.userId
    });

    // Creating a Team will auto-create a Group as well.
    const group = await ctx.db.insert("groups", {
      value: args.groupValue,
      label: args.name,
      fixed: true,
      group: "Teams"
    });

    await ctx.db.patch(leader._id, {
      groups: [...leader.groups, args.groupValue],
      team: `${teams.length}`
    });

    return { team, group };
  }
});

export const get = query({
  handler: async ctx => {
    const teams = await ctx.db.query("teams").collect();

    return teams;
  }
});

export const getTeamFromId = query({
  args: { id: v.string() },
  handler: async(ctx, args) => {
    const team = await ctx.db.query("teams")
      .withIndex("by_team_id", q => q.eq("teamId", args.id))
      .first();

    if (!team) return null;

    return team;
  }
});

export const join = mutation({
  args: {
    id: v.id("teams"),
    user: v.string(),
  },
  handler: async(ctx, args) => {
    const team = await ctx.db.get(args.id);

    const user = await ctx.db.query("users")
      .withIndex("by_user", q =>
        q.eq("userId", args.user)
      ).first();

    if (!team || !user) return null;

    const joined = await ctx.db.patch(args.id, {
      members: [...team.members, args.user]
    });

    const userGroups = new Set(user.groups);

    userGroups.add(team.groupValue);

    await ctx.db.patch(user._id, {
      team: team.teamId,
      groups: [...userGroups],
    });

    return joined;
  }
});

export const leave = mutation({
  args: {
    id: v.id("teams"),
    user: v.string()
  },
  handler: async(ctx, args) => {
    const team = await ctx.db.get(args.id);

    const user = await ctx.db.query("users")
      .withIndex("by_user", q =>
        q.eq("userId", args.user)
      ).first();

    if (!team || !user) return null;

    const left = await ctx.db.patch(args.id, {
      members: team.members.filter(member => member !== user.userId)
    });

    await ctx.db.patch(user._id, {
      team: "",
      groups: user.groups.filter(g => g !== team.groupValue)
    });

    return left;
  }
});

export const memberEmails = query({
  args: {
    teamId: v.string()
  },
  handler: async(ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    const allUsers = await ctx.db.query("users").collect();

    const members = allUsers.filter(user => user.team === args.teamId);

    return members.map(member => member.email);
  }
});