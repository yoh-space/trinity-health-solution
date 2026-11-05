"use client";

import { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useUser } from "@clerk/nextjs";
import {
  ShieldCheck,
  Users,
  Stethoscope,
  HeartHandshake,
  Shield,
  Circle,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRightLeft,
  LayoutGrid,
  List,
  Check,
  Copy,
  SlidersHorizontal,
  Info,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

export interface TeamMemberItem {
  _id: string;
  clerkUserId?: string;
  role: "clinician" | "counselor" | "admin";
  displayName: string;
  specialty: string;
  availability: "available" | "away";
  active: boolean;
  openRequestCount: number | "100+";
}

interface NewMemberForm {
  displayName: string;
  specialty: string;
  role: "clinician" | "counselor" | "admin";
  availability: "available" | "away";
  clerkUserId: string;
}

const emptyNewMemberForm: NewMemberForm = {
  displayName: "",
  specialty: "",
  role: "clinician",
  availability: "available",
  clerkUserId: "",
};

type ViewMode = "grid" | "table";
type SortOption = "name" | "caseload" | "role" | "availability";

export function AdminStaffRoster({
  teamMembers,
}: {
  teamMembers: TeamMemberItem[];
}) {
  const { user } = useUser();
  const currentUserId = user?.id;

  // Convex Mutations
  const createMember = useMutation(anyApi.staff.createTeamMember);
  const updateMember = useMutation(anyApi.staff.updateTeamMember);
  const removeMember = useMutation(anyApi.staff.removeTeamMember);
  const changeRoleMutation = useMutation(anyApi.staff.changeStaffRole);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "clinician" | "counselor" | "admin">("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "away">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [roleChangeMember, setRoleChangeMember] = useState<TeamMemberItem | null>(null);
  const [targetRole, setTargetRole] = useState<"clinician" | "counselor" | "admin">("clinician");
  const [newForm, setNewForm] = useState<NewMemberForm>(emptyNewMemberForm);

  // Operation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function notify(text: string, error = false) {
    setActionMessage({ text, error });
    setTimeout(() => setActionMessage(null), 4500);
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Aggregate KPI Calculations
  const metrics = useMemo(() => {
    const total = teamMembers.length;
    const activeMembers = teamMembers.filter((m) => m.active);
    const clinicians = teamMembers.filter((m) => m.role === "clinician");
    const counselors = teamMembers.filter((m) => m.role === "counselor");
    const admins = teamMembers.filter((m) => m.role === "admin");

    const cliniciansOnDuty = clinicians.filter((m) => m.active && m.availability === "available").length;
    const counselorsOnDuty = counselors.filter((m) => m.active && m.availability === "available").length;
    const totalOnDuty = teamMembers.filter((m) => m.active && m.availability === "available").length;

    const totalOpenCases = teamMembers.reduce((acc, m) => {
      const count = typeof m.openRequestCount === "number" ? m.openRequestCount : 100;
      return acc + count;
    }, 0);

    const onDutyRate = total > 0 ? Math.round((totalOnDuty / total) * 100) : 0;

    return {
      total,
      activeCount: activeMembers.length,
      inactiveCount: total - activeMembers.length,
      totalOnDuty,
      onDutyRate,
      cliniciansTotal: clinicians.length,
      cliniciansOnDuty,
      counselorsTotal: counselors.length,
      counselorsOnDuty,
      adminsTotal: admins.length,
      totalOpenCases,
    };
  }, [teamMembers]);

  // Filtered and Sorted members list
  const filteredMembers = useMemo(() => {
    let result = teamMembers.filter((m) => {
      if (roleFilter !== "all" && m.role !== roleFilter) return false;
      if (availabilityFilter !== "all" && m.availability !== availabilityFilter) return false;
      if (statusFilter === "active" && !m.active) return false;
      if (statusFilter === "inactive" && m.active) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = m.displayName.toLowerCase().includes(q);
        const matchSpec = m.specialty.toLowerCase().includes(q);
        const matchId = m.clerkUserId?.toLowerCase().includes(q);
        if (!matchName && !matchSpec && !matchId) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.displayName.localeCompare(b.displayName);
      }
      if (sortBy === "caseload") {
        const cA = typeof a.openRequestCount === "number" ? a.openRequestCount : 100;
        const cB = typeof b.openRequestCount === "number" ? b.openRequestCount : 100;
        return cB - cA;
      }
      if (sortBy === "role") {
        const order = { admin: 0, clinician: 1, counselor: 2 };
        return order[a.role] - order[b.role];
      }
      if (sortBy === "availability") {
        if (a.availability === b.availability) return 0;
        return a.availability === "available" ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [teamMembers, roleFilter, availabilityFilter, statusFilter, searchQuery, sortBy]);

  // --- ACTIONS ---

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newForm.displayName.trim() || !newForm.specialty.trim()) {
      notify("Please provide both name and professional specialty.", true);
      return;
    }

    setIsSubmitting(true);
    try {
      await createMember({
        displayName: newForm.displayName.trim(),
        specialty: newForm.specialty.trim(),
        role: newForm.role,
        availability: newForm.availability,
        ...(newForm.clerkUserId.trim() ? { clerkUserId: newForm.clerkUserId.trim() } : {}),
      });
      notify(`Staff member ${newForm.displayName} added to the team.`);
      setShowAddModal(false);
      setNewForm(emptyNewMemberForm);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to add team member.", true);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMember) return;

    setIsSubmitting(true);
    try {
      await updateMember({
        profileId: editingMember._id as any,
        displayName: editingMember.displayName.trim(),
        specialty: editingMember.specialty.trim(),
        role: editingMember.role,
        availability: editingMember.availability,
        active: editingMember.active,
      });
      notify(`Updated profile for ${editingMember.displayName}.`);
      setEditingMember(null);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to update profile.", true);
    } finally {
      setIsSubmitting(false);
    }
  }

  function openRoleChangeModal(member: TeamMemberItem) {
    setRoleChangeMember(member);
    setTargetRole(member.role);
  }

  async function handleConfirmRoleChange() {
    if (!roleChangeMember) return;
    if (roleChangeMember.role === targetRole) {
      setRoleChangeMember(null);
      return;
    }

    // Protect against self-demotion if current logged-in user is editing their own admin profile
    if (roleChangeMember.clerkUserId && roleChangeMember.clerkUserId === currentUserId && targetRole !== "admin") {
      notify("You cannot remove your own administrator role to avoid system lockout.", true);
      return;
    }

    setIsSubmitting(true);
    try {
      if (changeRoleMutation) {
        await changeRoleMutation({
          profileId: roleChangeMember._id as any,
          role: targetRole,
        });
      } else {
        await updateMember({
          profileId: roleChangeMember._id as any,
          displayName: roleChangeMember.displayName,
          specialty: roleChangeMember.specialty,
          role: targetRole,
          availability: roleChangeMember.availability,
          active: roleChangeMember.active,
        });
      }
      notify(`Role for ${roleChangeMember.displayName} successfully changed to ${targetRole.toUpperCase()}.`);
      setRoleChangeMember(null);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to change role.", true);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleActive(member: TeamMemberItem) {
    if (member.clerkUserId && member.clerkUserId === currentUserId && member.active) {
      notify("You cannot deactivate your own administrator account.", true);
      return;
    }

    try {
      await updateMember({
        profileId: member._id as any,
        displayName: member.displayName,
        specialty: member.specialty,
        role: member.role,
        availability: member.availability,
        active: !member.active,
      });
      notify(
        !member.active
          ? `${member.displayName} is now active.`
          : `${member.displayName} has been deactivated.`
      );
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not toggle status.", true);
    }
  }

  async function handleToggleAvailability(member: TeamMemberItem) {
    const nextAvailability = member.availability === "available" ? "away" : "available";
    try {
      await updateMember({
        profileId: member._id as any,
        displayName: member.displayName,
        specialty: member.specialty,
        role: member.role,
        availability: nextAvailability,
        active: member.active,
      });
      notify(`${member.displayName} availability marked as ${nextAvailability === "available" ? "On Duty" : "Away"}.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not toggle availability.", true);
    }
  }

  async function handleDeleteMember(member: TeamMemberItem) {
    if (member.clerkUserId && member.clerkUserId === currentUserId) {
      notify("You cannot delete your own administrator profile.", true);
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently remove ${member.displayName} from the team directory?`)) {
      return;
    }
    try {
      await removeMember({ profileId: member._id as any });
      notify(`Team profile for ${member.displayName} has been removed.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not remove team member.", true);
    }
  }

  // --- STYLING HELPERS ---

  const getRoleIcon = (role: TeamMemberItem["role"]) => {
    switch (role) {
      case "clinician":
        return <Stethoscope size={14} className="text-[#1c573e]" />;
      case "counselor":
        return <HeartHandshake size={14} className="text-[#b45d34]" />;
      case "admin":
        return <Shield size={14} className="text-[#3b5e7d]" />;
    }
  };

  const getRoleBadge = (role: TeamMemberItem["role"]) => {
    switch (role) {
      case "clinician":
        return <Badge variant="emerald">Clinician</Badge>;
      case "counselor":
        return <Badge variant="terracotta">Counselor</Badge>;
      case "admin":
        return <Badge variant="info">Admin</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. EXECUTIVE TEAM KPI BANNER */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Team Members */}
        <div className="rounded-2xl border border-[#dce6dc] bg-white p-4.5 shadow-xs transition hover:border-[#1c573e]/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#637769]">
              Total Team Size
            </span>
            <div className="grid size-8 place-items-center rounded-xl bg-[#e8efe6] text-[#1c573e]">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153825]">{metrics.total}</span>
            <span className="text-[11px] font-semibold text-[#1e613b]">
              {metrics.activeCount} active
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#6d8073]">
            <span>On-duty rate</span>
            <span className="font-bold text-[#1a3828]">{metrics.onDutyRate}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#edf2ea]">
            <div
              className="h-full rounded-full bg-[#1c573e] transition-all duration-500"
              style={{ width: `${metrics.onDutyRate}%` }}
            />
          </div>
        </div>

        {/* Card 2: Clinicians */}
        <div className="rounded-2xl border border-[#dce6dc] bg-white p-4.5 shadow-xs transition hover:border-[#1c573e]/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#637769]">
              Clinicians (NCD/Care)
            </span>
            <div className="grid size-8 place-items-center rounded-xl bg-[#e8efe6] text-[#1c573e]">
              <Stethoscope size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153825]">
              {metrics.cliniciansTotal}
            </span>
            <span className="text-[11px] font-semibold text-[#15803d]">
              {metrics.cliniciansOnDuty} on duty
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#6d8073]">
            Handling medical triage & high-risk maternal referrals
          </p>
        </div>

        {/* Card 3: Counselors */}
        <div className="rounded-2xl border border-[#dce6dc] bg-white p-4.5 shadow-xs transition hover:border-[#b45d34]/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#637769]">
              Counselors (Nutrition)
            </span>
            <div className="grid size-8 place-items-center rounded-xl bg-[#faeee5] text-[#b45d34]">
              <HeartHandshake size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153825]">
              {metrics.counselorsTotal}
            </span>
            <span className="text-[11px] font-semibold text-[#b45d34]">
              {metrics.counselorsOnDuty} on duty
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#6d8073]">
            Family diet coaching, breastfeeding & complementary feeding
          </p>
        </div>

        {/* Card 4: System Administrators */}
        <div className="rounded-2xl border border-[#dce6dc] bg-white p-4.5 shadow-xs transition hover:border-[#3b5e7d]/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#637769]">
              Admins & Supervisors
            </span>
            <div className="grid size-8 place-items-center rounded-xl bg-[#e0e7ff] text-[#4338ca]">
              <Shield size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#153825]">
              {metrics.adminsTotal}
            </span>
            <span className="text-[11px] font-semibold text-[#4338ca]">
              Full Privileges
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#6d8073]">
            <span>Active Team Caseload</span>
            <span className="font-mono font-bold text-[#173a27]">{metrics.totalOpenCases} cases</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN TEAM MANAGEMENT WORKSPACE CARD */}
      <Card className="border border-[#dce6dc] shadow-xs">
        <CardHeader className="border-b border-[#eef2ea] pb-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-extrabold text-[#153826]">
                  Team Directory & Role Governance
                </CardTitle>
                <Badge variant="emerald" className="text-[10px]">
                  {filteredMembers.length} displayed
                </Badge>
              </div>
              <CardDescription className="mt-1 text-xs text-[#5e7364]">
                Manage clinical and counseling staff, grant or revoke administrative roles, and balance team caseloads.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Mode Toggle */}
              <div className="flex items-center rounded-xl border border-[#d2ddd0] bg-[#f8faf7] p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid Cards View"
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    viewMode === "grid"
                      ? "bg-white text-[#1c573e] shadow-xs"
                      : "text-[#627768] hover:text-[#183a26]"
                  }`}
                >
                  <LayoutGrid size={13} />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  title="Table View"
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    viewMode === "table"
                      ? "bg-white text-[#1c573e] shadow-xs"
                      : "text-[#627768] hover:text-[#183a26]"
                  }`}
                >
                  <List size={13} />
                  <span>Table</span>
                </button>
              </div>

              {/* Add Member Button */}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#1c573e] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#154631] active:scale-95"
              >
                <Plus size={14} />
                <span>Add Team Member</span>
              </button>
            </div>
          </div>

          {/* Action Notification Toast */}
          {actionMessage && (
            <div
              className={`mt-4 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs ${
                actionMessage.error
                  ? "border border-red-200 bg-red-50 text-red-700"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {actionMessage.error ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Search, Filters, and Sorting Controls */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#839688]"
              />
              <input
                type="text"
                placeholder="Search by name, specialty, or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#d2ddd0] bg-white py-2 pl-9 pr-4 text-xs font-medium text-[#1c3a2a] placeholder-[#8a9d8f] focus:border-[#1c573e] focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-[#d2ddd0] bg-white p-1 text-xs">
              <button
                onClick={() => setRoleFilter("all")}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                  roleFilter === "all" ? "bg-[#1c573e] text-white" : "text-[#5b6e61] hover:text-[#183a26]"
                }`}
              >
                All ({teamMembers.length})
              </button>
              <button
                onClick={() => setRoleFilter("clinician")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition ${
                  roleFilter === "clinician" ? "bg-[#1c573e] text-white" : "text-[#5b6e61] hover:text-[#183a26]"
                }`}
              >
                <Stethoscope size={11} />
                <span>Clinicians ({metrics.cliniciansTotal})</span>
              </button>
              <button
                onClick={() => setRoleFilter("counselor")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition ${
                  roleFilter === "counselor" ? "bg-[#1c573e] text-white" : "text-[#5b6e61] hover:text-[#183a26]"
                }`}
              >
                <HeartHandshake size={11} />
                <span>Counselors ({metrics.counselorsTotal})</span>
              </button>
              <button
                onClick={() => setRoleFilter("admin")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition ${
                  roleFilter === "admin" ? "bg-[#1c573e] text-white" : "text-[#5b6e61] hover:text-[#183a26]"
                }`}
              >
                <Shield size={11} />
                <span>Admins ({metrics.adminsTotal})</span>
              </button>
            </div>

            {/* Availability Filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="rounded-xl border border-[#d2ddd0] bg-white px-3 py-1.5 text-xs font-semibold text-[#294a37] focus:outline-hidden"
            >
              <option value="all">Availability: All</option>
              <option value="available">On Duty Only</option>
              <option value="away">Away Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-[#d2ddd0] bg-white px-3 py-1.5 text-xs font-semibold text-[#294a37] focus:outline-hidden"
            >
              <option value="all">Status: All</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 rounded-xl border border-[#d2ddd0] bg-white px-2.5 py-1 text-xs">
              <SlidersHorizontal size={12} className="text-[#64796a]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-[#294a37] focus:outline-hidden"
              >
                <option value="name">Sort: Name (A-Z)</option>
                <option value="caseload">Sort: Highest Caseload</option>
                <option value="role">Sort: Role (Admins First)</option>
                <option value="availability">Sort: On Duty First</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d4dfd4] bg-[#fafcf9] py-14 text-center">
              <div className="grid size-12 place-items-center rounded-full bg-[#e8efe6] text-[#1c573e]">
                <Users size={22} />
              </div>
              <h4 className="mt-3 text-sm font-bold text-[#163925]">No team members found</h4>
              <p className="mt-1 max-w-sm text-xs text-[#6e8274]">
                No staff members match the current filter and search criteria. Try clearing search filters or add a new team member.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                  setAvailabilityFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-4 rounded-full border border-[#cbd8cb] bg-white px-4 py-1.5 text-xs font-semibold text-[#324f3c] hover:bg-[#f2f7f1]"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* --- CARDS / GRID VIEW --- */
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => {
                const isCurrentUser = member.clerkUserId && member.clerkUserId === currentUserId;
                const isOverloaded = typeof member.openRequestCount === "number" && member.openRequestCount > 5;

                return (
                  <div
                    key={member._id}
                    className={`relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
                      !member.active
                        ? "border-red-200 bg-red-50/20 opacity-80"
                        : member.role === "admin"
                        ? "border-blue-100 bg-gradient-to-b from-blue-50/20 to-white"
                        : "border-[#dbe6db] hover:border-[#1c573e]/50"
                    }`}
                  >
                    {/* Card Top: Avatar, Role, Online Dot */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="grid size-11 place-items-center rounded-2xl bg-[#e8efe6] font-extrabold text-[#1c573e]">
                              {member.displayName.slice(0, 2).toUpperCase()}
                            </div>
                            {/* Availability status ring */}
                            <span
                              title={member.availability === "available" ? "On Duty" : "Away"}
                              className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-white ${
                                member.availability === "available"
                                  ? "bg-emerald-500 animate-pulse"
                                  : "bg-amber-500"
                              }`}
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-[#163826] text-sm">
                                {member.displayName}
                              </h4>
                              {isCurrentUser && (
                                <span className="rounded-md bg-[#e6f4ea] px-1.5 py-0.2 text-[9px] font-bold text-[#1e613b]">
                                  YOU
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-medium text-[#5c7263] line-clamp-1">
                              {member.specialty}
                            </p>
                          </div>
                        </div>

                        {/* Status badge */}
                        <Badge variant={member.active ? "success" : "destructive"} className="text-[10px]">
                          {member.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      {/* Role & Caseload Bar */}
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-[#e4ece3] bg-[#f8faf7] p-2.5">
                        <div className="flex items-center gap-1.5">
                          {getRoleIcon(member.role)}
                          {getRoleBadge(member.role)}
                        </div>

                        <div className="flex items-center gap-1 text-xs">
                          <span
                            className={`font-mono font-bold ${
                              isOverloaded ? "text-amber-700" : "text-[#183925]"
                            }`}
                          >
                            {member.openRequestCount}
                          </span>
                          <span className="text-[10px] text-[#6d8172]">cases</span>
                          {isOverloaded && (
                            <span className="ml-0.5 rounded-full bg-amber-100 px-1 py-0.2 text-[9px] font-bold text-amber-800">
                              High
                            </span>
                          )}
                        </div>
                      </div>

                      {/* User ID / Directory Identity */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#788b7c]">
                        <span className="font-medium">Identity ID:</span>
                        <div className="flex items-center gap-1 font-mono">
                          <span>
                            {member.clerkUserId ? `${member.clerkUserId.slice(0, 16)}...` : "Directory"}
                          </span>
                          {member.clerkUserId && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(member.clerkUserId!, member._id)}
                              title="Copy User ID"
                              className="text-gray-400 hover:text-gray-700"
                            >
                              {copiedId === member._id ? (
                                <Check size={11} className="text-emerald-600" />
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-5 border-t border-[#edf3ed] pt-3">
                      <div className="flex items-center justify-between gap-2">
                        {/* Quick Role Change Button */}
                        <button
                          type="button"
                          onClick={() => openRoleChangeModal(member)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#cfe0cf] bg-white py-1.5 text-xs font-bold text-[#1c573e] transition hover:bg-[#edf4ec] hover:border-[#1c573e]"
                        >
                          <ArrowRightLeft size={12} />
                          <span>Change Role</span>
                        </button>

                        {/* Availability Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(member)}
                          title={`Toggle availability (currently ${member.availability})`}
                          className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                            member.availability === "available"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          }`}
                        >
                          <Circle
                            size={7}
                            className={`inline mr-1 ${
                              member.availability === "available"
                                ? "fill-emerald-600 text-emerald-600"
                                : "fill-amber-600 text-amber-600"
                            }`}
                          />
                          {member.availability === "available" ? "On Duty" : "Away"}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingMember(member)}
                          title="Edit Full Profile"
                          className="grid size-8 place-items-center rounded-xl border border-[#d2ddd0] bg-white text-[#455c4d] hover:bg-[#edf4ec] hover:text-[#183925]"
                        >
                          <Pencil size={12} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(member)}
                          title="Remove Member"
                          className="grid size-8 place-items-center rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* --- DENSE TABLE VIEW --- */
            <div className="overflow-x-auto rounded-xl border border-[#e4ece3]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#eef2ea] bg-[#f9faf7] text-[11px] font-bold uppercase tracking-wider text-[#687d6f]">
                  <tr>
                    <th className="px-5 py-3.5">Name & User ID</th>
                    <th className="px-5 py-3.5">Assigned Role</th>
                    <th className="px-5 py-3.5">Specialty</th>
                    <th className="px-5 py-3.5">Availability</th>
                    <th className="px-5 py-3.5">Open Caseload</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Role & Profile Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4ee]">
                  {filteredMembers.map((member) => {
                    const isCurrentUser = member.clerkUserId && member.clerkUserId === currentUserId;

                    return (
                      <tr key={member._id} className="transition hover:bg-[#f6f9f5]">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="grid size-8 place-items-center rounded-full bg-[#e8efe6] font-bold text-[#1c573e]">
                              {member.displayName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-[#193a27]">{member.displayName}</p>
                                {isCurrentUser && (
                                  <span className="rounded bg-[#e6f4ea] px-1 py-0.2 text-[9px] font-bold text-[#1e613b]">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#788a7c] font-mono">
                                {member.clerkUserId ? `${member.clerkUserId.slice(0, 16)}...` : "Directory"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {getRoleIcon(member.role)}
                            {getRoleBadge(member.role)}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-[#4b6051]">
                          {member.specialty || "Public Health Practice"}
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(member)}
                            title="Click to toggle availability"
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition hover:opacity-85 ${
                              member.availability === "available"
                                ? "bg-[#dcfce7] text-[#15803d]"
                                : "bg-[#fef3c7] text-[#b45309]"
                            }`}
                          >
                            <Circle
                              size={7}
                              className={
                                member.availability === "available"
                                  ? "fill-[#15803d] text-[#15803d]"
                                  : "fill-[#b45309] text-[#b45309]"
                              }
                            />
                            {member.availability === "available" ? "On Duty" : "Away"}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[#193b28]">
                              {member.openRequestCount}
                            </span>
                            <span className="text-[11px] text-[#718476]">cases</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(member)}
                            title="Click to toggle active status"
                            className="transition hover:opacity-85"
                          >
                            <Badge variant={member.active ? "success" : "destructive"}>
                              {member.active ? "Active" : "Inactive"}
                            </Badge>
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Quick Change Role Button */}
                            <button
                              type="button"
                              onClick={() => openRoleChangeModal(member)}
                              className="flex items-center gap-1 rounded-lg border border-[#cfe0cf] bg-white px-2.5 py-1 text-xs font-bold text-[#1c573e] hover:bg-[#edf4ec]"
                            >
                              <ArrowRightLeft size={11} />
                              <span>Role</span>
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => setEditingMember(member)}
                              title="Edit Profile"
                              className="grid size-7 place-items-center rounded-lg border border-[#d2ddd0] bg-white text-[#455c4d] hover:bg-[#edf4ec] hover:text-[#183925]"
                            >
                              <Pencil size={11} />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(member)}
                              title="Remove Member"
                              className="grid size-7 place-items-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. GOVERNANCE & PRIVILEGE MATRIX REFERENCE */}
      <Card className="border border-[#e1eae0] bg-[#fafcf9]">
        <CardHeader className="py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#1c573e]" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1e4e35]">
              Role Governance & Operational Matrix
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-[#63796a]">
            Access privileges enforced across the Trinity health platform. Changing a member's role updates their operational capabilities immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-[#d8e6d8] bg-white p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-[#1c573e]">
                <Stethoscope size={14} />
                <span>Clinician (Medical / NCD)</span>
              </div>
              <ul className="mt-2 space-y-1 text-[#546b5a] text-[11px]">
                <li>• Triages maternal and clinical health requests</li>
                <li>• Conducts online & in-person clinical consultations</li>
                <li>• Authors clinical referral notes</li>
                <li>• Restricted from modifying other team members</li>
              </ul>
            </div>

            <div className="rounded-xl border border-[#ebd8cc] bg-white p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-[#b45d34]">
                <HeartHandshake size={14} />
                <span>Counselor (Nutrition / Family)</span>
              </div>
              <ul className="mt-2 space-y-1 text-[#546b5a] text-[11px]">
                <li>• Family nutrition and infant feeding counseling</li>
                <li>• Community wellness coaching & follow-ups</li>
                <li>• Accessible via direct appointment bookings</li>
                <li>• Restricted from medical diagnosis & admin controls</li>
              </ul>
            </div>

            <div className="rounded-xl border border-[#cad5e3] bg-white p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-[#2d4d6e]">
                <Shield size={14} />
                <span>System Administrator</span>
              </div>
              <ul className="mt-2 space-y-1 text-[#546b5a] text-[11px]">
                <li>• Full team CRUD & role assignment controls</li>
                <li>• Care queue triage reassignment & escalation</li>
                <li>• Curriculum Studio creation and publication</li>
                <li>• Platform analytics, audits & KPI oversight</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- DEDICATED CHANGE ROLE MODAL --- */}
      {roleChangeMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#d9e3d9] bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setRoleChangeMember(null)}
              className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-[#6b7e71] hover:bg-[#f1f6f1]"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              <ArrowRightLeft size={14} />
              <span>Role Reassignment</span>
            </div>

            <h3 className="mt-1 text-xl font-extrabold text-[#163826]">
              Change Role: {roleChangeMember.displayName}
            </h3>
            <p className="mt-1 text-xs text-[#697d6f]">
              Reassign operational privileges. The user's workflow permissions across care requests and staff portals will update instantly.
            </p>

            {/* Current Member Status Card */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#e2eae1] bg-[#f8faf7] p-3.5">
              <div>
                <p className="text-[11px] font-semibold text-[#667a6d]">Current Assignment:</p>
                <div className="mt-1 flex items-center gap-1.5">
                  {getRoleIcon(roleChangeMember.role)}
                  <span className="font-bold capitalize text-[#153825]">
                    {roleChangeMember.role}
                  </span>
                  <span className="text-[#a4b5a8]">•</span>
                  <span className="text-xs text-[#526658]">{roleChangeMember.specialty}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#6d8073]">Open Caseload</span>
                <p className="font-mono font-bold text-[#183925]">
                  {roleChangeMember.openRequestCount} cases
                </p>
              </div>
            </div>

            {/* Warning if member has open cases */}
            {typeof roleChangeMember.openRequestCount === "number" && roleChangeMember.openRequestCount > 0 && (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Notice:</strong> {roleChangeMember.displayName} currently holds{" "}
                  <strong>{roleChangeMember.openRequestCount} active care request(s)</strong>. These cases will remain assigned to them until transferred in the Care Triage Queue.
                </p>
              </div>
            )}

            {/* Self-demotion safeguard alert */}
            {roleChangeMember.clerkUserId && roleChangeMember.clerkUserId === currentUserId && (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
                <Info size={15} className="mt-0.5 shrink-0 text-blue-600" />
                <p className="text-[11px] leading-relaxed">
                  You are editing your own administrator profile. You cannot remove your administrator privileges to prevent losing access to this dashboard.
                </p>
              </div>
            )}

            {/* Role Options Selector */}
            <div className="mt-5 space-y-2.5">
              <label className="block text-xs font-bold text-[#1a3a28]">
                Select New Target Role:
              </label>

              {/* Option 1: Clinician */}
              <div
                onClick={() => setTargetRole("clinician")}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
                  targetRole === "clinician"
                    ? "border-[#1c573e] bg-[#f2f8f3] ring-2 ring-[#1c573e]/20"
                    : "border-[#d8e3d8] bg-white hover:bg-[#fafcf9]"
                }`}
              >
                <div className="mt-0.5 grid size-7 place-items-center rounded-xl bg-[#e8efe6] text-[#1c573e]">
                  <Stethoscope size={15} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#173a27] text-xs">Clinician</span>
                    {targetRole === "clinician" && <Check size={14} className="text-[#1c573e]" />}
                  </div>
                  <p className="text-[11px] text-[#55695b] mt-0.5">
                    Authorized to handle clinical triage, review maternal health risk indicators, and conduct patient consultations.
                  </p>
                </div>
              </div>

              {/* Option 2: Counselor */}
              <div
                onClick={() => setTargetRole("counselor")}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
                  targetRole === "counselor"
                    ? "border-[#b45d34] bg-[#fdf6f2] ring-2 ring-[#b45d34]/20"
                    : "border-[#d8e3d8] bg-white hover:bg-[#fafcf9]"
                }`}
              >
                <div className="mt-0.5 grid size-7 place-items-center rounded-xl bg-[#faeee5] text-[#b45d34]">
                  <HeartHandshake size={15} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#173a27] text-xs">Counselor</span>
                    {targetRole === "counselor" && <Check size={14} className="text-[#b45d34]" />}
                  </div>
                  <p className="text-[11px] text-[#55695b] mt-0.5">
                    Authorized for maternal nutrition coaching, breastfeeding advice, complementary feeding, and family wellbeing sessions.
                  </p>
                </div>
              </div>

              {/* Option 3: Administrator */}
              <div
                onClick={() => {
                  setTargetRole("admin");
                }}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition ${
                  targetRole === "admin"
                    ? "border-[#3b5e7d] bg-[#f0f5fa] ring-2 ring-[#3b5e7d]/20"
                    : "border-[#d8e3d8] bg-white hover:bg-[#fafcf9]"
                }`}
              >
                <div className="mt-0.5 grid size-7 place-items-center rounded-xl bg-[#e0e7ff] text-[#4338ca]">
                  <Shield size={15} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#173a27] text-xs">System Administrator</span>
                    {targetRole === "admin" && <Check size={14} className="text-[#3b5e7d]" />}
                  </div>
                  <p className="text-[11px] text-[#55695b] mt-0.5">
                    Full supervisory powers: manages team members, changes roles, reassigns care queues, and publishes curriculum.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#edf3ed] pt-4">
              <button
                type="button"
                onClick={() => setRoleChangeMember(null)}
                className="rounded-full border border-[#d0ded0] px-4 py-2 text-xs font-semibold text-[#576b5d] hover:bg-[#f6f9f5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRoleChange}
                disabled={
                  isSubmitting ||
                  roleChangeMember.role === targetRole ||
                  (roleChangeMember.clerkUserId === currentUserId && targetRole !== "admin")
                }
                className="flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#154631] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Updating Role...</span>
                  </>
                ) : (
                  <span>Confirm Role Change</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD STAFF MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#d9e3d9] bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-[#6b7e71] hover:bg-[#f1f6f1]"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-[#163826]">Add Team Member</h3>
            <p className="mt-1 text-xs text-[#697d6f]">
              Provision a new clinical practitioner, health counselor, or administrator.
            </p>

            <form onSubmit={handleCreateMember} className="mt-5 space-y-4 text-xs font-semibold text-[#20402e]">
              <div>
                <label className="block mb-1.5">Full Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Abebe Bekele"
                  value={newForm.displayName}
                  onChange={(e) => setNewForm({ ...newForm, displayName: e.target.value })}
                  className="w-full rounded-xl border border-[#d0ded0] px-3.5 py-2.5 text-xs font-normal text-[#163925] outline-none focus:border-[#1c573e]"
                />
              </div>

              <div>
                <label className="block mb-1.5">Specialty / Clinical Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pediatric Nutrition & Maternal Care"
                  value={newForm.specialty}
                  onChange={(e) => setNewForm({ ...newForm, specialty: e.target.value })}
                  className="w-full rounded-xl border border-[#d0ded0] px-3.5 py-2.5 text-xs font-normal text-[#163925] outline-none focus:border-[#1c573e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Assigned Operational Role</label>
                  <select
                    value={newForm.role}
                    onChange={(e) => setNewForm({ ...newForm, role: e.target.value as any })}
                    className="w-full rounded-xl border border-[#d0ded0] bg-white px-3 py-2.5 text-xs font-medium text-[#163925] outline-none focus:border-[#1c573e]"
                  >
                    <option value="clinician">Clinician (NCD / Medical)</option>
                    <option value="counselor">Counselor (Nutrition / Family)</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5">Initial Availability</label>
                  <select
                    value={newForm.availability}
                    onChange={(e) => setNewForm({ ...newForm, availability: e.target.value as any })}
                    className="w-full rounded-xl border border-[#d0ded0] bg-white px-3 py-2.5 text-xs font-medium text-[#163925] outline-none focus:border-[#1c573e]"
                  >
                    <option value="available">On Duty (Available)</option>
                    <option value="away">Away</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1.5">
                  Clerk User ID / Account Subject <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="user_2... or leave empty to auto-generate identifier"
                  value={newForm.clerkUserId}
                  onChange={(e) => setNewForm({ ...newForm, clerkUserId: e.target.value })}
                  className="w-full rounded-xl border border-[#d0ded0] px-3.5 py-2.5 text-xs font-normal text-[#163925] outline-none focus:border-[#1c573e]"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#edf3ed]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-full border border-[#d0ded0] px-4 py-2 text-xs font-semibold text-[#576b5d] hover:bg-[#f6f9f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#154631] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Add Member</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT STAFF MODAL --- */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#d9e3d9] bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-[#6b7e71] hover:bg-[#f1f6f1]"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-[#163826]">Edit Team Member Profile</h3>
            <p className="mt-1 text-xs text-[#697d6f]">
              Update credentials, specialty, role assignment, or activity status for {editingMember.displayName}.
            </p>

            <form onSubmit={handleUpdateMember} className="mt-5 space-y-4 text-xs font-semibold text-[#20402e]">
              <div>
                <label className="block mb-1.5">Full Name & Title</label>
                <input
                  type="text"
                  required
                  value={editingMember.displayName}
                  onChange={(e) => setEditingMember({ ...editingMember, displayName: e.target.value })}
                  className="w-full rounded-xl border border-[#d0ded0] px-3.5 py-2.5 text-xs font-normal text-[#163925] outline-none focus:border-[#1c573e]"
                />
              </div>

              <div>
                <label className="block mb-1.5">Specialty / Department</label>
                <input
                  type="text"
                  required
                  value={editingMember.specialty}
                  onChange={(e) => setEditingMember({ ...editingMember, specialty: e.target.value })}
                  className="w-full rounded-xl border border-[#d0ded0] px-3.5 py-2.5 text-xs font-normal text-[#163925] outline-none focus:border-[#1c573e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Role Assignment</label>
                  <select
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as any })}
                    className="w-full rounded-xl border border-[#d0ded0] bg-white px-3 py-2.5 text-xs font-medium text-[#163925] outline-none focus:border-[#1c573e]"
                  >
                    <option value="clinician">Clinician (NCD / Medical)</option>
                    <option value="counselor">Counselor (Nutrition / Family)</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5">Availability Status</label>
                  <select
                    value={editingMember.availability}
                    onChange={(e) => setEditingMember({ ...editingMember, availability: e.target.value as any })}
                    className="w-full rounded-xl border border-[#d0ded0] bg-white px-3 py-2.5 text-xs font-medium text-[#163925] outline-none focus:border-[#1c573e]"
                  >
                    <option value="available">On Duty (Available)</option>
                    <option value="away">Away</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-[#d0ded0] bg-[#f9faf7] p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMember.active}
                    onChange={(e) => setEditingMember({ ...editingMember, active: e.target.checked })}
                    className="size-4 rounded accent-[#1c573e]"
                  />
                  <div>
                    <span className="font-bold text-[#193a28]">Account Status: Active</span>
                    <p className="text-[10px] font-normal text-[#6f8374]">
                      Inactive members cannot receive new care triage assignments or access staff desks.
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#edf3ed]">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="rounded-full border border-[#d0ded0] px-4 py-2 text-xs font-semibold text-[#576b5d] hover:bg-[#f6f9f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#154631] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
