import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async ctx => {
    const articles = await ctx.db.query("articles").collect();

    return articles;
  }
});

export const getPublished = query({
  handler: async ctx => {
    const articles = await ctx.db.query("articles").collect();

    return articles.filter(article => article.published);
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
      author: userId,
      pinned: false,
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
    content: v.optional(v.string()),
    image: v.optional(v.string()),
    published: v.optional(v.boolean()),
    pinned: v.optional(v.boolean()),
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthenticated");

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingArticle = await ctx.db.get(id);

    if (!existingArticle) throw new Error("Article not found");

    if (existingArticle.author !== userId) throw new Error("Unauthorised");

    // If an article is updated or edited, it'll be set to the current date.
    const article = await ctx.db.patch(id, {
      ...rest,
      date: Date.now(),
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