"use client";

interface StatCardsProps {
  stats: {
    activeOrders: number;
    preparing: number;
    outForDelivery: number;
    completedToday: number;
  };
}

export default function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      label: "Active Orders",
      value: stats.activeOrders,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      label: "Preparing",
      value: stats.preparing,
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
    {
      label: "Out for Delivery",
      value: stats.outForDelivery,
      color: "orange",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
    },
    {
      label: "Completed Today",
      value: stats.completedToday,
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`rounded-xl border p-4 flex flex-col justify-between ${card.bgColor} ${card.borderColor}`}
        >
          <span className={`text-sm font-medium ${card.textColor}`}>{card.label}</span>
          <span className={`font-bold text-2xl ${card.textColor}`}>{card.value}</span>
        </div>
      ))}
    </div>
  );
}
