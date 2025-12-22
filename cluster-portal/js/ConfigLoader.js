class ConfigLoader {
  static async load(path) {
    const res = await fetch(path);
    const text = await res.text();

    if (path.endsWith(".yaml") || path.endsWith(".yml")) {
      return jsyaml.load(text);
    }

    return JSON.parse(text);
  }
}

