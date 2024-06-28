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