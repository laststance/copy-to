# Changelog

All notable changes to the "Copy to" extension will be documented in this file.

## [0.2.0] - 2026-02-01

### Changed

- **QuickPick UI for preset selection** - Replaced static submenu with dynamic QuickPick interface
  - Preset labels now display correctly (e.g., "Universal", "Node" instead of "Preset 1", "Preset 2")
  - Shows preset path as description for better visibility
  - Includes folder icons for improved UX
- **Simplified context menu** - Single "Copy to..." entry instead of nested submenu
- **Early activation** - Extension now activates on VS Code startup (`onStartupFinished`) to ensure presets are available immediately

### Fixed

- Fixed issue where presets were not displayed in context menu due to late activation timing

### Technical

- Removed `setContext` API usage for menu visibility (no longer needed)
- Simplified `package.json` menu configuration (reduced from 145 lines to 8 lines)

## [0.1.0] - 2026-01-31

### Added

- **Preset destinations** - Configure up to 8 favorite copy destinations
- **Keyboard shortcuts** - `Cmd/Ctrl+Shift+C` followed by `1-8` for quick access
- **Submenu UI** - "Copy to..." submenu in File Explorer context menu

## [0.0.2] - 2025-12-03

### Changed

- Restricted package files for smaller extension size
- Updated extension icon to glass-style 3D design

## [0.0.1] - 2025-12-03

### Added

- Initial release
- Copy files/folders to configurable destination
- Support for `~` home directory in paths
- Conflict resolution dialog (Overwrite/Skip/Cancel)
