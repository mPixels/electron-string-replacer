# Electron - String Replacer (ESR)

## Overview

ESR is a small prototype app using [Electron](https://www.electronjs.org/) with [Electron Forge](https://www.electronforge.io/). The tool can be modified to handle most any type of string search in a directory tree of files.

#### Extra packages
- [custom-electron-titlebar](https://github.com/AlexTorresSk/custom-electron-titlebar#readme)

## Usage

```
# Install dependencies
npm install

# Run default app configuration
npm run start

# Publish the app for Windows Platform
npm run publish
```

#### Configuration

The default prototype is setup to do 4 things.

- Select a folder
- Take the base folder name and search / replace all occurrences of that name with a randomly generated string
- Rename 2 root directory files with the randomly generated string
- Rename root folder with the randomly generated string

#### Adaptation

You can adapt the code to search / replace most anything in a directory tree. I have included by sync and async functions for handling the rename portions.
