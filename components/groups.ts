// Interface from MultiSelector.tsx
export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** Fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

// These are options that users are allowed to choose on their user profiles.
export const FORM_OPTIONS: Option[] = [
  // Class of 20XX
  { label: "Class of 2025", value: "2025", group: "Class" },
  { label: "Class of 2026", value: "2026", group: "Class" },
  { label: "Class of 2027", value: "2027", group: "Class" },
  { label: "Class of 2028", value: "2028", group: "Class" },
];

// These are options that users are *not* allowed to remove from their profile.
export const FIXED_OPTIONS: Option[] = [
  // Executives
  { label: "Executive Team 24-25", value: "exec2425", group: "Executive", fixed: true }
];

export const ALL_GROUPS: Option[] = FORM_OPTIONS.concat(FIXED_OPTIONS);

// In the database, groups are stored as these "values". We turn the values into the group option
// here so that they appear in the form.
export function transformGroups(userGroups: Array<string>) {
  const groups = [];

  for (const group of userGroups) {
    const formOption = FORM_OPTIONS.find(option => option.value === group);
    const fixedOption = FIXED_OPTIONS.find(option => option.value === group);
    if (formOption) groups.push(formOption);
    if (fixedOption) groups.push(fixedOption);
  }

  return groups;
}