export interface Hook {
  get?: () => any;
  set?: (data: any) => void;
}