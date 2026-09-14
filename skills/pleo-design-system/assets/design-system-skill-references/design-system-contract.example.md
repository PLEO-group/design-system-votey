# Design system contract

- Package: `<package-name>`
- Registry/distribution: `<registry and mode>`
- Package version: `<semver>`
- Verified at: `<commit and date>`
- Repository topology/package root: `<values>`
- Public entry points: `<angular/react>`
- Skill source path: `<designSystemSkill.sourcePath>`
- Artifact policy: `<policy>`
- Mini-DS policy: `<forbid/migration-baseline/approved-embedded-small-project>`; dla ostatniego wariantu podaj regułę wyjątku i uzasadnienie z manifestu.

## Company contract pins

| Contract pin | Local reference | Status |
| --- | --- | --- |
| `<id>@<semver>` | `references/<file>.md` | `<verified/migration-required>` |

Lista musi być identyczna z `designSystemSkill.companyStandardContracts` w manifeście.

## Ownership

| Concern | Figma | DS package | Angular consumer | React consumer |
| --- | --- | --- | --- | --- |
| `<tokens/components/grid/...>` | `<role>` | `<role>` | `<role>` | `<role>` |

## Approved exceptions and migrations

- `<rule/status/reason/approval/migration link or none>`
