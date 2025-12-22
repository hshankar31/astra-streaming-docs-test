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

  links() {
    return {
      grafana: this.buildUrl(this.domains.grafana),
      prometheus: this.buildUrl(this.domains.prometheus),
      cluster: this.buildUrl(this.domains.cluster)
    };
  }

  searchableText() {
    return `${this.name} ${this.env} ${this.cloud} ${this.region}`.toLowerCase();
  }
}

