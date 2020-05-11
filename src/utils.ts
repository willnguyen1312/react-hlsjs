export type Func = (
  event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement, Event>
) => void;
export const callAll = (...fns: (Func | Func[] | undefined)[]) => (
  event: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement, Event>
) => {
  const flatFns = flattenArr(fns) as (Func | undefined)[];
  flatFns.forEach(fn => fn && fn(event));
};

const flattenArr = (arr: any[]) =>
  arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flattenArr(toFlatten) : toFlatten),
    []
  );
