# im-cli

`im-cli` is a command-line utility for managing JavaScript import maps. It simplifies the process of adding, updating, and deleting package entries in your import map JSON file.

This utility uses the [esm.sh](https://esm.sh) CDN to fetch package information and versions.

## Installation

To install `im-cli` globally, run the following command:

```bash
npm install -g im-cli
```

## Usage

```bash
im <command> [package-name] [@version]
```

## Commands

### Adding a package

To add a package called `lodash` to your import map JSON file, run:

```bash
im add lodash
```

To add a specific version of the `lodash` package, include the version with the package name:

```bash
im add lodash@4.17.21
```

### Updating a package

To update the `lodash` package to the latest version, run:

```bash
im update lodash
```

### Deleting a package

To remove the `lodash` package from your import map JSON file, run:

```bash
im delete lodash
```

### Displaying help

To display a help message with command usage, run:

```bash
im help
```

## Import map usage in HTML

To use the generated import map in your HTML file, include the following script tag:

```html
<script type="importmap" src="path/to/your/im.json"></script>
```

Now you can use the ES module imports in your JavaScript files:

```javascript
import _ from "lodash"
```
