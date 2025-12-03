# Copy to

A simple VSCode extension that adds a "Copy to..." option to the File Explorer context menu, allowing you to quickly copy files and folders to a configurable destination.

![VSCode](https://img.shields.io/badge/VSCode-^1.85.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

## Features

- **Context Menu Integration**: Right-click any file or folder in the File Explorer to copy it
- **Configurable Destination**: Set a default destination path in settings, or choose dynamically each time
- **Multi-Selection Support**: Select multiple files/folders and copy them all at once
- **Conflict Resolution**: Interactive dialog when files already exist (Overwrite / Skip / Cancel)
- **Auto-Create Directory**: Destination folder is automatically created if it doesn't exist
- **Home Directory Support**: Use `~` in paths (e.g., `~/utils`)

## Installation

### From VSIX (Local)

1. Download the `.vsix` file
2. Open VSCode
3. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
4. Type "Install from VSIX" and select the file

### From Source

```bash
git clone https://github.com/ryotamurakami/copy-to.git
cd copy-to
pnpm install
pnpm run build
```

Then press `F5` in VSCode to launch the Extension Development Host.

## Usage Guide

### Basic Usage

1. **Right-click** on any file or folder in the File Explorer
2. Select **"Copy to..."** from the context menu
3. If no destination is configured:
   - A folder picker dialog will appear
   - Select your desired destination folder
4. The file/folder will be copied to the destination

### Copying Multiple Items

1. **Select multiple files/folders** in the File Explorer (Ctrl/Cmd + Click)
2. **Right-click** on the selection
3. Select **"Copy to..."**
4. All selected items will be copied to the destination

### Handling File Conflicts

When a file with the same name already exists at the destination:

| Option | Action |
|--------|--------|
| **Overwrite** | Replace the existing file with the new one |
| **Skip** | Keep the existing file, skip copying this item |
| **Cancel** | Stop the entire copy operation |

## Configuration

Configure the extension in VSCode Settings (`Ctrl+,` or `Cmd+,`):

### Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `copyTo.destinationPath` | `string` | `""` (empty) | Default destination directory path |

### Setting the Destination Path

**Option 1: Using Settings UI**

1. Open VSCode Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Copy to"
3. Enter your desired path in the "Destination Path" field

**Option 2: Using settings.json**

```json
{
  "copyTo.destinationPath": "~/utils"
}
```

### Path Format Examples

| Path | Description |
|------|-------------|
| `~/utils` | utils folder in your home directory |
| `~/Desktop/backup` | backup folder on Desktop |
| `/absolute/path/to/folder` | Absolute path |
| `C:\Users\Name\Documents` | Windows absolute path |
| *(empty)* | Prompt for destination each time |

## Examples

### Example 1: Quick Utility Collection

Set up a utility folder to quickly collect useful scripts:

```json
{
  "copyTo.destinationPath": "~/utils"
}
```

Now you can right-click any script and instantly copy it to `~/utils`.

### Example 2: Dynamic Destination

Leave the setting empty to choose the destination each time:

```json
{
  "copyTo.destinationPath": ""
}
```

Each time you use "Copy to...", you'll be prompted to select a folder.

### Example 3: Project Backup

Set up a backup location for project files:

```json
{
  "copyTo.destinationPath": "~/Backups/projects"
}
```

## Keyboard Shortcut

You can assign a keyboard shortcut to the command:

1. Open Keyboard Shortcuts (`Ctrl+K Ctrl+S` or `Cmd+K Cmd+S`)
2. Search for "Copy to"
3. Click the + icon to add your preferred shortcut

## Requirements

- VSCode version 1.85.0 or higher

## Known Issues

- None currently reported

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License - see [LICENSE](LICENSE) for details.

## Changelog

### 0.0.1

- Initial release
- Context menu integration
- Configurable destination path
- Multi-selection support
- Conflict resolution dialog
