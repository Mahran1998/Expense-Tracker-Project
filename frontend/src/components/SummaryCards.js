import React, { useMemo } from "react";

function money(n) {
  const x = Number(n || 0);
  return x.toFixed(2);
}

export default function SummaryCards({ summary }) {
  const topCategories = useMemo(() => {
    if (!summary?.byCategory) return [];
    // flatten then sort by total desc
    return [...summary.byCategory]
      .map((x) => ({
        currency: x._id.currency,
        category: x._id.category,
        total: x.total,
        count: x.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [summary]);

  return (
    <div className="grid grid-3">
      <div className="card">
        <div className="card-title">Totals</div>
        {summary?.totals?.length ? (
          <ul className="list">
            {summary.totals.map((t) => (
              <li key={t._id} className="list-row">
                <span>{t._id}</span>
                <span className="mono">
                  {money(t.total)} ({t.count})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="muted">No data</div>
        )}
      </div>

      <div className="card">
        <div className="card-title">By status</div>
        {summary?.byStatus?.length ? (
          <ul className="list">
            {summary.byStatus.map((s) => (
              <li key={s._id} className="list-row">
                <span>{s._id}</span>
                <span className="mono">
                  {money(s.total)} ({s.count})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="muted">No data</div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Top categories</div>
        {topCategories.length ? (
          <ul className="list">
            {topCategories.map((c, idx) => (
              <li key={`${c.currency}-${c.category}-${idx}`} className="list-row">
                <span>
                  {c.category} <span className="muted">({c.currency})</span>
                </span>
                <span className="mono">{money(c.total)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="muted">No data</div>
        )}
      </div>
    </div>
  );
}
