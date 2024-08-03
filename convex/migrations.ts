import { makeMigration } from "convex-helpers/server/migrations";

import { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";

export const migration = makeMigration(internalMutation, {
  migrationTable: "migrations",
});

export const eventIdsToUUID = migration({
  table: "users",
  migrateOne: async(ctx, doc) => {
    if (doc.events.length === 0) return;

    const newEvents: Array<Id<"events">> = [];

    for (const id of doc.events) {
      const event = await ctx.db
        .query("events")
        .withIndex("by_event_id", q => q.eq("eventId", id))
        .first();

      if (!event) throw new Error(`Event with ID ${id} not found!`);

      newEvents.push(event._id);
    }

    await ctx.db.patch(doc._id, {
      events: newEvents
    });
  }
});