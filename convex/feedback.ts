import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitFeedback = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    rating: v.number(),
    category: v.string(),
    submitterEmail: v.optional(v.string()),
    submitterName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    return await ctx.db.insert("feedback", {
      title: args.title,
      description: args.description,
      rating: args.rating,
      category: args.category,
      status: "pending",
      priority: "medium",
      submittedBy: userId || undefined,
      submitterEmail: args.submitterEmail,
      submitterName: args.submitterName,
    });
  },
});

export const getFeedback = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const feedback = await ctx.db
      .query("feedback")
      .order("desc")
      .take(args.limit || 50);

    return Promise.all(
      feedback.map(async (item) => {
        let submitterName = item.submitterName || "Anonymous";
        if (item.submittedBy) {
          const user = await ctx.db.get(item.submittedBy);
          if (user) {
            submitterName = user.name || user.email || "User";
          }
        }
        return {
          ...item,
          submitterName,
        };
      })
    );
  },
});

export const updateFeedbackStatus = mutation({
  args: {
    feedbackId: v.id("feedback"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to update feedback");
    }

    await ctx.db.patch(args.feedbackId, {
      status: args.status,
    });
  },
});

export const getFeedbackStats = query({
  args: {},
  handler: async (ctx) => {
    const allFeedback = await ctx.db.query("feedback").collect();
    
    const totalFeedback = allFeedback.length;
    const averageRating = totalFeedback > 0 
      ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback 
      : 0;

    const categoryBreakdown = allFeedback.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusBreakdown = allFeedback.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityBreakdown = allFeedback.reduce((acc, f) => {
      acc[f.priority] = (acc[f.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ratingDistribution = allFeedback.reduce((acc, f) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalFeedback,
      averageRating: Math.round(averageRating * 100) / 100,
      categoryBreakdown,
      statusBreakdown,
      priorityBreakdown,
      ratingDistribution,
    };
  },
});
