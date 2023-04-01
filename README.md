# Import Maps Command Line Interface

A command-line utility for managing [JavaScript import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) dependencies. 

<img width="80%" alt="Screenshot 2023-04-01 at 00 54 27" src="https://user-images.githubusercontent.com/1680157/229265234-f5120ec8-28cb-4cce-9303-444b076ec032.png">

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
