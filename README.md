<div align="center">
  <img src="build/icon.png" alt="Dota2Skins Mod Manager" width="120">

# Dota2Skins Mod Manager

A modern, open-source launcher for managing Dota 2 cosmetic mods from a single desktop app.

[![Release](https://img.shields.io/github/v/release/artem-prime42/dota2skins-mod-manager?style=flat-square)](https://github.com/artem-prime42/dota2skins-mod-manager/releases/latest)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey?style=flat-square)]()

[Download Latest Release](https://github.com/artem-prime42/dota2skins-mod-manager/releases/latest) •
[Website](https://dota2skins.vercel.app)

</div>

---

## ✨ What it does

Dota2Skins Mod Manager helps you browse, install, update, and organize Dota 2 mods without manually copying files into the game folder.

It includes:

- 🎭 Hero-based browsing
- 📂 Category and filter-based navigation
- 🔍 Fast search across mods
- 📦 One-click install and uninstall
- 📚 Built-in mod library and management tools
- 👤 Author pages and mod discovery
- 🔄 Automatic launcher updates
- ⚡ Automatic detection of Dota 2 installation
- 🧩 Support for presets, packs, and mod cleanup

---

## 🖼️ Screenshots

### Hero browser

<p align="center">
  <img src="https://raw.githubusercontent.com/artem-prime42/dota2-media/main/images/main_screen.png" width="900" alt="Hero browser screenshot">
</p>

### Categories and filters

<p align="center">
  <img src="https://raw.githubusercontent.com/artem-prime42/dota2-media/main/images/interface.png" width="900" alt="Categories screenshot">
</p>

### Mod library

<p align="center">
  <img src="https://raw.githubusercontent.com/artem-prime42/dota2-media/main/images/libary.png" width="900" alt="Library screenshot">
</p>

### Authors

<p align="center">
  <img src="https://raw.githubusercontent.com/artem-prime42/dota2-media/main/images/authors.png" width="900" alt="Authors screenshot">
</p>

---

## 🚀 Installation

1. Download the latest installer from the [releases page](https://github.com/artem-prime42/dota2skins-mod-manager/releases/latest).
2. Run the installer and follow the setup wizard.
3. The launcher will try to detect your Dota 2 installation automatically.
4. If needed, set the game path manually in Settings.
5. Copy the launch option shown in Settings and paste it into Steam:

```text
Steam → Dota 2 → Properties → Launch Options
```

Example:

```text
-language russian
```

---

## 🛠️ Development

To run the app locally:

```bash
git clone https://github.com/artem-prime42/dota2skins-mod-manager.git
cd dota2skins-mod-manager
npm install
npm start
```

If you want to build a standalone package:

```bash
npm run dist
```

---

## 🤝 Credits

This project is a modified version of Dota 2 Mod Manager by Mykhailo Lynnyk, taken on 2026-07-21, and has been modified since.

This project is based on and includes code from:

- [TheFleece / dota2-mod-manager](https://github.com/TheFleece/dota2-mod-manager)

Copyright (C) 2026 Mykhailo Lynnyk

Licensed under the GNU General Public License v3.0 (GPL-3.0).

This repository is also distributed under the same license.