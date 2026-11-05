"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Stethoscope,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { AppointmentDayCalendar } from "@/components/appointments/AppointmentDayCalendar";

export interface AppointmentItem {
  _id: string;
  requestId: string;
  requestType: "clinical" | "counselling";
  staffName: string;
  scheduledAt: number;
  durationMinutes: number;
  format: "online" | "inPerson";
  status?: "scheduled" | "completed" | "cancelled";
}

export function AdminAppointments({
  appointments,
}: {
  appointments: AppointmentItem[];
}) {
  const updateAppointmentStatus = useMutation(anyApi.appointments.updateAppointmentStatus);
  const [feedback, setFeedback] = useState<{ text: string; error?: boolean } | null>(null);

  function notify(text: string, error = false) {
    setFeedback({ text, error });
    setTimeout(() => setFeedback(null), 4000);
  }

  async function handleStatusChange(appointmentId: string, status: "completed" | "cancelled") {
    try {
      await updateAppointmentStatus({
        appointmentId: appointmentId as any,
        status,
      });
      notify(`Session successfully marked as ${status}.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to update session.", true);
    }
  }

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
          <Badge variant="info">{appointments.length} Consultations</Badge>
        </div>

        {feedback && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold ${
              feedback.error
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {feedback.error ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
            <span>{feedback.text}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-5 pb-0">
        <AppointmentDayCalendar
          appointments={appointments}
          onComplete={(appointmentId) => handleStatusChange(appointmentId, "completed")}
          onCancel={(appointmentId) => handleStatusChange(appointmentId, "cancelled")}
        />
      </CardContent>

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
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4ee]">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#718476]">
                    No upcoming appointments scheduled at this moment.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => {
                  const dateObj = new Date(appt.scheduledAt);
                  const isFuture = appt.scheduledAt > Date.now();
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
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            appt.status === "completed"
                              ? "success"
                              : appt.status === "cancelled"
                                ? "destructive"
                                : "info"
                          }
                        >
                          {appt.status || "Scheduled"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(appt._id, "completed")}
                            title="Mark Session Completed"
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition"
                          >
                            <CheckCircle2 size={12} />
                            <span>Complete</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(appt._id, "cancelled")}
                            title="Cancel Session"
                            className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 transition"
                          >
                            <XCircle size={12} />
                            <span>Cancel</span>
                          </button>
                        </div>
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
