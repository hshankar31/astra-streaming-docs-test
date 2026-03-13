class Cluster {
  constructor(data, domainTemplates) {
    Object.assign(this, data);
    this.domains = domainTemplates;
  }

  buildUrl(template) {
    return "https://" + template
      .replace("{env}", this.env)
      .replace("{region}", this.region)
      .replace("{client}", this.client)
      .replace("{cloud}", this.cloud);
  }

  getMonitoringUrl(service) {
    const project = this.project;
    const env = this.env;
    const cloud = this.cloud;
    const region = this.region;

    // Koddi project: grafana/prometheus.kd-{env}-{cloud}-{region}.streaming.datastax.com/
    if (project === "koddi") {
      return `https://${service}.kd-${env}-${cloud}-${region}.streaming.datastax.com/`;
    }
    
    // Quera project: grafana/prometheus.quera-{env}-awsue1.streaming.datastax.com/
    if (project === "quera") {
      return `https://${service}.quera-${env}-awsue1.streaming.datastax.com/`;
    }
    
    // Klarna project: grafana/prometheus.klarna-prod-aws-us-east-1.streaming.datastax.com/
    if (project === "klarna") {
      return `https://${service}.klarna-prod-aws-us-east-1.streaming.datastax.com/`;
    }
    
    // Default pattern for other projects
    // For dev/staging: grafana/prometheus.{cloud}-{region}.{env}.streaming.datastax.com/
    // For prod: grafana/prometheus.{cloud}-{region}.streaming.datastax.com/
    if (env === "dev" || env === "staging") {
      return `https://${service}.${cloud}-${region}.${env}.streaming.datastax.com/`;
    }
    
    return `https://${service}.${cloud}-${region}.streaming.datastax.com/`;
  }

  links() {
    return {
      grafana: this.getMonitoringUrl("grafana"),
      prometheus: this.getMonitoringUrl("prometheus")
    };
  }

  searchableText() {
    return `${this.name} ${this.env} ${this.cloud} ${this.region}`.toLowerCase();
  }
}

