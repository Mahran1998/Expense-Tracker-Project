# Business MVP — Expense Tracker (Small Business)

## Who this is for
Small business owners and managers who need:
- **Visibility** into spending (where money goes, by category/cost center/vendor)
- **Control** via an approval flow (reduce unauthorized expenses)
- **Faster month-end** reconciliation (clean records, searchable history)
- **Audit readiness** (who submitted, what changed, when)

## Primary user story
**Employee submits expense → Manager approves/rejects → Owner reviews dashboard/summary**

### Personas
- **Employee**: submits expenses with receipts/notes (receipt upload is out-of-scope in MVP).
- **Manager**: approves/rejects and requests fixes.
- **Owner/Finance**: views totals, trends, and monthly summary.

## MVP data fields (minimum)
Every expense record MUST contain:
- **amount** (number, > 0)
- **currency** (string, ISO-like e.g., HUF/EUR)
- **date** (YYYY-MM-DD)
- **vendor** (string)
- **category** (string)
- **costCenter** (string)
- **notes** (string, optional)
- **status** (enum: pending | approved | rejected)

System-managed fields:
- **id** (string)
- **createdAt** (timestamp)
- **updatedAt** (timestamp)

## MVP business rules
- New expenses start as **pending**
- Status transition rules (MVP):
  - pending → approved OR rejected
  - approved/rejected are final (no revert) *(can be changed later if needed)*
- Basic validation:
  - amount must be > 0
  - currency, date, vendor, category, costCenter are required
  - date should be a valid calendar date

## Acceptance checks (Definition of Done)
1. **Create** an expense
2. **List** expenses and filter by:
   - date range (from/to)
   - category
   - status
3. **Edit** an expense (MVP: allow edit only while status = pending)
4. **Approve / Reject** an expense (status update)
5. **Monthly summary** totals for a date range:
   - total amount (by currency)
   - breakdown by category
   - counts by status

## Out of scope (for later phases)
- Authentication/roles
- Receipt upload
- Multi-tenant (multiple companies)
- Export (CSV/PDF)
- Advanced analytics, budgets, alerts
