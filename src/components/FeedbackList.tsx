import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function FeedbackList() {
  const feedback = useQuery(api.feedback.getFeedback, { limit: 50 });
  const updateFeedbackStatus = useMutation(api.feedback.updateFeedbackStatus);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const categories = [
    { value: "bug", label: "Bug Report", color: "bg-red-100 text-red-800" },
    { value: "feature", label: "Feature Request", color: "bg-blue-100 text-blue-800" },
    { value: "improvement", label: "Improvement", color: "bg-green-100 text-green-800" },
    { value: "complaint", label: "Complaint", color: "bg-orange-100 text-orange-800" },
    { value: "compliment", label: "Compliment", color: "bg-purple-100 text-purple-800" },
  ];

  const statuses = [
    { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-800" },
    { value: "in-review", label: "In Review", color: "bg-yellow-100 text-yellow-800" },
    { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" },
  ];

  const handleStatusUpdate = async (feedbackId: string, newStatus: string) => {
    try {
      await updateFeedbackStatus({
        feedbackId: feedbackId as any,
        status: newStatus,
      });
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const stat = statuses.find((s) => s.value === status);
    return stat?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const prio = priorities.find((p) => p.value === priority);
    return prio?.color || "bg-gray-100 text-gray-800";
  };

  if (feedback === undefined) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feedback List */}
      <div className="space-y-4">
        {feedback.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <p className="text-gray-500">No feedback found.</p>
          </div>
        ) : (
          feedback.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {categories.find((c) => c.value === item.category)?.label || item.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {statuses.find((s) => s.value === item.status)?.label || item.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {priorities.find((p) => p.value === item.priority)?.label || item.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= item.rating ? "text-yellow-400" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span>({item.rating}/5)</span>
                  </div>
                </div>
                {loggedInUser && (
                  <div className="ml-4">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-review">In Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 mb-4">{item.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By: {item.submitterName}</span>
                <span>{new Date(item._creationTime).toLocaleDateString()}</span>
              </div>
              
              {item.adminNotes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Admin Notes:</strong> {item.adminNotes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
