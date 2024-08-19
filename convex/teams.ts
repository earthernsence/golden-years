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
    link: v.string(),
    slots: v.number(),
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
      teamId: `${teams.length + 1}`,
      lead: leader.userId
    });

    // Creating a Team will auto-create a Group as well.
    const group = await ctx.db.insert("groups", {
      value: args.groupValue,
      label: args.name,
      fixed: true,
      group: "Teams",
      isTeamGroup: true,
    });

    await ctx.db.patch(leader._id, {
      groups: [...leader.groups, args.groupValue],
      team: `${teams.length + 1}`
    });

    return { team, group };
  }
});

export const update = mutation({
  args: {
    teamId: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    description: v.string(),
    location: v.string(),
    lead: v.string(),
    groupValue: v.string(),
    link: v.string(),
    slots: v.number(),
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const { teamId, lead, ...rest } = args;

    const team = await ctx.db
      .query("teams")
      .withIndex("by_team_id", q => q.eq("teamId", teamId))
      .first();

    const group = await ctx.db
      .query("groups")
      .withIndex("by_value", q => q.eq("value", args.groupValue))
      .first();

    const leader = await ctx.db
      .query("users")
      .withIndex("by_username", q => q.eq("username", lead))
      .first();

    if (!team || !group || !leader) return null;

    const members = new Set(team.members);

    members.add(leader.userId);

    const updatedTeam = await ctx.db.patch(team._id, {
      ...rest,
      lead: leader.userId,
      members: [...members],
    });

    const updatedGroup = await ctx.db.patch(group._id, {
      label: args.name
    });

    const updatedLeader = await ctx.db.patch(leader._id, {
      team: team.teamId
    });

    return { updatedTeam, updatedGroup, updatedLeader };
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
    if (args.id === "-1") return null;

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

    const events = await ctx.db.query("events").collect();

    if (!team || !user || !events) return null;

    const left = await ctx.db.patch(args.id, {
      members: team.members.filter(member => member !== user.userId)
    });

    const userEvents = events.filter(e => user.events.includes(e._id));

    // We won't remove users from their past events, but any future events they signed up for that are exclusive
    // to the team they're leaving we will remove them from.
    const exclusiveEvents = userEvents.filter(e => e.date > Date.now())
      .filter(e => e.team === team.teamId)
      .filter(e => e.exclusive);

    const newUser = await ctx.db.patch(user._id, {
      team: "",
      events: userEvents.filter(e =>
        !exclusiveEvents.map(event => event._id).includes(e._id)
      ).map(e => e._id),
      groups: user.groups.filter(g => g !== team.groupValue)
    });

    for (const event of exclusiveEvents) {
      await ctx.db.patch(event._id, {
        participants: event.participants.filter(u => u !== user.userId)
      });
    }

    return { left, newUser };
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

export const removeImage = mutation({
  args: { id: v.optional(v.string()) },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    if (!args.id) throw new Error("No ID provided in removeImage");

    const existingTeam = await ctx.db
      .query("teams")
      .withIndex("by_team_id", q => q.eq("teamId", `${args.id}`))
      .first();

    if (!existingTeam) return null;

    const team = await ctx.db.patch(existingTeam._id, {
      image: undefined
    });

    return team;
  }
});