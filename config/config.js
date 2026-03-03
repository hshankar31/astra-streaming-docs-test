// Configuration for the Cluster Portal
const CONFIG = {
  // GitHub Pages: If your repo is at https://username.github.io/repo-name/
  // uncomment and set: basePath: '/repo-name'
  // basePath: '',
  
  // YAML file path
  yamlPath: './config/clusters.yaml',
  
  // Domain templates for constructing monitoring URLs
  domains: {
    grafana: "grafana.{cloud}-{region}.streaming.datastax.com/",
    prometheus: "prometheus.{cloud}-{region}.streaming.datastax.com/"
  }
};

// Made with Bob
