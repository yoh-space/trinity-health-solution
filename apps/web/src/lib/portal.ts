export type ConsultationStatus = "new" | "assigned" | "scheduled" | "completed";

export type ConsultationRequest = {
  id: string;
  client: string;
  type: string;
  format: "Online" | "In person";
  status: ConsultationStatus;
  created: string;
};

export const demoRequests: ConsultationRequest[] = [
  {
    id: "REQ-1046",
    client: "Selam Tesfaye",
    type: "Pregnancy & breastfeeding nutrition",
    format: "Online",
    status: "new",
    created: "Today",
  },
  {
    id: "REQ-1045",
    client: "Mekdes A.",
    type: "Family meal planning",
    format: "In person",
    status: "assigned",
    created: "Yesterday",
  },
  {
    id: "REQ-1041",
    client: "Hana K.",
    type: "Child feeding guidance",
    format: "Online",
    status: "scheduled",
    created: "Monday",
  },
];

export const statusStyles: Record<ConsultationStatus, string> = {
  new: "bg-[#fff4d9] text-[#8a641a]",
  assigned: "bg-[#e7f2e9] text-[#397047]",
  scheduled: "bg-[#e7f0f8] text-[#3b6482]",
  completed: "bg-[#eef0ee] text-[#66736a]",
};
