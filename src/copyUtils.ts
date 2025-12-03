import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';

/**
 * Resolves ~ to home directory in a path string.
 *
 * @param inputPath - Path string that may contain ~
 * @returns Resolved absolute path
 *
 * @example
 * resolvePath('~/utils'); // => '/Users/username/utils'
 * resolvePath('/absolute/path'); // => '/absolute/path'
 */
function resolvePath(inputPath: string): string {
  if (inputPath.startsWith('~')) {
    return path.join(os.homedir(), inputPath.slice(1));
  }
  return inputPath;
}

/**
 * Gets the destination path from settings or prompts user to select one.
 *
 * @returns
 * - Uri: Valid destination directory
 * - undefined: User cancelled or no valid path
 *
 * @example
 * const dest = await getDestinationUri();
 * // Settings has path => vscode.Uri.file('/path/from/settings')
 * // Settings empty => Opens folder picker dialog
 * // User cancels => undefined
 */
async function getDestinationUri(): Promise<vscode.Uri | undefined> {
  const config = vscode.workspace.getConfiguration('copyTo');
  const configuredPath = config.get<string>('destinationPath', '');

  if (configuredPath) {
    // Use configured path
    const resolvedPath = resolvePath(configuredPath);
    return vscode.Uri.file(resolvedPath);
  }

  // No configured path - prompt user to select destination
  const selected = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Select Destination',
    title: 'Select destination folder for copy',
  });

  if (selected && selected.length > 0) {
    return selected[0];
  }

  return undefined;
}

/**
 * Ensures the destination directory exists, creating it if necessary.
 *
 * @param destUri - Uri of the destination directory
 * @returns
 * - true: Directory exists or was created successfully
 * - false: Failed to create directory
 *
 * @example
 * await ensureDestinationDirectory(destUri); // => true (directory created)
 */
async function ensureDestinationDirectory(destUri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(destUri);
    return true;
  } catch {
    // Directory doesn't exist, create it
    try {
      await vscode.workspace.fs.createDirectory(destUri);
      return true;
    } catch (createError) {
      vscode.window.showErrorMessage(
        `Failed to create destination directory: ${createError}`
      );
      return false;
    }
  }
}

/**
 * Checks if a file/folder already exists at the target location.
 *
 * @param targetUri - Uri of the target location
 * @returns
 * - true: Target exists
 * - false: Target does not exist
 *
 * @example
 * await targetExists(vscode.Uri.file('/path/to/file')); // => true or false
 */
async function targetExists(targetUri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(targetUri);
    return true;
  } catch {
    return false;
  }
}

/** User action for conflict resolution */
type OverwriteAction = 'overwrite' | 'skip' | 'cancel';

/**
 * Prompts user for confirmation when target file already exists.
 *
 * @param fileName - Name of the conflicting file
 * @param destPath - Destination path for display
 * @returns
 * - 'overwrite': User chose to replace existing file
 * - 'skip': User chose to skip this file
 * - 'cancel': User dismissed dialog or chose cancel
 *
 * @example
 * const action = await promptOverwrite('utils.ts', '/path/to/dest');
 * // User clicks "Overwrite" => 'overwrite'
 * // User clicks "Skip" => 'skip'
 * // User dismisses dialog => 'cancel'
 */
async function promptOverwrite(
  fileName: string,
  destPath: string
): Promise<OverwriteAction> {
  const overwrite = 'Overwrite';
  const skip = 'Skip';
  const cancel = 'Cancel';

  const result = await vscode.window.showWarningMessage(
    `"${fileName}" already exists in ${destPath}. What would you like to do?`,
    { modal: true },
    overwrite,
    skip,
    cancel
  );

  switch (result) {
    case overwrite:
      return 'overwrite';
    case skip:
      return 'skip';
    default:
      return 'cancel';
  }
}

/** Result of single item copy operation */
type CopyResult = 'success' | 'skipped' | 'cancelled';

/**
 * Copies a single file or folder to destination.
 *
 * @param sourceUri - Uri of the source file/folder
 * @param destUri - Uri of the destination directory
 * @returns
 * - 'success': Copy completed successfully
 * - 'skipped': User chose to skip this file
 * - 'cancelled': User cancelled the operation
 *
 * @example
 * const result = await copySingleItem(sourceUri, destUri);
 * // => 'success' | 'skipped' | 'cancelled'
 */
async function copySingleItem(
  sourceUri: vscode.Uri,
  destUri: vscode.Uri
): Promise<CopyResult> {
  const fileName = path.basename(sourceUri.fsPath);
  const targetUri = vscode.Uri.joinPath(destUri, fileName);

  // Check for existing file
  if (await targetExists(targetUri)) {
    const action = await promptOverwrite(fileName, destUri.fsPath);

    if (action === 'cancel') {
      return 'cancelled';
    }

    if (action === 'skip') {
      return 'skipped';
    }

    // action === 'overwrite': proceed with copy
  }

  try {
    await vscode.workspace.fs.copy(sourceUri, targetUri, { overwrite: true });
    return 'success';
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to copy "${fileName}": ${error}`);
    return 'skipped';
  }
}

/**
 * Formats destination path for display (replaces home dir with ~).
 *
 * @param destPath - Absolute destination path
 * @returns Formatted path with ~ for home directory
 *
 * @example
 * formatDestinationForDisplay('/Users/john/utils'); // => '~/utils'
 */
function formatDestinationForDisplay(destPath: string): string {
  const homedir = os.homedir();
  if (destPath.startsWith(homedir)) {
    return '~' + destPath.slice(homedir.length);
  }
  return destPath;
}

/**
 * Copies multiple files/folders to configured destination directory.
 * If no destination is configured, prompts user to select one.
 * Creates destination if it doesn't exist.
 * Shows confirmation dialog for existing files.
 *
 * @param uris - Array of source file/folder Uris
 *
 * @example
 * // Single file copy
 * await copyToDestination([vscode.Uri.file('/path/to/file.ts')]);
 *
 * @example
 * // Multiple files copy
 * await copyToDestination([
 *   vscode.Uri.file('/path/to/file1.ts'),
 *   vscode.Uri.file('/path/to/folder'),
 * ]);
 */
export async function copyToDestination(uris: vscode.Uri[]): Promise<void> {
  // Get destination (from settings or user selection)
  const destUri = await getDestinationUri();

  if (!destUri) {
    // User cancelled folder selection
    return;
  }

  // Ensure destination exists
  if (!(await ensureDestinationDirectory(destUri))) {
    return;
  }

  const displayPath = formatDestinationForDisplay(destUri.fsPath);
  let copiedCount = 0;
  let skippedCount = 0;

  for (const uri of uris) {
    const result = await copySingleItem(uri, destUri);

    switch (result) {
      case 'success':
        copiedCount++;
        break;
      case 'skipped':
        skippedCount++;
        break;
      case 'cancelled':
        // User cancelled - stop processing
        vscode.window.showInformationMessage(
          `Cancelled. Copied ${copiedCount} item(s), skipped ${skippedCount}.`
        );
        return;
    }
  }

  // Show completion message
  if (copiedCount > 0) {
    const message =
      skippedCount > 0
        ? `Copied ${copiedCount} item(s) to ${displayPath}. Skipped ${skippedCount}.`
        : `Copied ${copiedCount} item(s) to ${displayPath}.`;
    vscode.window.showInformationMessage(message);
  } else if (skippedCount > 0) {
    vscode.window.showInformationMessage(
      `All ${skippedCount} item(s) were skipped.`
    );
  }
}
