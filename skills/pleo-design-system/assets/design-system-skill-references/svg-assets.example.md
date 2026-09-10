# SVG assets

- Source roots: `<icons-path>`, `<illustrations-path>`
- Generator: `<generator-path>`
- Configuration: `<config-path>`
- Generated TypeScript/registry: `<generated-types-path>`
- React barrel: `<path-or-not-applicable>`
- Commands: `<build-assets>`, `<check-assets>`, `<preview>`

## Context contract

| Kind | Source folder | File prefix | Angular namespace | React prefix/subdir |
| --- | --- | --- | --- | --- |
| `<icon/illustration>` | `<path>` | `<prefix>` | `<namespace>` | `<prefix/path>` |

Allowed modifiers: `<list>`  
Approved vocabulary source: `<config-field-or-file>`

## Workflow

Dodawaj, przenoś, zmieniaj nazwę i usuwaj wyłącznie źródłowe SVG. Podczas tworzenia tej referencji zastosuj przypięty kontrakt `svg-assets-source-driven`; gotowy plik ma zawierać kompletny projektowy workflow, contexty, ścieżki, komendy i wyjątki bez uruchamiania `pleo-design-system`. Generator musi odtworzyć typy, registry, framework exports i preview z nazw plików.

## Project-specific validation

- `<color/currentColor rules>`
- `<allowed SVG features and SVGR configs>`
- `<preview groups and visual checks>`
- `<consumer migration locations>`
