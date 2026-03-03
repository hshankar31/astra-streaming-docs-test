class ConfigLoader {
  static async load(path) {
    const res = await fetch(path);
    const text = await res.text();

    if (path.endsWith(".yaml") || path.endsWith(".yml")) {
      return jsyaml.load(text);
    }

    return JSON.parse(text);
  }

  static async loadConfig() {
    // Check if CONFIG is defined
    if (typeof CONFIG === 'undefined') {
      console.warn('CONFIG not found, falling back to YAML');
      return await ConfigLoader.load('./config/clusters.yaml');
    }

    // Load from YAML
    return await ConfigLoader.load(CONFIG.yamlPath);
  }
}

