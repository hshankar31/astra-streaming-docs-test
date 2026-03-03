# Cluster Portal

A web application for viewing and accessing cluster information with dynamic links to Grafana, Prometheus, and cluster UIs.

## Features

- 🔍 Search clusters by environment, region, cloud provider, or name
- 📊 Dynamic links to Grafana and Prometheus monitoring dashboards
- 🌐 Support for multiple cloud providers (AWS, Azure, GCP)
- 🔄 Configurable data sources (API or YAML)
- ⚡ Fast filtering and keyboard shortcuts

## Configuration

The application can load cluster data from two sources:

### 1. API Endpoint (Recommended)

Edit [`config/config.js`](config/config.js) to use the API:

```javascript
const CONFIG = {
  dataSource: 'api',
  apiEndpoint: 'http://localhost:8080/v2/streaming/cluster-portal',
  includePreview: false,
  fallbackToYaml: true
};
```

**API Response Format:**
```json
{
  "domains": {
    "grafana": "grafana.{cloud}-{region}.{env}.streaming.datastax.com/",
    "prometheus": "prometheus.{cloud}-{region}.streaming.datastax.com/",
    "cluster": "{env}.{region}.{cloud}.cluster.example.com"
  },
  "clusters": [
    {
      "name": "prod.aws.astrastreaming-public-us-east-1-dataplane",
      "env": "prod",
      "cloud": "aws",
      "region": "useast1",
      "project": "public"
    }
  ]
}
```

### 2. YAML File (Static)

Edit [`config/config.js`](config/config.js) to use YAML:

```javascript
const CONFIG = {
  dataSource: 'yaml',
  yamlPath: './config/clusters.yaml'
};
```

## Usage

### Opening the Portal

Simply open [`index.html`](index.html) in a web browser, or serve it with a local web server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000
```

### Keyboard Shortcuts

- **`/`** - Focus search input
- **`Escape`** - Clear search and show all clusters

### Search

Type in the search box to filter clusters by:
- Environment (dev, staging, prod)
- Cloud provider (aws, azure, gcp)
- Region (useast1, euwest1, etc.)
- Project name (public, datastax, etc.)
- Full cluster name

## Backend API Setup

To use the API data source, you need to set up the backend endpoint:

### Option 1: Using the Bellburnell Backend

If you have access to the bellburnell backend, add the following route handler:

1. Create `src/route/cluster_portal_handler.go` with the cluster portal endpoint
2. Register the route in your router:

```go
router.HandleFunc("/v2/streaming/cluster-portal", 
    cpr.GetClusterPortalDataHandler).Methods("GET")
```

3. Start your backend server:

```bash
make run
# or
go run src/main.go
```

### Option 2: Mock API Server

For testing, you can create a simple mock server:

```javascript
// mock-server.js
const http = require('http');
const fs = require('fs');
const yaml = require('js-yaml');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/v2/streaming/cluster-portal')) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const yamlData = yaml.load(fs.readFileSync('./config/clusters.yaml', 'utf8'));
    res.end(JSON.stringify(yamlData));
  }
});

server.listen(8080, () => {
  console.log('Mock API server running on http://localhost:8080');
});
```

Run with: `node mock-server.js`

## URL Templates

The application constructs monitoring URLs using templates defined in the configuration:

- **Grafana**: `https://grafana.{cloud}-{region}.{env}.streaming.datastax.com/`
- **Prometheus**: `https://prometheus.{cloud}-{region}.streaming.datastax.com/`
- **Cluster UI**: `https://{env}.{region}.{cloud}.cluster.example.com`

Placeholders are replaced with actual cluster values:
- `{cloud}` - Cloud provider (aws, azure, gcp)
- `{region}` - Normalized region (useast1, euwest1, etc.)
- `{env}` - Environment (dev, staging, prod)

## File Structure

```
cluster-portal/
├── index.html              # Main HTML file
├── README.md              # This file
├── config/
│   ├── config.js          # Configuration file
│   └── clusters.yaml      # Static cluster data (fallback)
├── css/
│   └── styles.css         # Styling
└── js/
    ├── App.js             # Main application logic
    ├── Cluster.js         # Cluster model and URL builder
    └── ConfigLoader.js    # Configuration loader (API/YAML)
```

## Troubleshooting

### CORS Issues

If you encounter CORS errors when loading from the API:

1. Ensure your backend server includes CORS headers:
   ```go
   w.Header().Set("Access-Control-Allow-Origin", "*")
   ```

2. Or use a proxy/tunnel service like ngrok

### API Not Loading

1. Check the browser console for errors
2. Verify the API endpoint is correct in `config/config.js`
3. Test the API endpoint directly: `curl http://localhost:8080/v2/streaming/cluster-portal`
4. Enable fallback to YAML: `fallbackToYaml: true`

### Empty Cluster List

1. Verify the API returns data in the correct format
2. Check that clusters have the required fields: `name`, `env`, `cloud`, `region`, `project`
3. Look for JavaScript errors in the browser console

## Development

To modify the application:

1. **Add new features**: Edit [`js/App.js`](js/App.js)
2. **Change URL templates**: Edit domain templates in config or API response
3. **Modify styling**: Edit [`css/styles.css`](css/styles.css)
4. **Update cluster model**: Edit [`js/Cluster.js`](js/Cluster.js)

## License

Copyright (c) 2021 Datastax, Inc.
