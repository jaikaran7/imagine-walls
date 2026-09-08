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
            <p className="text-[13px] font-medium text-[#6b7280]">Quotation value</p>
            <p className="mt-2 text-[1.75rem] font-semibold tracking-tight text-[#111318]">{formatCurrency(totalQuoted)}</p>
            <p className="mt-1.5 text-[13px] text-[#9ca3af]">From finalized quotations</p>
          </AdminCard>
          <AdminCard>
            <p className="text-[13px] font-medium text-[#6b7280]">Payments</p>
            <div className="mt-3 flex flex-wrap gap-8">
              <div>
                <p className="text-[1.75rem] font-semibold text-[#047857]">{formatCurrency(totalReceived)}</p>
                <p className="text-[13px] text-[#9ca3af]">Received</p>
              </div>
              <div>
                <p className="text-[1.75rem] font-semibold text-[#b45309]">{formatCurrency(totalPending)}</p>
                <p className="text-[13px] text-[#9ca3af]">Pending</p>
              </div>
            </div>
          </AdminCard>
        </div>

        {enquiries.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-semibold text-[#374151]">Recent leads</h2>
              <Link href="/admin/leads" className="text-[14px] font-medium text-[#2563eb] hover:underline">
                View all
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-[#e2e5ea] bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="border-b border-[#e2e5ea] bg-[#f9fafb] text-[13px] font-medium text-[#6b7280]">
                  <tr>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Project</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.slice(0, 5).map((e) => (
                    <tr key={e.id} className="border-b border-[#f3f4f6] last:border-0">
                      <td className="px-5 py-4 text-[15px] font-medium text-[#111318]">
                        <Link href="/admin/leads" className="hover:text-[#2563eb] hover:underline">
                          {e.name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-[15px] text-[#6b7280]">{e.projectType}</td>
                      <td className="px-5 py-4 text-[15px] text-[#6b7280]">{e.location}</td>
                      <td className="px-5 py-4 text-[15px] text-[#6b7280]">{e.status}</td>
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
