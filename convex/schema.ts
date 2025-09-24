import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  feedback: defineTable({
    title: v.string(),
    description: v.string(),
    rating: v.number(), // 1-5 stars
    category: v.string(),
    status: v.string(), // "pending", "in-review", "resolved", "rejected"
    priority: v.string(), // "low", "medium", "high", "critical"
    submittedBy: v.optional(v.id("users")), // Optional for anonymous feedback
    submitterEmail: v.optional(v.string()),
    submitterName: v.optional(v.string()),
    adminNotes: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_rating", ["rating"])
    .index("by_priority", ["priority"])
    .index("by_submitter", ["submittedBy"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
