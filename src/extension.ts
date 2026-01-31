import * as vscode from 'vscode'
import { copyToDestination, copyToPreset } from './copyUtils'

/** Preset configuration from settings */
interface PresetConfig {
  label: string
  path: string
}

/** Maximum number of presets supported */
const MAX_PRESETS = 8

/** QuickPick item for preset selection */
interface PresetQuickPickItem extends vscode.QuickPickItem {
  preset?: PresetConfig
  isBrowse?: boolean
}

/**
 * Shows QuickPick UI for selecting copy destination.
 * Displays configured presets with their labels and a "Browse..." option.
 *
 * @param targets - Array of source file/folder Uris
 *
 * @example
 * await showPresetQuickPick([vscode.Uri.file('/path/to/file.ts')]);
 * // Shows: [Universal, Node, Next React, ..., Browse...]
 */
async function showPresetQuickPick(targets: vscode.Uri[]): Promise<void> {
  const config = vscode.workspace.getConfiguration('copyTo')
  const presets = config.get<PresetConfig[]>('presets', [])

  // Build QuickPick items
  const items: PresetQuickPickItem[] = []

  // Add configured presets
  for (const preset of presets) {
    if (preset?.label && preset?.path) {
      items.push({
        label: `$(folder) ${preset.label}`,
        description: preset.path,
        preset,
      })
    }
  }

  // Add separator and Browse option
  if (items.length > 0) {
    items.push({
      label: '',
      kind: vscode.QuickPickItemKind.Separator,
    })
  }

  items.push({
    label: '$(folder-opened) Browse...',
    description: 'Select a folder',
    isBrowse: true,
  })

  // Show QuickPick
  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select destination',
    title: 'Copy to...',
  })

  if (!selected) {
    return // User cancelled
  }

  if (selected.isBrowse) {
    // Use original copyToDestination (shows folder picker)
    await copyToDestination(targets)
  } else if (selected.preset) {
    // Copy to selected preset
    await copyToPreset(targets, selected.preset.path, selected.preset.label)
  }
}

/**
 * Creates command handler for a preset slot (keyboard shortcut).
 *
 * @param presetIndex - Zero-based index of the preset (0-7)
 * @returns Command handler function that copies files to the preset destination
 *
 * @example
 * const handler = createPresetHandler(0); // Handler for Preset 1
 * // When invoked via Cmd+Shift+C 1, copies selected files to preset[0].path
 */
function createPresetHandler(
  presetIndex: number,
): (
  uri: vscode.Uri | undefined,
  uris: vscode.Uri[] | undefined,
) => Promise<void> {
  return async (uri, uris) => {
    const targets = uris ?? (uri ? [uri] : [])
    if (targets.length === 0) {
      vscode.window.showWarningMessage('No files or folders selected.')
      return
    }

    const config = vscode.workspace.getConfiguration('copyTo')
    const presets = config.get<PresetConfig[]>('presets', [])
    const preset = presets[presetIndex]

    if (!preset?.path) {
      vscode.window.showWarningMessage(
        `Preset ${presetIndex + 1} is not configured. Configure it in Settings > Copy To > Presets.`,
      )
      return
    }

    await copyToPreset(targets, preset.path, preset.label)
  }
}

/**
 * Extension activation entry point.
 * Called when the extension is first activated (e.g., when the command is invoked).
 *
 * @param context - Extension context for managing subscriptions and state
 *
 * @example
 * // VSCode calls this automatically when:
 * // - User right-clicks in File Explorer and selects "Copy to..."
 * // - User runs the command from Command Palette
 * // - User uses keyboard shortcut
 */
export function activate(context: vscode.ExtensionContext): void {
  // Register main command with QuickPick UI
  const copyToDestinationCmd = vscode.commands.registerCommand(
    'copy-to.copyToDestination',
    async (uri: vscode.Uri | undefined, uris: vscode.Uri[] | undefined) => {
      // Handle both single and multi-selection
      // - Single selection: uri is set, uris is undefined
      // - Multi selection: uri is first item, uris contains all items
      const targets = uris ?? (uri ? [uri] : [])

      if (targets.length === 0) {
        vscode.window.showWarningMessage('No files or folders selected.')
        return
      }

      await showPresetQuickPick(targets)
    },
  )
  context.subscriptions.push(copyToDestinationCmd)

  // Register preset commands (1-8)
  for (let i = 0; i < MAX_PRESETS; i++) {
    const cmd = vscode.commands.registerCommand(
      `copy-to.copyToPreset${i + 1}`,
      createPresetHandler(i),
    )
    context.subscriptions.push(cmd)
  }
}

/**
 * Extension deactivation cleanup.
 * Called when the extension is deactivated.
 */
export function deactivate(): void {
  // No cleanup required
}
