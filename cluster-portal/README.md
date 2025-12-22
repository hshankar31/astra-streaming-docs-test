# Cluster Portal

A lightweight, static **Cluster Quick Access Portal** for SRE / Platform teams.

This project renders a single web page that provides quick links to:
- Grafana dashboards
- Splunk
- Cluster admin / control-plane UIs

It is designed to be:
- Configuration-driven (YAML / JSON)
- Easy to extend
- Safe to modify during incidents
- Deployable via GitHub Pages
- Free of frameworks and build steps

---

## ✨ Features

- Environment separation (**dev / staging / prod**)
- Cloud separation (**aws / gcp / azure / self-hosted**)
- Centralized domain templating
- YAML-based configuration
- Search with keyboard shortcuts
- Cloud-specific styling
- Works locally and on GitHub Pages

---

## 📁 Repository Structure

```text
cluster-portal/
├── index.html              # HTML entry point (rarely changes)
├── README.md               # Project documentation
├── css/
│   └── styles.css          # Styling, layout, cloud colors
├── js/
│   ├── App.js              # App bootstrap, rendering, search, shortcuts
│   ├── Cluster.js          # Cluster model and URL generation logic
│   └── ConfigLoader.js     # Loads YAML / JSON config via fetch
└── config/
    └── clusters.yaml       # Main configuration file (edit this most)
