import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
    events: v.array(v.string())
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
    organiser: v.string()
  })
    .index("by_event_id", ["eventId"])
    .index("by_date", ["date"]),
  groups: defineTable({
    value: v.string(),
    label: v.string(),
    disable: v.optional(v.boolean()),
    fixed: v.optional(v.boolean()),
    group: v.string(),
  })
    .index("by_value", ["value"])
    .index("by_fixed", ["fixed"])
});