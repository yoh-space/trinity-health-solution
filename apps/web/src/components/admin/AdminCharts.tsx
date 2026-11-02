"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

export interface ChartProps {
  requestStatusCounts: {
    clinical: { submitted: number; inReview: number; contacted: number; closed: number };
    counselling: { submitted: number; inReview: number; contacted: number; closed: number };
  };
  staffDistribution: {
    clinicians: { active: number; available: number; caseload: number };
    counselors: { active: number; available: number; caseload: number };
    admins: { active: number; available: number; caseload: number };
  };
  appointmentFormatSplit: {
    online: number;
    inPerson: number;
  };
  contentCategoryDistribution: {
    category: string;
    published: number;
    drafts: number;
  }[];
}

const PIE_COLORS = ["#1c573e", "#c78157", "#3b82f6", "#10b981"];

export function AdminCharts({
  requestStatusCounts,
  staffDistribution,
  appointmentFormatSplit,
  contentCategoryDistribution,
}: ChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Chart 1: Request Status Throughput data
  const statusData = useMemo(
    () => [
      {
        status: "Submitted",
        Clinical: requestStatusCounts.clinical.submitted,
        Counselling: requestStatusCounts.counselling.submitted,
      },
      {
        status: "In Review",
        Clinical: requestStatusCounts.clinical.inReview,
        Counselling: requestStatusCounts.counselling.inReview,
      },
      {
        status: "Contacted",
        Clinical: requestStatusCounts.clinical.contacted,
        Counselling: requestStatusCounts.counselling.contacted,
      },
      {
        status: "Closed",
        Clinical: requestStatusCounts.clinical.closed,
        Counselling: requestStatusCounts.counselling.closed,
      },
    ],
    [
      requestStatusCounts.clinical.submitted,
      requestStatusCounts.clinical.inReview,
      requestStatusCounts.clinical.contacted,
      requestStatusCounts.clinical.closed,
      requestStatusCounts.counselling.submitted,
      requestStatusCounts.counselling.inReview,
      requestStatusCounts.counselling.contacted,
      requestStatusCounts.counselling.closed,
    ]
  );

  // Chart 2: Staff Capacity by Role data
  const staffData = useMemo(
    () => [
      {
        role: "Clinicians",
        Total: staffDistribution.clinicians.active,
        Available: staffDistribution.clinicians.available,
        Caseload: staffDistribution.clinicians.caseload,
      },
      {
        role: "Counselors",
        Total: staffDistribution.counselors.active,
        Available: staffDistribution.counselors.available,
        Caseload: staffDistribution.counselors.caseload,
      },
      {
        role: "Admins",
        Total: staffDistribution.admins.active,
        Available: staffDistribution.admins.available,
        Caseload: staffDistribution.admins.caseload,
      },
    ],
    [
      staffDistribution.clinicians.active,
      staffDistribution.clinicians.available,
      staffDistribution.clinicians.caseload,
      staffDistribution.counselors.active,
      staffDistribution.counselors.available,
      staffDistribution.counselors.caseload,
      staffDistribution.admins.active,
      staffDistribution.admins.available,
      staffDistribution.admins.caseload,
    ]
  );

  // Chart 3: Consultation Format Pie data
  const formatPieData = useMemo(
    () => [
      { name: "Online Video/Audio", value: Math.max(1, appointmentFormatSplit.online) },
      { name: "In-Person Clinic", value: Math.max(0, appointmentFormatSplit.inPerson) },
    ],
    [appointmentFormatSplit.online, appointmentFormatSplit.inPerson]
  );

  if (!isMounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-80 animate-pulse bg-white/60 p-6">
            <div className="h-5 w-40 rounded-md bg-[#eaf0e6]" />
            <div className="mt-4 h-56 w-full rounded-xl bg-[#f4f7f2]" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Chart 1: Triage Funnel by Role */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Care Request Triage by Role</CardTitle>
              <CardDescription>
                Throughput breakdown across Clinical vs. Counselling services
              </CardDescription>
            </div>
            <Badge variant="secondary">Live Queue</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4eae2" />
                <XAxis dataKey="status" tick={{ fill: "#607466", fontSize: 12 }} stroke="#cbd6cb" />
                <YAxis tick={{ fill: "#607466", fontSize: 12 }} stroke="#cbd6cb" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1rem",
                    border: "1px solid #dce5db",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="Clinical" fill="#1c573e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Counselling" fill="#c78157" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Staff Role Distribution & Caseload */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Distribution & Caseload</CardTitle>
              <CardDescription>
                Active headcount, availability on duty, and active patient load
              </CardDescription>
            </div>
            <Badge variant="emerald">Multi-Role</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={staffData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4eae2" />
                <XAxis dataKey="role" tick={{ fill: "#607466", fontSize: 12 }} stroke="#cbd6cb" />
                <YAxis tick={{ fill: "#607466", fontSize: 12 }} stroke="#cbd6cb" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1rem",
                    border: "1px solid #dce5db",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="Total" fill="#3b5e47" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Available" fill="#52b788" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Caseload" fill="#d4a373" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 3: Consultation Format Modality */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Consultation Modality Split</CardTitle>
              <CardDescription>
                Tele-health (Online video/audio) versus In-person clinic visits
              </CardDescription>
            </div>
            <Badge variant="info">Format</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-72 items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={formatPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {formatPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1rem",
                    border: "1px solid #dce5db",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 4: Educational Curriculum Health */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Curriculum Coverage by Category</CardTitle>
              <CardDescription>
                Health topics distribution across Published and Draft notes
              </CardDescription>
            </div>
            <Badge variant="secondary">Bilingual</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                layout="vertical"
                data={contentCategoryDistribution}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4eae2" />
                <XAxis type="number" tick={{ fill: "#607466", fontSize: 12 }} stroke="#cbd6cb" />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fill: "#607466", fontSize: 11 }}
                  stroke="#cbd6cb"
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1rem",
                    border: "1px solid #dce5db",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="published" fill="#1c573e" radius={[0, 6, 6, 0]} name="Published" />
                <Bar dataKey="drafts" fill="#d6dfd5" radius={[0, 6, 6, 0]} name="Drafts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
