class Cluster {
  constructor(data, domainTemplates) {
    Object.assign(this, data);
    this.domains = domainTemplates;
  }

  buildUrl(template) {
    return "https://" + template
      .replace("{env}", this.env)
      .replace("{region}", this.region)
      .replace("{cloud}", this.cloud);
  }

  links() {
    return {
      grafana: this.buildUrl(this.domains.grafana),
      splunk: this.buildUrl(this.domains.splunk),
      cluster: this.buildUrl(this.domains.cluster)
    };
  }

  searchableText() {
    return `${this.name} ${this.env} ${this.cloud} ${this.region}`.toLowerCase();
  }
}

