class App {
  constructor(rootId) {
    this.root = document.getElementById(rootId);
    this.searchInput = document.getElementById("search");
    this.clusters = [];
    this.filtered = [];
  }

  async init() {
    try {
      const config = await ConfigLoader.loadConfig();

      this.clusters = config.clusters.map(
        c => new Cluster(c, config.domains)
      );

      this.filtered = this.clusters;
      this.bindSearch();
      this.bindShortcuts();
      this.render();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Failed to load cluster data. Please check the configuration.');
    }
  }

  showError(message) {
    this.root.innerHTML = `
      <div style="padding: 20px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">
        <strong>Error:</strong> ${message}
      </div>
    `;
  }

  bindSearch() {
    this.searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      this.filtered = this.clusters.filter(c =>
        c.searchableText().includes(q)
      );
      this.render();
    });
  }

  bindShortcuts() {
    document.addEventListener("keydown", e => {
      if (e.key === "/") {
        e.preventDefault();
        this.searchInput.focus();
      }
      if (e.key === "Escape") {
        this.searchInput.value = "";
        this.filtered = this.clusters;
        this.render();
      }
    });
  }

  group() {
    return this.filtered.reduce((acc, c) => {
      acc[c.env] ??= {};
      acc[c.env][c.cloud] ??= [];
      acc[c.env][c.cloud].push(c);
      return acc;
    }, {});
  }

  render() {
    this.root.innerHTML = "";
    const grouped = this.group();

    Object.entries(grouped).forEach(([env, clouds]) => {
      this.root.appendChild(this.header("h2", env.toUpperCase()));

      Object.entries(clouds).forEach(([cloud, clusters]) => {
        this.root.appendChild(this.header("h3", cloud));

        const grid = document.createElement("div");
        grid.className = "grid";

        clusters.forEach(c => grid.appendChild(this.card(c)));
        this.root.appendChild(grid);
      });
    });
  }

  header(tag, text) {
    const h = document.createElement(tag);
    h.textContent = text;
    return h;
  }

  card(cluster) {
    const links = cluster.links();
    const card = document.createElement("div");
    card.className = `card cloud-${cluster.cloud}`;

    card.innerHTML = `
      <h4>${cluster.region} • ${cluster.project}</h4>
      <div class="meta">${cluster.name}</div>
      <a href="${links.grafana}" target="_blank">Grafana</a>
      <a href="${links.prometheus}" target="_blank">Prometheus</a>
    `;
    return card;
  }
}

new App("root").init();

