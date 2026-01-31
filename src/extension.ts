import * as vscode from 'vscode'
import { copyToDestination, copyToPreset } from './copyUtils'

/** Preset configuration from settings */
interface PresetConfig {
  label: string
  path: string
}

/** Maximum number of presets supported */
const MAX_PRESETS = 8

/**
 * Updates context keys for conditional menu visibility.
 * Called on activation and when configuration changes.
 *
 * @example
 * // Sets context keys like:
 * // copyTo.preset1Configured = true (if preset 1 exists)
 * // copyTo.preset2Configured = false (if preset 2 doesn't exist)
 */
function updatePresetContexts(): void {
  const config = vscode.workspace.getConfiguration('copyTo')
  const presets = config.get<PresetConfig[]>('presets', [])

  // Set context for each preset slot
  for (let i = 0; i < MAX_PRESETS; i++) {
    const hasPreset = presets[i]?.path ? true : false
    vscode.commands.executeCommand(
      'setContext',
      `copyTo.preset${i + 1}Configured`,
      hasPreset,
    )
  }
}

/**
 * Creates command handler for a preset slot.
 *
 * @param presetIndex - Zero-based index of the preset (0-7)
 * @returns Command handler function that copies files to the preset destination
 *
 * @example
 * const handler = createPresetHandler(0); // Handler for Preset 1
 * // When invoked, copies selected files to preset[0].path
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
  // Update contexts on activation
  updatePresetContexts()

  // Watch for configuration changes
  const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('copyTo.presets')) {
      updatePresetContexts()
    }
  })
  context.subscriptions.push(configWatcher)

  // Register original command (backward compatible - Browse functionality)
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

      await copyToDestination(targets)
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
