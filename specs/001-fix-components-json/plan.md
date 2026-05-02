# Implementation Plan: Fix components.json for shadcn MCP

**Branch**: `001-fix-components-json` | **Date**: 2026-04-28 | **Spec**: N/A (simple fix)

## Summary

`components.json` is malformed — the opening JSON object is missing, leaving only the `registries` block. The shadcn MCP and `npx shadcn` CLI both fail to parse it. Fix: restore full valid JSON merging the original fields from git history with the custom registry entries.

## Technical Context

**Language/Version**: JSON config file  
**Primary Dependencies**: shadcn/ui CLI, shadcn MCP  
**Storage**: N/A  
**Testing**: `npx shadcn doctor` or `cat components.json | python3 -m json.tool`  
**Target Platform**: Next.js 16 / App Router project  
**Project Type**: Config file fix  
**Performance Goals**: N/A  
**Constraints**: Must preserve custom registries added by user  
**Scale/Scope**: Single file

## Root Cause

`components.json` was partially overwritten — only the `registries` block survived. Git shows original had:
- `$schema`, `style`, `rsc`, `tsx`, `tailwind`, `iconLibrary`, `rtl`, `aliases`
- `registries: {}`

Current broken file has only `registries` with 5 custom entries, no opening structure.

## Constitution Check

No constitution configured. No gates applicable for a single-file JSON fix.

## Tasks

- [x] Read broken `components.json` (done — only 9 lines, starts with `},`)
- [x] Retrieve original from git (`main` branch)
- [ ] Write corrected file merging original structure + custom registries
- [ ] Validate JSON is parseable
- [ ] Verify shadcn MCP tools work (`mcp__shadcn__get_project_registries`)

## Project Structure

```text
specs/001-fix-components-json/
├── plan.md   ← this file
components.json  ← the fix target
```

## Correct File (target state)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json",
    "@originui": "https://originui.com/registry/{name}.json",
    "@cult": "https://cult-ui.com/{name}.json",
    "@kibo": "https://kibo-ui.com/registry/{name}.json",
    "@reui": "https://reui.io/r/{name}.json"
  }
}
```
