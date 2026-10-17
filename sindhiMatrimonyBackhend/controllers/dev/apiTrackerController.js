import {
  devMetricsStore,
  getMetricsStore,
  getMetricsSummary,
  clearMetricsStore,
} from "../../middlewares/devPerformanceTracker.js";
import { NOT_FOUND, HTTP_NOT_FOUND, OK, HTTP_OK, ERROR_FALSE, ERROR_TRUE, DATA_NULL } from "../../utils/constants.js";

/**
 * Controller: Dev API Performance Tracker
 * Exposes real-time API latency, DB query counts, and request profiling.
 * 🛑 Strictly forbidden in production (returns 404).
 */

export const getApiMetricsJson = (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({
      message: `API endpoint '${req.originalUrl}' not found.`,
      code: NOT_FOUND,
      error: ERROR_TRUE,
      data: DATA_NULL,
    });
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
  const slowOnly = req.query.slowOnly === "true" || req.query.slowOnly === "1";

  const summary = getMetricsSummary();
  const entries = getMetricsStore(limit, slowOnly);

  return res.status(200).json({
    message: "Development performance metrics retrieved successfully.",
    code: OK,
    error: ERROR_FALSE,
    data: {
      summary,
      count: entries.length,
      entries,
    },
  });
};

export const clearApiMetrics = (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({
      message: `API endpoint '${req.originalUrl}' not found.`,
      code: NOT_FOUND,
      error: ERROR_TRUE,
      data: DATA_NULL,
    });
  }

  clearMetricsStore();

  return res.status(200).json({
    message: "Performance metrics buffer cleared successfully.",
    code: OK,
    error: ERROR_FALSE,
    data: DATA_NULL,
  });
};

export const getApiTrackerDashboardHtml = (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({
      message: `API endpoint '${req.originalUrl}' not found.`,
      code: NOT_FOUND,
      error: ERROR_TRUE,
      data: DATA_NULL,
    });
  }

  const summary = getMetricsSummary();
  const entries = getMetricsStore(100, false);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sindhi Matrimony - Dev API Latency & Query Profiler</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: rgba(18, 24, 38, 0.85);
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --cyan: #06b6d4;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Outfit', -apple-system, sans-serif;
      min-height: 100vh;
      padding: 24px;
      line-height: 1.5;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
    }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand-badge {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      padding: 8px 14px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
    }
    h1 { font-size: 24px; font-weight: 700; }
    .subtitle { color: var(--text-muted); font-size: 14px; margin-top: 2px; }
    .actions { display: flex; gap: 10px; }
    button {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text);
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    button:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); }
    button.btn-primary { background: var(--primary); border: none; }
    button.btn-primary:hover { background: var(--primary-hover); }
    button.btn-danger { color: var(--danger); }
    button.btn-danger:hover { background: rgba(239, 68, 68, 0.15); border-color: var(--danger); }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(12px);
      border-radius: 14px;
      padding: 18px;
      position: relative;
      overflow: hidden;
    }
    .stat-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
    .stat-value { font-size: 28px; font-weight: 700; margin-top: 6px; }
    .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

    .panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(12px);
      border-radius: 14px;
      overflow: hidden;
    }
    .panel-header {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--card-border);
      flex-wrap: wrap;
      gap: 12px;
    }
    .filters { display: flex; gap: 8px; align-items: center; }
    input.search-box {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid var(--card-border);
      color: var(--text);
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 13px;
      outline: none;
      min-width: 240px;
    }
    input.search-box:focus { border-color: var(--primary); }
    
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th {
      text-align: left;
      padding: 12px 18px;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid var(--card-border);
    }
    td {
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
    }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }
    
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }
    .badge-get { background: rgba(6, 182, 212, 0.15); color: var(--cyan); }
    .badge-post { background: rgba(16, 185, 129, 0.15); color: var(--success); }
    .badge-put, .badge-patch { background: rgba(245, 158, 11, 0.15); color: var(--warning); }
    .badge-delete { background: rgba(239, 68, 68, 0.15); color: var(--danger); }
    
    .status-pill {
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }
    .status-2xx { color: var(--success); }
    .status-3xx { color: var(--cyan); }
    .status-4xx { color: var(--warning); }
    .status-5xx { color: var(--danger); }

    .time-fast { color: var(--success); font-weight: 600; font-family: 'JetBrains Mono', monospace; }
    .time-medium { color: var(--warning); font-weight: 600; font-family: 'JetBrains Mono', monospace; }
    .time-slow { color: var(--danger); font-weight: 700; font-family: 'JetBrains Mono', monospace; }

    .url-cell { font-family: 'JetBrains Mono', monospace; font-size: 12px; max-width: 340px; word-break: break-all; }
    .query-count {
      background: rgba(255, 255, 255, 0.05);
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
    }
    .flamegraph {
      margin-top: 6px;
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
      background: rgba(0, 0, 0, 0.3);
      padding: 8px 12px;
      border-radius: 6px;
      display: none;
    }
    .toggle-queries {
      cursor: pointer;
      text-decoration: underline;
      font-size: 11px;
      color: var(--primary);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="brand-badge">DEV PROFILER</div>
        <div>
          <h1>API Performance & Query Latency Tracker</h1>
          <div class="subtitle">Real-time HTTP timing, payload tracking, and MongoDB flamegraphs (dev only)</div>
        </div>
      </div>
      <div class="actions">
        <button id="btnRefresh" onclick="window.location.reload()">🔄 Refresh</button>
        <button id="btnAutoRefresh" onclick="toggleAutoRefresh()">⏱️ Auto: OFF</button>
        <button class="btn-danger" onclick="clearMetrics()">🗑️ Clear Store</button>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Requests</div>
        <div class="stat-value" id="statTotal">${summary.totalRequests}</div>
        <div class="stat-sub">Buffer: ${entries.length}/500 entries</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Response Time</div>
        <div class="stat-value time-fast" id="statAvg">${summary.avgDurationMs} <span style="font-size: 16px;">ms</span></div>
        <div class="stat-sub">Target SLA: &lt; 50ms</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">p95 Latency</div>
        <div class="stat-value ${summary.p95DurationMs > 50 ? 'time-medium' : 'time-fast'}" id="statP95">${summary.p95DurationMs} <span style="font-size: 16px;">ms</span></div>
        <div class="stat-sub">p99: ${summary.p99DurationMs}ms</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Slow Requests (&gt;50ms)</div>
        <div class="stat-value ${summary.slowRequestsCount > 0 ? 'time-slow' : 'time-fast'}" id="statSlow">${summary.slowRequestsCount}</div>
        <div class="stat-sub">${summary.errorCount} total errors</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Heap Memory</div>
        <div class="stat-value" id="statHeap">${summary.memoryHeapMB} <span style="font-size: 16px;">MB</span></div>
        <div class="stat-sub">Uptime: ${summary.uptimeSeconds}s</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div style="font-weight: 600; font-size: 15px;">Recent Captured Requests</div>
        <div class="filters">
          <input type="text" class="search-box" id="searchInput" placeholder="Filter by endpoint or method..." onkeyup="filterTable()">
          <button id="btnSlowOnly" onclick="toggleSlowOnly()">⚠️ Slow Only (&gt;50ms)</button>
        </div>
      </div>
      <div style="overflow-x: auto;">
        <table id="requestsTable">
          <thead>
            <tr>
              <th>Method</th>
              <th>Status</th>
              <th>Endpoint</th>
              <th>Total Duration</th>
              <th>DB Latency</th>
              <th>Queries</th>
              <th>Payloads</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${entries.length === 0 ? '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px;">No requests recorded yet. Make API calls to populate this feed.</td></tr>' : ''}
            ${entries.map(entry => {
              const statusClass = entry.statusCode >= 500 ? 'status-5xx' : entry.statusCode >= 400 ? 'status-4xx' : entry.statusCode >= 300 ? 'status-3xx' : 'status-2xx';
              const timeClass = entry.durationMs > 100 ? 'time-slow' : entry.durationMs > 50 ? 'time-medium' : 'time-fast';
              const methodClass = `badge-${entry.method.toLowerCase()}`;
              return `
              <tr data-url="${entry.url.toLowerCase()}" data-method="${entry.method.toLowerCase()}" data-duration="${entry.durationMs}">
                <td><span class="badge ${methodClass}">${entry.method}</span></td>
                <td><span class="status-pill ${statusClass}">${entry.statusCode}</span></td>
                <td class="url-cell">${entry.url}</td>
                <td class="${timeClass}">${entry.durationMs}ms</td>
                <td class="stat-sub">${entry.dbTimeMs}ms</td>
                <td>
                  <span class="query-count">${entry.dbQueryCount} DB</span>
                  ${entry.queries && entry.queries.length > 0 ? `
                    <span class="toggle-queries" onclick="toggleDetails('${entry.id}')">View</span>
                    <div id="details-${entry.id}" class="flamegraph">
                      ${entry.queries.map(q => `<div>• <b>${q.collection}.${q.op}()</b>: ${q.durationMs}ms</div>`).join('')}
                    </div>
                  ` : ''}
                </td>
                <td class="stat-sub">Req: ${(entry.requestPayloadBytes / 1024).toFixed(1)}K / Res: ${(entry.responsePayloadBytes / 1024).toFixed(1)}K</td>
                <td class="stat-sub">${new Date(entry.timestamp).toLocaleTimeString()}</td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    let autoRefreshInterval = null;
    let slowOnly = false;

    function toggleAutoRefresh() {
      const btn = document.getElementById('btnAutoRefresh');
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        btn.textContent = '⏱️ Auto: OFF';
      } else {
        autoRefreshInterval = setInterval(() => window.location.reload(), 3000);
        btn.textContent = '⏱️ Auto: ON (3s)';
      }
    }

    function toggleSlowOnly() {
      slowOnly = !slowOnly;
      const btn = document.getElementById('btnSlowOnly');
      btn.style.background = slowOnly ? 'var(--warning)' : '';
      btn.style.color = slowOnly ? '#000' : '';
      filterTable();
    }

    function toggleDetails(id) {
      const el = document.getElementById('details-' + id);
      if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }

    function filterTable() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const rows = document.querySelectorAll('#requestsTable tbody tr');
      rows.forEach(row => {
        const url = row.getAttribute('data-url') || '';
        const method = row.getAttribute('data-method') || '';
        const duration = parseFloat(row.getAttribute('data-duration') || '0');
        
        const matchesQuery = url.includes(query) || method.includes(query);
        const matchesSlow = !slowOnly || duration >= 50;

        row.style.display = matchesQuery && matchesSlow ? '' : 'none';
      });
    }

    async function clearMetrics() {
      if (confirm('Clear the performance metrics buffer?')) {
        await fetch('/dev/metrics', { method: 'DELETE' });
        window.location.reload();
      }
    }
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
};

export default {
  getApiMetricsJson,
  clearApiMetrics,
  getApiTrackerDashboardHtml,
};
