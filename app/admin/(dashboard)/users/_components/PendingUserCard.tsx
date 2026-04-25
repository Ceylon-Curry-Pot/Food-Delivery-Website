"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // If you have sonner, else window.alert

function formatDistance(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function PendingUserCard({ user }: { user: any }) {
  const router = useRouter();
  const [isRejecting, setIsRejecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true })
      });
      if (!res.ok) throw new Error("Approval failed");
      
      toast.success(`${user.name} approved. They can now access the staff portal.`);
      setHidden(true);
      router.refresh(); // Update the counts everywhere
    } catch (err) {
      toast.error("Failed to approve user.");
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Rejection failed");

      toast.success(`Request from ${user.name} has been rejected.`);
      setHidden(true);
      router.refresh();
    } catch (err) {
      toast.error("Failed to reject user.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center transition hover:shadow-md">
      <div>
        <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
        <p className="text-gray-600 text-sm mt-0.5">{user.email}</p>
        <p className="text-gray-400 text-xs mt-1">Requested {formatDistance(user.requestedAt)}</p>
      </div>

      <div className="flex items-center gap-3">
        {isRejecting ? (
          <div className="flex items-center gap-3 bg-red-50 p-2 rounded-lg border border-red-100">
            <span className="text-sm font-medium text-red-800 ml-2">Are you sure?</span>
            <button 
              onClick={handleReject} 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-50"
            >
              Yes, Reject
            </button>
            <button 
              onClick={() => setIsRejecting(false)} 
              disabled={loading}
              className="text-gray-600 hover:bg-gray-200 bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => setIsRejecting(true)}
              disabled={loading} 
              className="bg-white border border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-600 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <X size={16} /> Reject
            </button>
            <button 
              onClick={handleApprove}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Check size={16} /> Approve
            </button>
          </>
        )}
      </div>
    </div>
  );
}
