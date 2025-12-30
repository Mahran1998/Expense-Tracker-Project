import React, { useState } from "react";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ onCreate, loading }) {
  const [form, setForm] = useState({
    amount: "",
    currency: "HUF",
    date: todayISO(),
    vendor: "",
    category: "",
    costCenter: "",
    notes: "",
  });

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();

    const payload = {
      amount: Number(form.amount),
      currency: String(form.currency || "HUF").toUpperCase(),
      date: form.date,
      vendor: form.vendor.trim(),
      category: form.category.trim(),
      costCenter: form.costCenter.trim(),
      notes: form.notes.trim(),
    };

    await onCreate(payload);

    setForm((f) => ({
      ...f,
      amount: "",
      vendor: "",
      category: "",
      costCenter: "",
      notes: "",
    }));
  }

  const disabled =
    loading ||
    !form.amount ||
    !form.date ||
    !form.vendor.trim() ||
    !form.category.trim() ||
    !form.costCenter.trim();

  return (
    <div className="card">
      <div className="card-title">Add Expense</div>

      <form onSubmit={submit}>
        <div className="grid grid-3">
          <label className="field">
            <span>Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="e.g. 19.90"
            />
          </label>

          <label className="field">
            <span>Currency</span>
            <input
              value={form.currency}
              onChange={(e) => set("currency", e.target.value)}
              placeholder="HUF"
            />
          </label>

          <label className="field">
            <span>Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </label>
        </div>

        <div className="grid grid-3">
          <label className="field">
            <span>Vendor</span>
            <input
              value={form.vendor}
              onChange={(e) => set("vendor", e.target.value)}
              placeholder="e.g. Tesco"
            />
          </label>

          <label className="field">
            <span>Category</span>
            <input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Food"
            />
          </label>

          <label className="field">
            <span>Cost Center</span>
            <input
              value={form.costCenter}
              onChange={(e) => set("costCenter", e.target.value)}
              placeholder="e.g. Office"
            />
          </label>
        </div>

        <label className="field">
          <span>Notes (optional)</span>
          <input
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="e.g. Team lunch"
          />
        </label>

        <div className="actions">
          <button className="btn" type="submit" disabled={disabled}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
