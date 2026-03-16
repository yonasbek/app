/**
 * Department codes (plan types) used across the app: PFRD, ECCD, HDD, SRD, LEO.
 * Use this enum and DEPARTMENT_OPTIONS everywhere for dropdowns and display.
 */
export const DepartmentCode = {
  PFRD: 'PFRD',
  ECCD: 'ECCD',
  HDD: 'HDD',
  SRD: 'SRD',
  LEO: 'LEO',
} as const;

export type DepartmentCodeType = (typeof DepartmentCode)[keyof typeof DepartmentCode];

export const DEPARTMENT_OPTIONS: { value: DepartmentCodeType; label: string }[] = [
  { value: 'PFRD', label: 'PFRD - Pre-Facility & Referral Development' },
  { value: 'ECCD', label: 'ECCD - Emergency & Critical Care Development' },
  { value: 'HDD', label: 'HDD - Hospital Development Directorate' },
  { value: 'SRD', label: 'SRD - Specialty & Rehabilitative Services' },
  { value: 'LEO', label: 'LEO - Lead Executive Officer' },
];

export function getDepartmentLabel(code: string | null | undefined): string {
  if (!code) return '';
  const opt = DEPARTMENT_OPTIONS.find((o) => o.value === code);
  return opt ? opt.label : code;
}

/** For filters that include "All" (e.g. my-tasks). */
export const DEPARTMENT_OPTIONS_WITH_ALL: { value: DepartmentCodeType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Departments' },
  ...DEPARTMENT_OPTIONS,
];
