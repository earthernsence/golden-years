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
  })
    .index("by_user", ["userId"])
});