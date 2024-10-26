import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async ctx => {
    const events = await ctx.db.query("articles").collect();

    return events;
  }
});

export const create = mutation({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Not authenticated!");

    const userId = identity.subject;

    const article = await ctx.db.insert("articles", {
      title: "New Article",
      date: Date.now(),
      content: "",
      published: false,
      author: userId
    });

    return article;
  }
});

export const getById = query({
  args: {
    articleId: v.id("articles")
  },
  handler: async(ctx, args) => {
    if (!args.articleId || args.articleId === undefined) {
      return null;
    }

    const article = await ctx.db.get(args.articleId);

    if (!article) return null;

    return article;
  },
});

export const update = mutation({
  args: {
    id: v.id("articles"),
    title: v.optional(v.string()),
    date: v.optional(v.number()),
    content: v.optional(v.string()),
    image: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingArticle = await ctx.db.get(id);

    if (!existingArticle) throw new Error("Article not found");

    if (existingArticle.author !== userId) throw new Error("Unauthorised");

    const article = await ctx.db.patch(id, {
      ...rest
    });

    return article;
  }
});

export const removeImage = mutation({
  args: { id: v.id("articles") },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    const userId = identity.subject;

    const existingArticle = await ctx.db.get(args.id);

    if (!existingArticle) throw new Error("not found");

    if (existingArticle.author !== userId) throw new Error("unauthorised");

    const document = await ctx.db.patch(args.id, {
      image: undefined
    });

    return document;
  }
});