import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { migrationsTable } from "convex-helpers/server/migrations";

export default defineSchema({
  migrations: migrationsTable,
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    username: v.string(),
    signupTime: v.number(),
    admin: v.boolean(),
    exec: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    image: v.optional(v.string()),
    groups: v.array(v.string()),
    events: v.array(v.union(v.string(), v.id("events"))),
    team: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_username", ["username"])
    .index("by_username_userid", ["userId", "username"]),
  events: defineTable({
    eventId: v.string(),
    title: v.string(),
    date: v.number(),
    description: v.string(),
    image: v.optional(v.string()),
    location: v.string(),
    slots: v.number(),
    participants: v.array(v.string()),
    organiser: v.string(),
    team: v.optional(v.string()),
    exclusive: v.optional(v.boolean())
  })
    .index("by_event_id", ["eventId"])
    .index("by_date", ["date"]),
  groups: defineTable({
    value: v.string(),
    label: v.string(),
    disable: v.optional(v.boolean()),
    fixed: v.optional(v.boolean()),
    group: v.string(),
    isTeamGroup: v.optional(v.boolean()),
  })
    .index("by_value", ["value"])
    .index("by_fixed", ["fixed"]),
  teams: defineTable({
    teamId: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    description: v.string(),
    location: v.string(),
    lead: v.string(),
    groupValue: v.string(),
    link: v.string(),
    members: v.array(v.string())
  })
    .index("by_team_id", ["teamId"])
});