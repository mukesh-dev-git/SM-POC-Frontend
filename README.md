<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,100:84CC16&height=200&section=header&text=Smart%20Meter%20Dashboard&fontSize=44&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=React%20%C2%B7%20Vite%20%C2%B7%20Chart.js%20%C2%B7%20LoRa%20RSSI&descAlignY=58&descSize=18" width="100%" alt="Smart Meter Dashboard banner"/>

<a href="#-how-it-works"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1200&color=84CC16&center=true&vCenter=true&width=720&lines=Live+voltage%2C+current%2C+power+and+energy;LoRa+signal+gauge+and+rule-based+alerts;Anomaly+and+forecast+charts+with+a+Gemini+summary;CSV+export+%C2%B7+Sep+2025" alt="Typing summary"/></a>

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](src/main.jsx)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](vite.config.js)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white)](src/components)
[![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white)](src/main.jsx)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](vercel.json)
<br/>
[![Status](https://img.shields.io/badge/Status-Prototype%20%C2%B7%20offline-F97316)](#-status-and-known-limitations)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

</div>

---

## <img src="https://api.iconify.design/lucide/target.svg?color=%2384CC16" width="26" align="top" alt=""/> Project Overview

The web dashboard of a smart-meter proof of concept (September 2025). It polls the API in [SM-POC-Backend](https://github.com/mukesh-dev-git/SM-POC-Backend) every 5 seconds and shows the latest voltage, current, power and energy, charts of the last 50 readings, the LoRa signal strength and a few threshold alerts. A second page shows anomaly and forecast charts and an AI-written summary produced by the backend.

### Key Features

- <img src="https://api.iconify.design/lucide/gauge.svg?color=%2384CC16" width="18" align="top" alt=""/> **Live metrics**: four cards (V, A, W, Wh) and four line charts, refreshed every 5 seconds.
- <img src="https://api.iconify.design/lucide/signal.svg?color=%230EA5E9" width="18" align="top" alt=""/> **RSSI gauge**: half-doughnut from -120 to -30 dBm, green above -65, amber above -80, red below.
- <img src="https://api.iconify.design/lucide/bell-ring.svg?color=%23F59E0B" width="18" align="top" alt=""/> **Automated alerts**: low voltage (below 215 V), high current (above 10 A) and weak LoRa signal (below -85 dBm), checked in the browser against the latest reading.
- <img src="https://api.iconify.design/lucide/triangle-alert.svg?color=%23EF4444" width="18" align="top" alt=""/> **Anomalies**: power over the last 24 hours with detected spikes marked as points.
- <img src="https://api.iconify.design/lucide/trending-up.svg?color=%2310B981" width="18" align="top" alt=""/> **Forecast**: last 6 hours of power followed by the predicted values as a dashed line.
- <img src="https://api.iconify.design/lucide/sparkles.svg?color=%238E75B2" width="18" align="top" alt=""/> **Gemini summary**: the backend's text shown at the top of the analytics page.
- <img src="https://api.iconify.design/lucide/download.svg?color=%2364748B" width="18" align="top" alt=""/> **CSV export**: pick a date range and download the matching readings with PapaParse.

## <img src="https://api.iconify.design/lucide/network.svg?color=%2384CC16" width="26" align="top" alt=""/> How It Works

```mermaid
flowchart LR
    B[Browser<br/>React SPA] -->|"GET /data every 5 s"| API[SM-POC-Backend<br/>VITE_API_BASE_URL]
    B -->|"/analytics: GET /api/anomalies,<br/>/api/forecast, /api/summary"| API
    API --> DB[(MongoDB)]
    API -->|prompt| G[Gemini]
    B --> C[Chart.js<br/>react-chartjs-2]
    B --> X[PapaParse<br/>CSV download]

    classDef ui fill:#F1EFE8,stroke:#888780,color:#222
    classDef api fill:#EEEDFE,stroke:#7F77DD,color:#222
    classDef ext fill:#84CC16,stroke:#0F172A,color:#111
    class B,C,X ui
    class API api
    class DB,G ext
```

Two routes, set up in `src/main.jsx`:

| Route | Page |
|---|---|
| `/` | Live dashboard (`App.jsx`) |
| `/analytics` | Anomalies, forecast and AI summary (`pages/AnalyticsPage.jsx`) |

The app is a single-page app; `vercel.json` rewrites every path to `index.html` so deep links work on Vercel. All calls use `fetch` against `VITE_API_BASE_URL`. There is no login.

## <img src="https://api.iconify.design/lucide/zap.svg?color=%2384CC16" width="26" align="top" alt=""/> Quick Start

You need Node.js and a running [SM-POC-Backend](https://github.com/mukesh-dev-git/SM-POC-Backend) (the original hosted one is gone).

```bash
git clone https://github.com/mukesh-dev-git/SM-POC-Frontend.git
cd SM-POC-Frontend
npm install
cp .env.example .env.local   # VITE_API_BASE_URL=http://localhost:3001
npm run dev                  # http://localhost:5173
```

```bash
npm run build     # production build in dist/
npm run preview
npm run lint
```

Notes:

- `VITE_API_BASE_URL` is baked in at build time. The repo's `.env.production` points at the old Render backend, so replace it (or set the variable in your host) before building.
- `vite.config.js` proxies `/api` to the old Render URL, but not `/data`. Set `VITE_API_BASE_URL` to your backend, which allows CORS from any origin, instead of relying on the proxy.

## <img src="https://api.iconify.design/lucide/folder-tree.svg?color=%2384CC16" width="26" align="top" alt=""/> Project Structure

```
SM-POC-Frontend/
├── src/
│   ├── main.jsx                  # router, Chart.js registration
│   ├── App.jsx                   # live dashboard, 5 s polling
│   ├── pages/AnalyticsPage.jsx   # anomalies, forecast, AI summary
│   ├── components/
│   │   ├── MetricCard.jsx        LineChart.jsx   RssiGauge.jsx
│   │   ├── InsightsPanel.jsx     # threshold alerts
│   │   ├── AnomalyChart.jsx      ForecastChart.jsx
│   │   └── DataExporter.jsx      # CSV export
│   └── index.css, App.css
├── vite.config.js                # dev proxy for /api
├── vercel.json                   # SPA rewrite
├── .env.example
└── package.json
```

## <img src="https://api.iconify.design/lucide/gauge.svg?color=%2384CC16" width="26" align="top" alt=""/> Status and Known Limitations

A proof of concept that was deployed on Vercel and is now offline.

| Area | State |
|---|---|
| Live dashboard, RSSI gauge, alerts | Working against the backend |
| Anomaly and forecast charts | Only show data if the backend's `anomalies` and `forecasts` collections were filled by an outside job; the forecast chart stays on "Loading forecast data..." when there is no forecast |
| Analytics page errors | If a request fails, the page throws while reading `forecastData.forecast` instead of showing a message |
| CSV export | Covers only the 50 readings the dashboard has loaded; both date pickers start at the current moment, so the default range is empty |
| Alert thresholds | Fixed in `InsightsPanel.jsx` (215 V, 10 A, -85 dBm) |
| Page title, icon | Still the Vite defaults |
| Tests | None |

### External services

| Service | Used for | State |
|---|---|---|
| Vercel (`sm-poc-frontend.vercel.app`) | Hosting | Gone: returns 404 `DEPLOYMENT_NOT_FOUND` |
| Render (`sm-poc-backend.onrender.com`) | API host in `.env.production` and the dev proxy | Gone: returns 404 with `x-render-routing: no-server` |

The frontend uses no database or API key of its own; those belong to the backend.

## <img src="https://api.iconify.design/lucide/link.svg?color=%2384CC16" width="26" align="top" alt=""/> Related Repositories

- [SM-POC-Backend](https://github.com/mukesh-dev-git/SM-POC-Backend): the Express + MongoDB API this app calls.
- [LoRa-ESP32](https://github.com/mukesh-dev-git/LoRa-ESP32) and [PowerMET](https://github.com/mukesh-dev-git/PowerMET): the gateway and the meter node that produce the readings.
- [SM-Dev1](https://github.com/mukesh-dev-git/SM-Dev1): a later STM32L432 + Wio-E5 LoRaWAN bring-up for the same smart-meter idea. It does not feed this dashboard.

## <img src="https://api.iconify.design/lucide/scale.svg?color=%2384CC16" width="26" align="top" alt=""/> License

MIT. See [LICENSE](LICENSE).

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:84CC16,100:0F172A&height=110&section=footer&animation=fadeIn" width="100%" alt=""/>

</div>
