"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  UserCheck,
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
  Power,
  RotateCw,
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

export function AdminStaffRoster({
  teamMembers,
}: {
  teamMembers: TeamMemberItem[];
}) {
  const createMember = useMutation(anyApi.staff.createTeamMember);
  const updateMember = useMutation(anyApi.staff.updateTeamMember);
  const removeMember = useMutation(anyApi.staff.removeTeamMember);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "clinician" | "counselor" | "admin">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [newForm, setNewForm] = useState<NewMemberForm>(emptyNewMemberForm);

  // Operation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; error?: boolean } | null>(null);

  function notify(text: string, error = false) {
    setActionMessage({ text, error });
    setTimeout(() => setActionMessage(null), 4500);
  }

  // Filtered members list
  const filteredMembers = teamMembers.filter((m) => {
    if (roleFilter !== "all" && m.role !== roleFilter) return false;
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

  // Action handlers
  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newForm.displayName.trim() || !newForm.specialty.trim()) {
      notify("Please provide both name and clinical specialty.", true);
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
      notify(`Staff member ${newForm.displayName} created successfully.`);
      setShowAddModal(false);
      setNewForm(emptyNewMemberForm);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to create team member.", true);
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

  async function handleToggleActive(member: TeamMemberItem) {
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
      notify(`${member.displayName} availability marked as ${nextAvailability}.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not toggle availability.", true);
    }
  }

  async function handleDeleteMember(member: TeamMemberItem) {
    if (!window.confirm(`Are you sure you want to remove ${member.displayName} from the staff directory?`)) {
      return;
    }
    try {
      await removeMember({ profileId: member._id as any });
      notify(`Staff profile for ${member.displayName} removed.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not remove staff profile.", true);
    }
  }

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
    <>
      <Card>
        <CardHeader className="border-b border-[#eef2ea] pb-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <CardTitle>Staff & Practitioner Directory</CardTitle>
              <CardDescription>
                Full CRUD control of clinical practitioners, health counselors, and administrators
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-full bg-[#1c573e] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#154631] active:scale-95"
              >
                <Plus size={14} />
                <span>Add Staff Member</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {actionMessage && (
            <div
              className={`mt-3 flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-semibold ${
                actionMessage.error
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              }`}
            >
              {actionMessage.error ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Search and Filters Toolbar */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#839688]"
              />
              <input
                type="text"
                placeholder="Search by name, specialty, or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#d2ddd0] bg-white py-2 pl-9 pr-4 text-xs font-medium text-[#1c3a2a] placeholder-[#8a9d8f] focus:border-[#1c573e] focus:outline-hidden"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 rounded-full border border-[#d2ddd0] bg-white p-1 text-xs">
              <button
                onClick={() => setRoleFilter("all")}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  roleFilter === "all" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
                }`}
              >
                All ({teamMembers.length})
              </button>
              <button
                onClick={() => setRoleFilter("clinician")}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  roleFilter === "clinician" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
                }`}
              >
                Clinicians
              </button>
              <button
                onClick={() => setRoleFilter("counselor")}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  roleFilter === "counselor" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
                }`}
              >
                Counselors
              </button>
              <button
                onClick={() => setRoleFilter("admin")}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  roleFilter === "admin" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
                }`}
              >
                Admins
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-full border border-[#d2ddd0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#294a37] focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#eef2ea] bg-[#f9faf7] text-[11px] font-bold uppercase tracking-wider text-[#687d6f]">
                <tr>
                  <th className="px-6 py-3.5">Name & Identity</th>
                  <th className="px-6 py-3.5">Assigned Role</th>
                  <th className="px-6 py-3.5">Specialty</th>
                  <th className="px-6 py-3.5">Availability</th>
                  <th className="px-6 py-3.5">Open Caseload</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4ee]">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#718476]">
                      No staff members match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member._id} className="transition hover:bg-[#f6f9f5]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 place-items-center rounded-full bg-[#e8efe6] font-bold text-[#1c573e]">
                            {member.displayName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#193a27]">{member.displayName}</p>
                            <p className="text-[10px] text-[#788a7c]">
                              {member.clerkUserId ? `ID: ${member.clerkUserId.slice(0, 14)}...` : "Directory Member"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {getRoleIcon(member.role)}
                          {getRoleBadge(member.role)}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#4b6051]">
                        {member.specialty || "Public Health Practice"}
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#193b28]">
                            {member.openRequestCount}
                          </span>
                          <span className="text-[11px] text-[#718476]">cases</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingMember(member)}
                            title="Edit Staff Member"
                            className="grid size-7 place-items-center rounded-lg border border-[#d2ddd0] bg-white text-[#455c4d] hover:bg-[#edf4ec] hover:text-[#183925]"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member)}
                            title="Remove Member"
                            className="grid size-7 place-items-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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

            <h3 className="text-xl font-bold text-[#163826]">Add Staff Member</h3>
            <p className="mt-1 text-xs text-[#697d6f]">
              Provision a new clinical practitioner, counselor, or system administrator.
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
                <label className="block mb-1.5">Specialty / Department</label>
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
                  <label className="block mb-1.5">Operational Role</label>
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

            <h3 className="text-xl font-bold text-[#163826]">Edit Staff Profile</h3>
            <p className="mt-1 text-xs text-[#697d6f]">
              Update credentials, role assignment, or activity status for {editingMember.displayName}.
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
                  <label className="block mb-1.5">Role</label>
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
                  <label className="block mb-1.5">Availability</label>
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
                      Inactive members are barred from accepting new care triage cases.
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
    </>
  );
}
