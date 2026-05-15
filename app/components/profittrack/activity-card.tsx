import { ReceiptText } from "lucide-react";
import { transactions } from "../../data/dashboard";

export function ActivityCard() {
  return (
    <section className="rounded-[1.75rem] border border-white bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Actividad</p>
          <h2 className="text-xl font-semibold tracking-tight">
            Movimientos recientes
          </h2>
        </div>
        <ReceiptText className="size-5 text-slate-400" />
      </div>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3"
            key={transaction.name}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {transaction.name}
              </p>
              <p className="text-xs text-slate-500">{transaction.type}</p>
            </div>
            <p
              className={`text-sm font-semibold ${
                transaction.amount.startsWith("+")
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {transaction.amount}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
