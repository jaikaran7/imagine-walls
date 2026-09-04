import { AdminContent, AdminPageHeader } from "@/components/admin/admin-shell";

export function AdminMissingDatabase() {
  return (
    <>
      <AdminPageHeader
        title="Database not configured"
        description="Production is missing DATABASE_URL, so admin cannot load data yet."
      />
      <AdminContent>
        <div className="max-w-2xl rounded-2xl border border-[#fca5a5] bg-[#fef2f2] p-6 text-[#7f1d1d]">
          <p className="text-[16px] font-bold">Add these environment variables in Vercel</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] font-medium leading-relaxed">
            <li>
              Open{" "}
              <a
                className="underline"
                href="https://vercel.com/jaikarans-projects-d6e8d93f/imagine-walls/settings/environment-variables"
                target="_blank"
                rel="noreferrer"
              >
                Project → Settings → Environment Variables
              </a>
            </li>
            <li>
              Add for <strong>Production</strong> and <strong>Preview</strong>:
              <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-[13px] text-[#991b1b]">
                <li>DATABASE_URL</li>
                <li>DIRECT_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
              Use the same values from your local <span className="font-mono">.env.local</span>.
            </li>
            <li>Redeploy the latest production deployment (Deployments → ⋯ → Redeploy).</li>
          </ol>
        </div>
      </AdminContent>
    </>
  );
}
