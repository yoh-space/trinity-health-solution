"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Video } from "lucide-react";

export interface DayCalendarAppointment {
  _id: string;
  requestType: "clinical" | "counselling";
  requestSummary?: string;
  staffName?: string;
  scheduledAt: number;
  durationMinutes: number;
  format: "online" | "inPerson";
  status?: "scheduled" | "completed" | "cancelled";
}

interface AppointmentDayCalendarProps {
  appointments: DayCalendarAppointment[];
  onComplete?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
}

const HOURS = Array.from({ length: 14 }, (_, index) => index + 7);

function dateKey(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function startOfDay(value: Date) {
  const day = new Date(value);
  day.setHours(0, 0, 0, 0);
  return day;
}

function formatHour(hour: number) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: "numeric" });
}

export function AppointmentDayCalendar({
  appointments,
  onComplete,
  onCancel,
}: AppointmentDayCalendarProps) {
  const firstAppointmentDate = appointments[0]
    ? startOfDay(new Date(appointments[0].scheduledAt))
    : startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState(firstAppointmentDate);
  const selectedKey = dateKey(selectedDate);
  const selectedAppointments = useMemo(
    () => appointments.filter((appointment) => dateKey(new Date(appointment.scheduledAt)) === selectedKey),
    [appointments, selectedKey],
  );

  function moveDay(amount: number) {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + amount);
      return next;
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#dce6dc] bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8eee7] px-5 py-4">
        <div>
          <div className="flex items-center gap-2 text-[#1c573e]">
            <CalendarDays size={16} />
            <h3 className="text-sm font-bold">Day schedule</h3>
          </div>
          <p className="mt-1 text-xs text-[#687d6f]">
            {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-[#d2ddd0] bg-[#f8faf7] p-1">
          <button type="button" onClick={() => moveDay(-1)} className="grid size-8 place-items-center rounded-lg text-[#496352] hover:bg-white" aria-label="Previous day">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={() => setSelectedDate(startOfDay(new Date()))} className="rounded-lg px-3 py-1.5 text-xs font-bold text-[#1c573e] hover:bg-white">
            Today
          </button>
          <button type="button" onClick={() => moveDay(1)} className="grid size-8 place-items-center rounded-lg text-[#496352] hover:bg-white" aria-label="Next day">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-162.5 overflow-y-auto">
        {selectedAppointments.length === 0 ? (
          <div className="grid min-h-80 place-items-center p-8 text-center">
            <div>
              <CalendarDays size={28} className="mx-auto text-[#8ba092]" />
              <p className="mt-3 text-sm font-semibold text-[#3d5948]">No appointments on this day</p>
              <p className="mt-1 text-xs text-[#718476]">Choose another day to view the schedule.</p>
            </div>
          </div>
        ) : (
          <div className="min-w-155">
            {HOURS.map((hour) => {
              const hourAppointments = selectedAppointments.filter(
                (appointment) => new Date(appointment.scheduledAt).getHours() === hour,
              );
              return (
                <div key={hour} className="grid min-h-24 grid-cols-[88px_1fr] border-b border-[#edf2ec]">
                  <div className="border-r border-[#edf2ec] px-4 py-4 text-right text-[11px] font-semibold text-[#829086]">
                    {formatHour(hour)}
                  </div>
                  <div className="space-y-2 bg-[#fcfdfb] p-2">
                    {hourAppointments.map((appointment) => {
                      const date = new Date(appointment.scheduledAt);
                      return (
                        <article key={appointment._id} className={`rounded-xl border p-3 ${appointment.requestType === "clinical" ? "border-[#cfe0cf] bg-[#f1f8f2]" : "border-[#ead9ce] bg-[#fff8f3]"}`}>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#496352]">
                                <span>{date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
                                <span>·</span>
                                <span>{appointment.requestType === "clinical" ? "Clinical" : "Counselling"}</span>
                              </div>
                              <h4 className="mt-1 text-sm font-bold text-[#203e2c]">
                                {appointment.requestSummary || "Care consultation"}
                              </h4>
                              <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#617567]">
                                <span className="inline-flex items-center gap-1"><Clock size={12} />{appointment.durationMinutes} min</span>
                                <span className="inline-flex items-center gap-1">{appointment.format === "online" ? <Video size={12} /> : <MapPin size={12} />}{appointment.format === "online" ? "Online" : "In person"}</span>
                                {appointment.staffName && <span>{appointment.staffName}</span>}
                              </div>
                            </div>
                            {appointment.status === "scheduled" && (onComplete || onCancel) && (
                              <div className="flex gap-2">
                                {onComplete && <button type="button" onClick={() => onComplete(appointment._id)} className="rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-emerald-800 hover:bg-emerald-50">Complete</button>}
                                {onCancel && <button type="button" onClick={() => onCancel(appointment._id)} className="rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-red-700 hover:bg-red-50">Cancel</button>}
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
