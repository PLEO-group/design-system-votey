# Historia zmian

## 1.2.1

- Ujednolicono odczyt i aktualizację machine frontmatter artefaktów dla wartości bez cudzysłowów oraz zapisanych w pojedynczych lub podwójnych cudzysłowach.
- Generator typów manifestu formatuje wynik konfiguracją Prettiera właściwą dla pliku docelowego przed zapisem i porównaniem `--check`, dzięki czemu `nx format` nie powoduje fałszywego błędu nieaktualnego artefaktu.
