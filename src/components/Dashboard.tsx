import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Dashboard() {
  const stats = useQuery(api.feedback.getFeedbackStats);

  if (stats === undefined) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categoryColors = {
    bug: "bg-red-500",
    feature: "bg-blue-500",
    improvement: "bg-green-500",
    complaint: "bg-orange-500",
    compliment: "bg-purple-500",
  };

  const statusColors = {
    pending: "bg-gray-500",
    "in-review": "bg-yellow-500",
    resolved: "bg-green-500",
    rejected: "bg-red-500",
  };

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Feedback</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalFeedback}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Rating</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-green-600">{stats.averageRating}</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= Math.round(stats.averageRating) ? "text-yellow-400" : "text-gray-300"}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Items</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.statusBreakdown.pending || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback by Category</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${categoryColors[category as keyof typeof categoryColors] || "bg-gray-500"}`}></div>
                  <span className="capitalize">{category}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback by Status</h3>
          <div className="space-y-3">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${statusColors[status as keyof typeof statusColors] || "bg-gray-500"}`}></div>
                  <span className="capitalize">{status.replace("-", " ")}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback by Priority</h3>
          <div className="space-y-3">
            {Object.entries(stats.priorityBreakdown).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${priorityColors[priority as keyof typeof priorityColors] || "bg-gray-500"}`}></div>
                  <span className="capitalize">{priority}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span>{rating}</span>
                  <span className="text-yellow-400">★</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${stats.totalFeedback > 0 ? ((stats.ratingDistribution[rating] || 0) / stats.totalFeedback) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {stats.ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
