import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
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
    slots: v.optional(v.number()),
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
  })
    .index("by_event_id", ["eventId"])
    .index("by_date", ["date"])
});