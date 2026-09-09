"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  AdminButton,
  AdminLinkButton,
  AdminSelect,
  EmptyState,
  StatusBadge,
} from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { formatDateTime } from "@/lib/admin/format";
import type { Enquiry, EnquiryStatus } from "@/lib/admin/types";

const statuses: EnquiryStatus[] = ["New", "Contacted", "Qualified", "Closed"];

export function LeadsPanel({ initialLeads }: { initialLeads: Enquiry[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const closeConfirm = useCallback(() => {
    if (!busy) setPendingId(null);
  }, [busy]);

  async function updateStatus(id: string, status: EnquiryStatus) {
    const res = await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) return;
    const updated = (await res.json()) as Enquiry;
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    if (selected?.id === id) setSelected(updated);
    startTransition(() => router.refresh());
  }

  async function confirmRemove() {
    if (!pendingId || busy) return;
    const id = pendingId;
    const prev = leads;
    setBusy(true);
    setLeads((l) => l.filter((x) => x.id !== id));
    if (selected?.id === id) setSelected(null);
    const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setLeads(prev);
      return;
    }
    setPendingId(null);
    startTransition(() => router.refresh());
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads yet"
        description="When someone fills out the contact form on the website, their enquiry will appear here."
        action={
          <AdminLinkButton href="/contact" variant="secondary">
            Open contact form
          </AdminLinkButton>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#d7dde8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="border-b border-[#d7dde8] bg-[#f1f5f9] text-[13px] font-bold uppercase tracking-[0.06em] text-[#475569]">
              <tr>
                <th className="px-4 py-3.5 sm:px-5">Name</th>
                <th className="px-4 py-3.5 sm:px-5">Phone</th>
                <th className="px-4 py-3.5 sm:px-5">Project type</th>
                <th className="px-4 py-3.5 sm:px-5">Submitted</th>
                <th className="px-4 py-3.5 sm:px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className={`cursor-pointer border-b border-[#e2e8f0] transition-colors last:border-0 hover:bg-[#f8fafc] ${selected?.id === lead.id ? "bg-[#eff6ff]" : ""}`}
                >
                  <td className="px-4 py-4 text-[15px] font-bold text-[#0f172a] sm:px-5">{lead.name}</td>
                  <td className="px-4 py-4 text-[15px] font-medium text-[#334155] sm:px-5">{lead.phone}</td>
                  <td className="px-4 py-4 text-[15px] font-medium text-[#334155] sm:px-5">{lead.projectType}</td>
                  <td className="px-4 py-4 text-[14px] font-medium text-[#64748b] sm:px-5">{formatDateTime(lead.submittedAt)}</td>
                  <td className="px-4 py-4 sm:px-5">
                    <StatusBadge status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <aside className="w-full shrink-0 rounded-2xl border border-[#d7dde8] bg-white p-5 shadow-sm lg:w-96 lg:p-6">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[1.25rem] font-semibold text-[#111318]">{selected.name}</h2>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg p-1 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#111318]"
            >
              ×
            </button>
          </div>

          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-[13px] font-medium text-[#6b7280]">Phone</dt>
              <dd className="mt-1 text-[15px] text-[#111318]">{selected.phone}</dd>
            </div>
            {selected.email && (
              <div>
                <dt className="text-[13px] font-medium text-[#6b7280]">Email</dt>
                <dd className="mt-1 text-[15px] text-[#111318]">{selected.email}</dd>
              </div>
            )}
            <div>
              <dt className="text-[13px] font-medium text-[#6b7280]">Location</dt>
              <dd className="mt-1 text-[15px] text-[#111318]">{selected.location}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium text-[#6b7280]">Project type</dt>
              <dd className="mt-1 text-[15px] text-[#111318]">{selected.projectType}</dd>
            </div>
            {selected.projectSize && (
              <div>
                <dt className="text-[13px] font-medium text-[#6b7280]">Size</dt>
                <dd className="mt-1 text-[15px] text-[#111318]">{selected.projectSize}</dd>
              </div>
            )}
            {selected.budgetRange && (
              <div>
                <dt className="text-[13px] font-medium text-[#6b7280]">Budget</dt>
                <dd className="mt-1 text-[15px] text-[#111318]">{selected.budgetRange}</dd>
              </div>
            )}
            {selected.timeline && (
              <div>
                <dt className="text-[13px] font-medium text-[#6b7280]">Timeline</dt>
                <dd className="mt-1 text-[15px] text-[#111318]">{selected.timeline}</dd>
              </div>
            )}
            {selected.message && (
              <div>
                <dt className="text-[13px] font-medium text-[#6b7280]">Message</dt>
                <dd className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-[#6b7280]">
                  {selected.message}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-6">
            <AdminSelect
              label="Status"
              value={selected.status}
              onChange={(e) => updateStatus(selected.id, e.target.value as EnquiryStatus)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </AdminSelect>
          </div>

          <div className="mt-5">
            <AdminButton variant="danger" onClick={() => setPendingId(selected.id)}>
              Delete lead
            </AdminButton>
          </div>
        </aside>
      )}

      <ConfirmDialog
        open={pendingId !== null}
        title="Delete this lead?"
        description={
          pendingId
            ? `“${leads.find((l) => l.id === pendingId)?.name ?? selected?.name ?? "This lead"}” will be permanently removed.`
            : "This lead will be permanently removed."
        }
        confirmLabel="Delete lead"
        busy={busy}
        onCancel={closeConfirm}
        onConfirm={confirmRemove}
      />
    </div>
  );
}
