"use client";

import { Calendar, Clock, Video, MapPin, Stethoscope, HeartHandshake, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

export interface AppointmentItem {
  _id: string;
  requestId: string;
  requestType: "clinical" | "counselling";
  staffName: string;
  scheduledAt: number;
  durationMinutes: number;
  format: "online" | "inPerson";
}

export function AdminAppointments({
  appointments,
}: {
  appointments: AppointmentItem[];
}) {
  return (
    <Card>
      <CardHeader className="border-b border-[#eef2ea] pb-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Upcoming Consultations & Appointments</CardTitle>
            <CardDescription>
              Scheduled tele-health sessions and in-person community center consultations
            </CardDescription>
          </div>
          <Badge variant="info">{appointments.length} Scheduled</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eef2ea] bg-[#f9faf7] text-[11px] font-bold uppercase tracking-wider text-[#687d6f]">
              <tr>
                <th className="px-6 py-3.5">Scheduled Date & Time</th>
                <th className="px-6 py-3.5">Session Format</th>
                <th className="px-6 py-3.5">Service Type</th>
                <th className="px-6 py-3.5">Assigned Staff</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4ee]">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#718476]">
                    No upcoming appointments scheduled at this moment.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => {
                  const dateObj = new Date(appt.scheduledAt);
                  return (
                    <tr key={appt._id} className="transition hover:bg-[#f6f9f5]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5 font-medium text-[#1a3a27]">
                          <Calendar size={14} className="text-[#1c573e]" />
                          <span>
                            {dateObj.toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            at{" "}
                            {dateObj.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 font-semibold text-[#486050]">
                          {appt.format === "online" ? (
                            <>
                              <Video size={14} className="text-[#3b82f6]" />
                              <span>Online Tele-Consult</span>
                            </>
                          ) : (
                            <>
                              <MapPin size={14} className="text-[#b45d34]" />
                              <span>In-Person Clinic</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            appt.requestType === "clinical"
                              ? "bg-[#e5eddf] text-[#1c573e]"
                              : "bg-[#faeee5] text-[#b45d34]"
                          }`}
                        >
                          {appt.requestType === "clinical" ? (
                            <Stethoscope size={12} />
                          ) : (
                            <HeartHandshake size={12} />
                          )}
                          <span>
                            {appt.requestType === "clinical" ? "Clinical" : "Counselling"}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#1f422e]">
                        {appt.staffName}
                      </td>
                      <td className="px-6 py-4 text-[#607466]">
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          <span>{appt.durationMinutes} minutes</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant="success">Confirmed</Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
