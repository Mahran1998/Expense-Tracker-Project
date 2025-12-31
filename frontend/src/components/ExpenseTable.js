import React, { useState } from "react";

function toISODate(d) {
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export default function ExpenseTable({
  items,
  onApprove,
  onReject,
  onEdit,
  busyId,
}) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    amount: "",
    currency: "",
    date: "",
    vendor: "",
    category: "",
    costCenter: "",
    notes: "",
  });

  function startEdit(x) {
    setEditingId(x._id);
    setDraft({
      amount: String(x.amount ?? ""),
      currency: String(x.currency ?? ""),
      date: toISODate(x.date),
      vendor: x.vendor ?? "",
      category: x.category ?? "",
      costCenter: x.costCenter ?? "",
      notes: x.notes ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id) {
    const patch = {
      amount: Number(draft.amount),
      currency: String(draft.currency || "HUF").toUpperCase(),
      date: draft.date,
      vendor: draft.vendor.trim(),
      category: draft.category.trim(),
      costCenter: draft.costCenter.trim(),
      notes: (draft.notes || "").trim(),
    };
    await onEdit(id, patch);
    setEditingId(null);
  }

  return (
    <div className="card">
      <div className="card-title">Expenses</div>

      {!items?.length ? (
        <div className="muted">No expenses found.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Cost center</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => {
                const isBusy = busyId === x._id;
                const canAct = x.status === "submitted";
                const isEditing = editingId === x._id;

                return (
                  <React.Fragment key={x._id}>
                    <tr>
                      <td className="mono">{toISODate(x.date)}</td>
                      <td>{x.vendor}</td>
                      <td>{x.category}</td>
                      <td>{x.costCenter}</td>
                      <td className="mono">
                        {Number(x.amount).toFixed(2)} {x.currency}
                      </td>
                      <td>
                        <span className={`pill pill-${x.status}`}>
                          {x.status}
                        </span>
                      </td>
                      <td className="right">
                        <div className="row-actions">
                          <button
                            className="btn btn-ghost"
                            onClick={() => startEdit(x)}
                            disabled={!canAct || isBusy}
                            title={!canAct ? "Only submitted expenses are editable" : ""}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-primary"
                            onClick={() => onApprove(x._id)}
                            disabled={!canAct || isBusy}
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() => onReject(x._id)}
                            disabled={!canAct || isBusy}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isEditing && (
                      <tr className="edit-row">
                        <td colSpan={7}>
                          <div className="edit-panel">
                            <div className="grid grid-3">
                              <label className="field">
                                <span>Amount</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={draft.amount}
                                  onChange={(e) =>
                                    setDraft((d) => ({
                                      ...d,
                                      amount: e.target.value,
                                    }))
                                  }
                                />
                              </label>

                              <label className="field">
                                <span>Currency</span>
                                <input
                                  value={draft.currency}
                                  onChange={(e) =>
                                    setDraft((d) => ({
                                      ...d,
                                      currency: e.target.value,
                                    }))
                                  }
                                />
                              </label>

                              <label className="field">
                                <span>Date</span>
                                <input
                                  type="date"
                                  value={draft.date}
                                  onChange={(e) =>
                                    setDraft((d) => ({
                                      ...d,
                                      date: e.target.value,
                                    }))
                                  }
                                />
                              </label>
                            </div>

                            <div className="grid grid-3">
                              <label className="field">
                                <span>Vendor</span>
                                <input
                                  value={draft.vendor}
                                  onChange={(e) =>
                                    setDraft((d) => ({
                                      ...d,
                                      vendor: e.target.value,
                                    }))
                                  }
                                />
                              </label>

                              <label className="field">
                                <span>Category</span>
                                <input
                                  value={draft.category}
                                  onChange={(e) =>
                                    setDraft((d) => ({
                                      ...d,
                                      category: e.target.value,
                                    }))
                                  }
                                />
                              </label>

                              <label className="field">
                                <span>Cost center</span>
                                <input
                                  value={draft.costCenter}
                                  onChange={(e) =>
                                    setDraft((d) => ({
                                      ...d,
                                      costCenter: e.target.value,
                                    }))
                                  }
                                />
                              </label>
                            </div>

                            <label className="field">
                              <span>Notes</span>
                              <input
                                value={draft.notes}
                                onChange={(e) =>
                                  setDraft((d) => ({
                                    ...d,
                                    notes: e.target.value,
                                  }))
                                }
                              />
                            </label>

                            <div className="actions">
                              <button
                                className="btn btn-primary"
                                onClick={() => saveEdit(x._id)}
                                disabled={isBusy}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-ghost"
                                onClick={cancelEdit}
                                disabled={isBusy}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
