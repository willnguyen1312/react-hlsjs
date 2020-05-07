export type Func = () => void;
export const callAll = (...fns: (Func | Func[] | undefined)[]) => () => {
  const flatFns = flattenArr(fns) as (Func | undefined)[];
  flatFns.forEach(fn => fn && fn());
};

const flattenArr = (arr: any[]) =>
  arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flattenArr(toFlatten) : toFlatten),
    []
  );
