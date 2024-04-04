import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    username: v.string(),
    signupTime: v.string(),
    admin: v.boolean(),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    image: v.optional(v.string()),
    groups: v.optional(v.array(v.string())),
    events: v.optional(v.array(v.object({
      date: v.string(),
      title: v.string(),
      location: v.string(),
      description: v.string(),
      image: v.optional(v.string())
    })))
  })
    .index("by_user", ["userId"])
});