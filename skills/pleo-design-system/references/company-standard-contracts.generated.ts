/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: company-standard-contracts.schema.json
 * Regenerate with scripts/generate-manifest-types.mjs.
 */

/**
 * Jedna wersja kontraktu firmowego i jej polityka aktualizacji.
 */
export interface Contract {
  /**
   * Stabilny identyfikator funkcjonalnego kontraktu.
   */
  id: string;
  /**
   * Wersja kontraktu zgodna z SemVer.
   */
  version: string;
  /**
   * Czy jest to bieżąca, czy zastąpiona wersja kontraktu.
   */
  status: "current" | "superseded";
  /**
   * Reakcja walidatora, gdy skill projektowy przypina starszą wersję.
   */
  upgradePolicy: "review-on-stale" | "block-on-stale";
  /**
   * Centralna referencja Markdown w tym samym katalogu references.
   */
  reference: string;
  /**
   * Krótki opis gwarancji dostarczanej przez kontrakt.
   */
  summary: string;
}

/**
 * Maszynowy rejestr wersjonowanych kontraktów firmowych przypinanych przez manifesty design systemów.
 */
export interface CompanyStandardContractsRegistry {
  /**
   * Ścieżka lub URI schemy rejestru.
   */
  $schema?: string;
  /**
   * Wersja struktury rejestru, niezależna od wersji kontraktów.
   */
  schemaVersion: 1;
  /**
   * Wersjonowane kontrakty dostępne skillom projektowym.
   */
  contracts: Array<Contract>;
}
