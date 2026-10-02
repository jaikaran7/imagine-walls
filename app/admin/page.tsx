import Link from "next/link";
import { AdminCard, AdminContent, AdminPageHeader, StatCard } from "@/components/admin/admin-shell";
import { formatCurrency, invoiceGrandTotal, sumPayments } from "@/lib/admin/format";
import { getAdminProjects, getEnquiries, getInvoices, getQuotations } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [enquiries, projects, quotations, invoices] = await Promise.all([
    getEnquiries(),
    getAdminProjects(),
    getQuotations(),
    getInvoices(),
  ]);

  const newLeads = enquiries.filter((e) => e.status === "New").length;
  const draftQuotations = quotations.filter((q) => q.status === "draft").length;
  const totalQuoted = quotations
    .filter((q) => q.status === "finalized")
    .reduce((sum, q) => sum + q.totalAmount, 0);
  const totalReceived = invoices.reduce((sum, inv) => sum + sumPayments(inv.payments), 0);
  const totalPending = invoices.reduce(
    (sum, inv) =>
      sum +
      Math.max(
        0,
        invoiceGrandTotal(inv.totalAmount, inv.discountType, inv.discountValue) -
          sumPayments(inv.payments),
      ),
    0,
  );

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Your studio at a glance — leads, projects, quotations, and invoices."
      />
      <AdminContent>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard href="/admin/leads" label="Total leads" value={enquiries.length} hint={`${newLeads} new`} />
          <StatCard href="/admin/projects" label="Portfolio projects" value={projects.length} />
          <StatCard
            href="/admin/quotations"
            label="Quotations"
            value={quotations.length}
            hint={`${draftQuotations} drafts`}
          />
          <StatCard href="/admin/invoices" label="Active invoices" value={invoices.length} />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <AdminCard>
            <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#475569]">Quotation value</p>
            <p className="mt-2 text-[1.85rem] font-bold tracking-tight text-[#0f172a]">{formatCurrency(totalQuoted)}</p>
            <p className="mt-1.5 text-[13px] font-medium text-[#64748b]">From finalized quotations</p>
          </AdminCard>
          <AdminCard>
            <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#475569]">Payments</p>
            <div className="mt-3 flex flex-wrap gap-8">
              <div>
                <p className="text-[1.85rem] font-bold text-[#047857]">{formatCurrency(totalReceived)}</p>
                <p className="mt-1 text-[13px] font-bold text-[#64748b]">Received</p>
              </div>
              <div>
                <p className="text-[1.85rem] font-bold text-[#b45309]">{formatCurrency(totalPending)}</p>
                <p className="mt-1 text-[13px] font-bold text-[#64748b]">Pending</p>
              </div>
            </div>
          </AdminCard>
        </div>

        {enquiries.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-bold text-[#0f172a]">Recent leads</h2>
              <Link href="/admin/leads" className="text-[14px] font-bold text-[#2563eb] hover:underline">
                View all leads →
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white shadow-xs">
              <table className="w-full min-w-[520px] text-left">
                <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[13px] font-bold uppercase tracking-[0.06em] text-[#475569]">
                  <tr>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Project</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.slice(0, 5).map((e) => (
                    <tr key={e.id} className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc]">
                      <td className="px-5 py-4 text-[15px] font-bold text-[#0f172a]">
                        <Link href="/admin/leads" className="hover:text-[#2563eb] hover:underline">
                          {e.name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-[15px] font-medium text-[#334155]">{e.projectType}</td>
                      <td className="px-5 py-4 text-[15px] font-medium text-[#334155]">{e.location}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-md bg-[#eff6ff] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em] text-[#1d4ed8] border border-[#bfdbfe]">
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AdminContent>
    </>
  );
}
