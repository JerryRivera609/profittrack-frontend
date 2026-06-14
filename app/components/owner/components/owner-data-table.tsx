export function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-slate-500">{eyebrow}</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-950">{title}</h3>
    </div>
  );
}

export function DataTable({
  emptyMessage,
  headers,
  rows,
}: {
  emptyMessage: string;
  headers: string[];
  rows: string[][];
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase text-slate-500"
                key={header}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr key={`${row.join("-")}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td
                  className="whitespace-nowrap px-3 py-3 text-slate-700"
                  key={`${cell}-${cellIndex}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
