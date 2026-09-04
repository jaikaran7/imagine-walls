export function Letterhead({ date }: { date?: string }) {
  return (
    <div className="border-b border-[#1a1a18] pb-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-display text-3xl font-medium tracking-tight">Imagine Walls</p>
          <p className="mt-1 text-sm text-[#5c5a54]">Interior Design Studio · Hyderabad</p>
          <p className="mt-3 text-xs text-[#8a8780]">
            +91 98765 43210 · hello@imaginewalls.in
            <br />
            Banjara Hills, Hyderabad, Telangana
          </p>
        </div>
        <div className="text-right text-xs text-[#8a8780]">
          <p className="font-medium uppercase tracking-[0.12em] text-[#1a1a18]">Quotation</p>
          {date && <p className="mt-2">{date}</p>}
        </div>
      </div>
    </div>
  );
}
