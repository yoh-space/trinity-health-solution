"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";

export function ConsultationRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState("General family nutrition");
  const [format, setFormat] = useState("Online");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };
  if (submitted)
    return (
      <section className="max-w-2xl rounded-3xl border border-[#c9dfcc] bg-[#eaf4eb] p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
          REQUEST RECEIVED
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#23472e]">
          A little support is on its way.
        </h1>
        <p className="mt-4 leading-7 text-[#54705c]">
          This prototype request is visible only in this browser session. No
          appointment was booked and no personal health information was sent.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/portal"
            className="rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
          >
            Back to portal
          </Link>
          <Link
            href="/learn"
            className="rounded-full border border-[#bcd4bf] bg-white px-5 py-3 text-sm font-bold text-[#287343]"
          >
            Keep learning
          </Link>
        </div>
      </section>
    );
  return (
    <form
      onSubmit={submit}
      className="max-w-3xl rounded-3xl border border-[#dce8de] bg-white p-6 shadow-sm sm:p-8"
    >
      <Link href="/portal" className="text-sm font-bold text-[#438451]">
        <span className="inline-flex items-center gap-2">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to portal
        </span>
      </Link>
      <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
        REQUEST SUPPORT
      </p>
      <h1 className="mt-3 text-4xl font-semibold">
        What would be useful right now?
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-[#68796d]">
        Choose a general topic and preferred format. Do not include names, phone
        numbers, diagnoses, or urgent symptoms in the message.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Support type
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="rounded-xl border border-[#cfddd1] bg-white px-3 py-3 font-normal"
          >
            <option>General family nutrition</option>
            <option>Pregnancy and breastfeeding nutrition</option>
            <option>Child feeding guidance</option>
            <option>Food and water safety</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Preferred format
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className="rounded-xl border border-[#cfddd1] bg-white px-3 py-3 font-normal"
          >
            <option>Online</option>
            <option>In person</option>
          </select>
        </label>
      </div>
      <label className="mt-6 grid gap-2 text-sm font-semibold">
        A short general note{" "}
        <textarea
          className="min-h-36 rounded-xl border border-[#cfddd1] px-3 py-3 font-normal outline-none focus:border-[#287343]"
          placeholder="For example: I would like help planning familiar meals for my family."
        />
      </label>
      <div className="mt-6 rounded-2xl bg-[#f7faf6] p-4 text-xs leading-5 text-[#718075]">
        For urgent symptoms or emergencies, contact a local health service
        directly. This request form is not emergency care.
      </div>
      <button className="mt-6 rounded-full bg-[#287343] px-6 py-3 text-sm font-bold text-white">
        Create demo request
      </button>
    </form>
  );
}
