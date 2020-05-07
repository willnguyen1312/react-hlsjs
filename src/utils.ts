export type Func = () => void;
export const callAll = (...fns: (Func | undefined)[]) => () =>
  fns.forEach(fn => fn && fn());
