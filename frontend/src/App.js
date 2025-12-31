import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  createExpense,
  getSummary,
  listExpenses,
  updateExpense,
  updateExpenseStatus,
} from "./api";

import Filters from "./components/Filters";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import SummaryCards from "./components/SummaryCards";
import Toast from "./components/Toast";

function firstDayOfMonthISO() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

export default function App() {
  const [filters, setFilters] = useState({
    from: firstDayOfMonthISO(),
    to: new Date().toISOString().slice(0, 10),
    category: "",
    status: "",
  });
  const [draftFilters, setDraftFilters] = useState(filters);

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [toast, setToast] = useState({ msg: "", type: "info" });

  const range = useMemo(() => ({ from: filters.from, to: filters.to }), [filters]);

  const toastTimer = useRef(null);

  function showToast(msg, type = "info") {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ msg: "", type: "info" }), 3000);
  }

  async function loadAll(active = filters) {
    setLoading(true);
    try {
      const [list, sum] = await Promise.all([
        listExpenses(active),
        getSummary(active.from, active.to),
      ]);
      setItems(list);
      setSummary(sum);
    } catch (e) {
      showToast(e.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll(filters);
    
  }, [filters.from, filters.to, filters.category, filters.status]);

  async function handleApply() {
    setFilters(draftFilters);
  }

  async function handleClear() {
    const cleared = { from: "", to: "", category: "", status: "" };
    setDraftFilters(cleared);
    setFilters(cleared);
  }

  async function handleCreate(payload) {
    setLoading(true);
    try {
      await createExpense(payload);
      showToast("Expense created", "success");
      await loadAll(filters);
    } catch (e) {
      showToast(e.message || "Create failed", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    setBusyId(id);
    try {
      await updateExpenseStatus(id, "approved");
      showToast("Approved", "success");
      await loadAll(filters);
    } catch (e) {
      showToast(e.message || "Approve failed", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id) {
    setBusyId(id);
    try {
      await updateExpenseStatus(id, "rejected");
      showToast("Rejected", "success");
      await loadAll(filters);
    } catch (e) {
      showToast(e.message || "Reject failed", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleEdit(id, patch) {
    setBusyId(id);
    try {
      await updateExpense(id, patch);
      showToast("Updated", "success");
      await loadAll(filters);
    } catch (e) {
      showToast(e.message || "Update failed", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Expense Tracker</h1>
          <div className="sub">
            One entrypoint: <span className="mono">:8080</span> (UI + <span className="mono">/api</span> proxy)
          </div>
        </div>

        <div className="header-right">
          <div className="badge" title="Data state">
            <span className={`dot ${loading ? "loading" : ""}`} />
            <span>{loading ? "Loading…" : "Ready"}</span>
          </div>

          <div className="badge" title="Current range">
            <span className="muted">Range</span>
            <span className="mono">
              {range.from || "—"} → {range.to || "—"}
            </span>
          </div>

          <button className="btn btn-primary" onClick={() => loadAll(filters)} disabled={loading}>
            Refresh
          </button>
        </div>
      </header>


      <main className="container">
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast({ msg: "", type: "info" })}
        />

        <SummaryCards summary={summary} />

        <Filters
          draft={draftFilters}
          setDraft={setDraftFilters}
          onApply={handleApply}
          onClear={handleClear}
          loading={loading}
        />

        <div className="grid grid-2">
          <ExpenseForm onCreate={handleCreate} loading={loading} />
          <div className="card">
            <div className="card-title">How to demo</div>
            <ol className="muted">
              <li>Create an expense (submitted)</li>
              <li>Filter by date/category/status</li>
              <li>Approve / Reject submitted expenses</li>
              <li>See summary cards update after actions</li>
            </ol>
          </div>
        </div>

        <ExpenseTable
          items={items}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
          busyId={busyId}
        />
      </main>

      <footer className="footer muted">
        Tip: Use <span className="mono">make up</span> for business-safe ports,{" "}
        <span className="mono">make up-dev</span> for debugging ports.
      </footer>
    </div>
  );
}
