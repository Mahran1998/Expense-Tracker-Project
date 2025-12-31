import React from "react";

export default function Filters({ draft, setDraft, onApply, onClear, loading }) {
  return (
    <div className="card">
      <div className="card-title">Filters</div>

      <div className="grid grid-4">
        <label className="field">
          <span>From</span>
          <input
            type="date"
            value={draft.from || ""}
            onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
          />
        </label>

        <label className="field">
          <span>To</span>
          <input
            type="date"
            value={draft.to || ""}
            onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
          />
        </label>

        <label className="field">
          <span>Category</span>
          <input
            placeholder="e.g. Food"
            value={draft.category || ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, category: e.target.value }))
            }
          />
        </label>

        <label className="field">
          <span>Status</span>
          <select
            value={draft.status || ""}
            onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
          >
            <option value="">All</option>
            <option value="submitted">submitted</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>
        </label>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={onApply} disabled={loading}>
          Apply
        </button>
        <button className="btn btn-ghost" onClick={onClear} disabled={loading}>
          Clear
        </button>
      </div>
    </div>
  );
}
