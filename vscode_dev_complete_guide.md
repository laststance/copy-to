# VSCode Extension 開発 2025 決定版ガイド

> Claude Code + MCP統合による次世代VSCode Extension開発の完全ガイド

**Last Updated**: 2025-12-09
**Author**: Generated with Claude Code Research

---

## 目次

1. [概要](#概要)
2. [開発環境セットアップ](#開発環境セットアップ)
3. [プロジェクトスキャフォールド](#プロジェクトスキャフォールド)
4. [プロジェクト構造](#プロジェクト構造)
5. [開発フロー](#開発フロー)
6. [MCP統合開発](#mcp統合開発)
7. [テスト戦略](#テスト戦略)
8. [デバッグ手法](#デバッグ手法)
9. [パブリッシング](#パブリッシング)
10. [AI Agent連携](#ai-agent連携)
11. [ベストプラクティス](#ベストプラクティス)
12. [トラブルシューティング](#トラブルシューティング)
13. [リソース集](#リソース集)

---

## 概要

### このガイドについて

2025年のVSCode Extension開発は、従来の拡張機能開発に加えて **MCP (Model Context Protocol)** との統合が重要なトレンドとなっています。本ガイドでは、Claude Codeを活用した効率的な開発ワークフローから、AI Agent対応の拡張機能開発まで、包括的に解説します。

### 2025年の主要トレンド

| トレンド                       | 説明                                               |
| ------------------------------ | -------------------------------------------------- |
| **MCP統合**                    | AI Agentが拡張機能を操作できるようにするプロトコル |
| **esbuild採用**                | webpackより10倍以上高速なビルドツール              |
| **TypeScript必須**             | 型安全性とIntelliSenseによる開発効率向上           |
| **デュアルマーケットプレイス** | VS Code Marketplace + Open VSX への同時公開        |
| **CI/CD自動化**                | GitHub Actionsによる自動パブリッシング             |

---

## 開発環境セットアップ

### 必須ツール

```bash
# Node.js (v20+ 推奨)
node --version

# pnpm (推奨パッケージマネージャー)
npm install -g pnpm

# VS Code
code --version

# Git
git --version
```

### 推奨VS Code拡張機能

```bash
# 開発必須
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode

# AI Agent支援
code --install-extension anthropic.claude-code

# テスト支援
code --install-extension ms-vscode.test-adapter-converter
```

### Claude Code セットアップ

```bash
# Claude Code CLIインストール
npm install -g @anthropic-ai/claude-code

# VS Code拡張機能インストール
code --install-extension anthropic.claude-code
```

---

## プロジェクトスキャフォールド

### Yeoman Generator を使用

```bash
# 推奨: グローバルインストールなしで実行
npx --package yo --package generator-code -- yo code

# または繰り返し使う場合はグローバルインストール
npm install --global yo generator-code
yo code
```

### 推奨設定

```
? What type of extension do you want to create?
  → New Extension (TypeScript)

? What's the name of your extension?
  → my-awesome-extension

? What's the identifier of your extension?
  → my-awesome-extension

? What's the description of your extension?
  → A powerful VS Code extension

? Initialize a git repository?
  → Yes

? Which bundler to use?
  → esbuild (推奨) または webpack

? Which package manager to use?
  → pnpm (推奨)
```

### 選択肢の詳細

| 項目            | 推奨値                     | 理由                             |
| --------------- | -------------------------- | -------------------------------- |
| Type            | New Extension (TypeScript) | 型安全性、IntelliSense対応       |
| Bundler         | **esbuild**                | 高速ビルド (webpack比10倍以上)   |
| Package Manager | **pnpm**                   | 高速インストール、ディスク効率的 |
| Initialize Git  | Yes                        | バージョン管理必須               |

---

## プロジェクト構造

### 推奨ディレクトリ構成

```
my-vscode-extension/
├── .vscode/
│   ├── launch.json          # デバッグ設定
│   ├── tasks.json           # ビルドタスク
│   ├── settings.json        # ワークスペース設定
│   └── mcp.json             # MCP サーバー設定 (AI Agent連携用)
│
├── src/
│   ├── extension.ts         # エントリーポイント (activate/deactivate)
│   ├── commands/            # コマンドハンドラー
│   │   ├── index.ts
│   │   └── helloWorld.ts
│   ├── providers/           # 各種プロバイダー
│   │   ├── treeView.ts
│   │   └── webview.ts
│   ├── utils/               # ユーティリティ関数
│   │   └── helpers.ts
│   └── test/
│       ├── suite/
│       │   ├── index.ts
│       │   └── extension.test.ts
│       └── runTest.ts
│
├── images/
│   └── icon.png             # 拡張機能アイコン (128x128 or 256x256)
│
├── dist/                    # ビルド出力 (gitignore)
│
├── package.json             # 拡張機能マニフェスト
├── tsconfig.json            # TypeScript設定
├── esbuild.config.mjs       # esbuildビルド設定
├── .vscodeignore            # パッケージ除外設定
├── .gitignore
├── README.md                # Marketplace表示用
├── CHANGELOG.md             # バージョン履歴
└── LICENSE
```

### package.json 完全テンプレート

```json
{
  "name": "my-awesome-extension",
  "displayName": "My Awesome Extension",
  "description": "A powerful VS Code extension",
  "version": "0.0.1",
  "publisher": "your-publisher-id",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-awesome-extension"
  },
  "homepage": "https://github.com/username/my-awesome-extension#readme",
  "bugs": {
    "url": "https://github.com/username/my-awesome-extension/issues"
  },
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Other"],
  "keywords": ["vscode", "extension", "productivity"],
  "icon": "images/icon.png",
  "galleryBanner": {
    "color": "#1e1e1e",
    "theme": "dark"
  },
  "activationEvents": [],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "myExtension.helloWorld",
        "title": "Hello World"
      }
    ],
    "configuration": {
      "title": "My Extension",
      "properties": {
        "myExtension.setting1": {
          "type": "string",
          "default": "",
          "description": "Description of setting1"
        }
      }
    },
    "menus": {
      "explorer/context": [
        {
          "command": "myExtension.helloWorld",
          "group": "navigation"
        }
      ]
    }
  },
  "scripts": {
    "vscode:prepublish": "pnpm run build",
    "build": "node esbuild.config.mjs --production",
    "watch": "node esbuild.config.mjs --watch",
    "lint": "eslint src --ext ts",
    "typecheck": "tsc --noEmit",
    "test": "vscode-test",
    "package": "vsce package",
    "publish": "vsce publish"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/vscode": "^1.85.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@vscode/test-cli": "^0.0.6",
    "@vscode/test-electron": "^2.3.9",
    "@vscode/vsce": "^3.0.0",
    "esbuild": "^0.20.0",
    "eslint": "^8.57.0",
    "typescript": "^5.4.0"
  }
}
```

### esbuild.config.mjs

```javascript
import * as esbuild from 'esbuild'

const production = process.argv.includes('--production')
const watch = process.argv.includes('--watch')

const ctx = await esbuild.context({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  format: 'cjs',
  minify: production,
  sourcemap: !production,
  sourcesContent: false,
  platform: 'node',
  outfile: 'dist/extension.js',
  external: ['vscode'],
  logLevel: 'info',
})

if (watch) {
  await ctx.watch()
  console.log('Watching for changes...')
} else {
  await ctx.rebuild()
  await ctx.dispose()
}
```

---

## 開発フロー

### 基本的なエントリーポイント

```typescript
// src/extension.ts
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "my-extension" is now active!')

  // コマンド登録
  const helloWorldCommand = vscode.commands.registerCommand(
    'myExtension.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from My Extension!')
    },
  )

  // 設定変更の監視
  const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('myExtension')) {
      // 設定変更時の処理
    }
  })

  context.subscriptions.push(helloWorldCommand, configWatcher)
}

export function deactivate() {
  // クリーンアップ処理
}
```

### コマンドハンドラーの分離

```typescript
// src/commands/helloWorld.ts
import * as vscode from 'vscode'

export function registerHelloWorldCommand(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(
    'myExtension.helloWorld',
    async () => {
      const result = await vscode.window.showQuickPick(
        ['Option 1', 'Option 2', 'Option 3'],
        { placeHolder: 'Select an option' },
      )

      if (result) {
        vscode.window.showInformationMessage(`You selected: ${result}`)
      }
    },
  )

  context.subscriptions.push(command)
}
```

```typescript
// src/extension.ts
import * as vscode from 'vscode'
import { registerHelloWorldCommand } from './commands/helloWorld'

export function activate(context: vscode.ExtensionContext) {
  registerHelloWorldCommand(context)
}

export function deactivate() {}
```

### デバッグ実行 (F5)

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "preLaunchTask": "${defaultBuildTask}"
    },
    {
      "name": "Extension Tests",
      "type": "extensionHost",
      "request": "launch",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/out/test/suite/index"
      ],
      "outFiles": ["${workspaceFolder}/out/**/*.js"],
      "preLaunchTask": "npm: compile-tests"
    }
  ]
}
```

---

## MCP統合開発

### MCP (Model Context Protocol) とは

MCP は AI Agent が外部ツールやサービスと標準化された方法で通信するためのプロトコルです。VSCode Extension に MCP サーバーを組み込むことで、Claude Code や GitHub Copilot などの AI Agent から操作可能になります。

### アーキテクチャ

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AI Agent      │────▶│   MCP Client    │────▶│  MCP Servers    │
│ (Claude Code)   │     │  (in VSCode)    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                        ┌───────────────────────────────┼───────────────────────────────┐
                        │                               │                               │
                        ▼                               ▼                               ▼
              ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
              │ Filesystem MCP  │             │  Terminal MCP   │             │ VSCode MCP      │
              │ - read_file     │             │ - execute_cmd   │             │ - open_file     │
              │ - write_file    │             │ - get_output    │             │ - get_symbols   │
              │ - list_dir      │             │ - shell_access  │             │ - debug_*       │
              └─────────────────┘             └─────────────────┘             └─────────────────┘
```

### 拡張機能へのMCPサーバー組み込み

```typescript
// src/mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  {
    name: 'my-extension-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
)

// ツール一覧を返す
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'execute_extension_command',
      description: 'Execute a command from my extension',
      inputSchema: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'The command to execute',
          },
        },
        required: ['command'],
      },
    },
  ],
}))

// ツール実行ハンドラー
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (name === 'execute_extension_command') {
    // コマンド実行ロジック
    return {
      content: [
        {
          type: 'text',
          text: `Executed command: ${args?.command}`,
        },
      ],
    }
  }

  throw new Error(`Unknown tool: ${name}`)
})

// サーバー起動
const transport = new StdioServerTransport()
await server.connect(transport)
```

### MCP設定ファイル

```json
// .vscode/mcp.json
{
  "mcpServers": {
    "my-extension": {
      "command": "node",
      "args": ["${workspaceFolder}/dist/mcp-server.js"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git"]
    }
  }
}
```

---

## テスト戦略

### テストセットアップ

```bash
# テスト用パッケージインストール
pnpm add -D @vscode/test-cli @vscode/test-electron
```

### テスト設定ファイル

```javascript
// .vscode-test.mjs
import { defineConfig } from '@vscode/test-cli'

export default defineConfig({
  files: 'out/test/**/*.test.js',
  mocha: {
    ui: 'tdd',
    timeout: 20000,
  },
})
```

### 統合テスト例

```typescript
// src/test/suite/extension.test.ts
import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.')

  test('Extension should be present', () => {
    const extension = vscode.extensions.getExtension('publisher.my-extension')
    assert.ok(extension, 'Extension not found')
  })

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('publisher.my-extension')
    await extension?.activate()
    assert.ok(extension?.isActive, 'Extension did not activate')
  })

  test('Should register commands', async () => {
    const commands = await vscode.commands.getCommands()
    assert.ok(
      commands.includes('myExtension.helloWorld'),
      'Command not registered',
    )
  })

  test('Should execute command successfully', async () => {
    await vscode.commands.executeCommand('myExtension.helloWorld')
    // 追加のアサーション
  })
})
```

### テスト実行

```bash
# CLIでテスト実行
pnpm run test

# ウォッチモードでテスト
pnpm run test -- --watch
```

---

## デバッグ手法

### Extension Development Host

1. **F5** でデバッグ開始
2. 新しいVSCodeウィンドウが開く (Extension Development Host)
3. 拡張機能が自動的にロードされる
4. ブレークポイントが TypeScript ソースで機能

### MCP Debug Tools (AI Agentによるデバッグ)

```bash
# MCP Debug Tools インストール
npx @uhd_kr/mcp-debug-tools
```

**提供されるデバッグツール:**

| ツール                     | 説明                       |
| -------------------------- | -------------------------- |
| `list-debug-configs`       | launch.json の設定一覧取得 |
| `select-debug-config`      | デバッグ設定選択           |
| `debug_startSession`       | デバッグセッション開始     |
| `debug_setBreakpoint`      | ブレークポイント設定       |
| `debug_inspectVariables`   | 変数検査                   |
| `debug_evaluateExpression` | 式評価                     |
| `debug_stepOver`           | ステップオーバー           |
| `debug_stepInto`           | ステップイン               |
| `debug_continue`           | 実行継続                   |

### デバッグのベストプラクティス

```typescript
// デバッグ用ログ出力
const outputChannel = vscode.window.createOutputChannel('My Extension')

export function log(message: string) {
  outputChannel.appendLine(`[${new Date().toISOString()}] ${message}`)
}

// 使用例
log('Extension activated')
log(
  `Config value: ${vscode.workspace.getConfiguration('myExtension').get('setting1')}`,
)
```

---

## パブリッシング

### 事前準備

#### 1. VS Code Marketplace (Azure DevOps PAT)

1. [dev.azure.com](https://dev.azure.com) にアクセス
2. User Settings → Personal Access Tokens
3. 新規トークン作成:
   - Organization: All accessible organizations
   - Scopes: Marketplace → Manage

#### 2. Open VSX

1. [open-vsx.org](https://open-vsx.org) にアクセス
2. GitHubでログイン
3. User Settings → Access Tokens → Create New Token

### 手動パブリッシュ

```bash
# ツールインストール
pnpm add -D @vscode/vsce ovsx

# パッケージング
pnpm exec vsce package
# 出力: my-extension-0.0.1.vsix

# VS Code Marketplace にログイン・公開
pnpm exec vsce login <publisher-id>
pnpm exec vsce publish

# Open VSX に公開
pnpm exec ovsx publish my-extension-0.0.1.vsix -p <OVSX_TOKEN>
```

### バージョンバンプ + 公開

```bash
# パッチバージョン (0.0.1 → 0.0.2)
pnpm exec vsce publish patch

# マイナーバージョン (0.0.2 → 0.1.0)
pnpm exec vsce publish minor

# メジャーバージョン (0.1.0 → 1.0.0)
pnpm exec vsce publish major
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/publish.yml
name: Publish Extension

on:
  release:
    types: [created]
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm run test

      - name: Build
        run: pnpm run build

      - name: Package Extension
        run: pnpm exec vsce package

      - name: Publish to VS Code Marketplace
        run: pnpm exec vsce publish -p ${{ secrets.VSCE_PAT }}

      - name: Publish to Open VSX
        run: pnpm exec ovsx publish *.vsix -p ${{ secrets.OVSX_PAT }}

      - name: Upload VSIX as artifact
        uses: actions/upload-artifact@v4
        with:
          name: extension-vsix
          path: '*.vsix'
```

---

## AI Agent連携

### 推奨ツールスタック

| ユースケース     | 推奨ソリューション            | 説明                         |
| ---------------- | ----------------------------- | ---------------------------- |
| 一般的な開発支援 | **Claude Code Extension**     | 公式、安定、フル機能         |
| デバッグ自動化   | **MCP Debug Tools**           | DAP統合、変数検査可能        |
| カスタムLLM対応  | **Cline**                     | 任意モデル対応、MCP統合      |
| エンタープライズ | **GitHub Copilot Agent Mode** | MS統合、コンプライアンス対応 |

### Claude Code での開発

```bash
# Claude Code VS Code拡張機能インストール
code --install-extension anthropic.claude-code

# 機能:
# - サイドバーチャットパネル
# - インラインdiff表示
# - ターミナルコマンド実行 (許可制)
# - ワークスペースコンテキスト認識
```

### Cline での開発

```bash
# Cline インストール
code --install-extension saoudrizwan.claude-dev

# 特徴:
# - Plan Mode (計画→レビュー→実行)
# - MCP統合
# - 任意のLLM対応 (Ollama, LM Studio, OpenRouter等)
# - ファイル/ターミナル操作
```

### 機能比較マトリックス

| 機能         | Claude Code | Cline | MCP Debug | GitHub Copilot |
| ------------ | ----------- | ----- | --------- | -------------- |
| ファイル R/W | ✅          | ✅    | ❌        | ✅             |
| ターミナル   | ✅          | ✅    | ❌        | ✅             |
| デバッグ     | ⚠️          | ❌    | ✅        | ⚠️             |
| シンボル検索 | ✅          | ✅    | ❌        | ✅             |
| カスタムMCP  | ⚠️          | ✅    | ✅        | ✅             |
| ローカルLLM  | ❌          | ✅    | N/A       | ❌             |

---

## ベストプラクティス

### コード品質

```typescript
// ✅ Good: 型安全なコマンド登録
const COMMANDS = {
  helloWorld: 'myExtension.helloWorld',
  openSettings: 'myExtension.openSettings',
} as const

type CommandKey = keyof typeof COMMANDS

function registerCommand(
  context: vscode.ExtensionContext,
  key: CommandKey,
  handler: () => void,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMANDS[key], handler),
  )
}
```

### 設定管理

```typescript
// ✅ Good: 型安全な設定取得
interface ExtensionConfig {
  setting1: string
  setting2: boolean
  setting3: number
}

function getConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration('myExtension')
  return {
    setting1: config.get<string>('setting1', ''),
    setting2: config.get<boolean>('setting2', false),
    setting3: config.get<number>('setting3', 0),
  }
}
```

### エラーハンドリング

```typescript
// ✅ Good: 適切なエラーハンドリング
async function executeCommand() {
  try {
    const result = await someAsyncOperation()
    vscode.window.showInformationMessage(`Success: ${result}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    vscode.window.showErrorMessage(`Failed: ${message}`)

    // ログ出力
    console.error('Command execution failed:', error)
  }
}
```

### パフォーマンス

```typescript
// ✅ Good: 遅延ロード
let heavyModule: typeof import('./heavyModule') | undefined

async function getHeavyModule() {
  if (!heavyModule) {
    heavyModule = await import('./heavyModule')
  }
  return heavyModule
}
```

---

## トラブルシューティング

### よくある問題と解決策

#### 拡張機能がアクティベートしない

```bash
# デバッグコンソールでエラー確認
# F5 でデバッグ実行後、Debug Console を確認

# package.json の activationEvents を確認
"activationEvents": [
    "onCommand:myExtension.helloWorld"
]
```

#### ビルドエラー

```bash
# TypeScript エラー確認
pnpm run typecheck

# クリーンビルド
rm -rf dist && pnpm run build
```

#### パブリッシュエラー

```bash
# PAT の有効期限確認
# Marketplace > Manage スコープ確認

# package.json の必須フィールド確認
# - name, displayName, description, version, publisher, engines
```

#### MCP接続エラー

```bash
# MCPサーバーが起動しているか確認
# VS Code の Output パネルで "MCP" チャンネルを確認

# 設定の構文エラー確認
# .vscode/mcp.json の JSON 形式を検証
```

---

## リソース集

### 公式ドキュメント

| リソース              | URL                                                                            |
| --------------------- | ------------------------------------------------------------------------------ |
| VS Code Extension API | https://code.visualstudio.com/api                                              |
| Your First Extension  | https://code.visualstudio.com/api/get-started/your-first-extension             |
| Extension Samples     | https://github.com/microsoft/vscode-extension-samples                          |
| Testing Extensions    | https://code.visualstudio.com/api/working-with-extensions/testing-extension    |
| Publishing Extensions | https://code.visualstudio.com/api/working-with-extensions/publishing-extension |
| MCP Developer Guide   | https://code.visualstudio.com/api/extension-guides/ai/mcp                      |

### MCP 関連

| リソース           | URL                                                                     |
| ------------------ | ----------------------------------------------------------------------- |
| MCP Specification  | https://modelcontextprotocol.io                                         |
| MCP TypeScript SDK | https://github.com/modelcontextprotocol/typescript-sdk                  |
| VSCode MCP Guide   | https://code.visualstudio.com/docs/copilot/customization/mcp-servers    |
| MCP Debug Tools    | https://marketplace.visualstudio.com/items?itemName=uhd.mcp-debug-tools |

### ツール

| ツール            | URL                                                |
| ----------------- | -------------------------------------------------- |
| vsce (Publishing) | https://github.com/microsoft/vscode-vsce           |
| ovsx (Open VSX)   | https://github.com/eclipse/openvsx                 |
| Yeoman Generator  | https://github.com/Microsoft/vscode-generator-code |

### AI Agent 拡張機能

| 拡張機能       | URL                                                                        |
| -------------- | -------------------------------------------------------------------------- |
| Claude Code    | https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code  |
| Cline          | https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev |
| Continue       | https://continue.dev                                                       |
| GitHub Copilot | https://marketplace.visualstudio.com/items?itemName=GitHub.copilot         |

---

## クイックリファレンス

### 開発コマンド一覧

```bash
# プロジェクト作成
npx --package yo --package generator-code -- yo code

# 開発サーバー (ウォッチモード)
pnpm run watch

# デバッグ実行
# VS Code で F5

# テスト実行
pnpm run test

# 型チェック
pnpm run typecheck

# Lint
pnpm run lint

# ビルド
pnpm run build

# パッケージング
pnpm exec vsce package

# 公開
pnpm exec vsce publish
pnpm exec ovsx publish -p <token>
```

### 開発ライフサイクル

```
1. Scaffold  → yo code (TypeScript + esbuild)
2. Develop   → src/extension.ts + commands
3. Debug     → F5 (Extension Development Host)
4. Test      → @vscode/test-cli + Mocha
5. Package   → vsce package
6. Publish   → vsce publish + ovsx publish
7. Iterate   → version bump → republish
```

---

**このガイドは Claude Code によるリサーチに基づいて生成されました。**

_Last generated: 2025-12-09_
