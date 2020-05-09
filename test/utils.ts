export const queryElement = <K extends keyof HTMLElementTagNameMap>(
  container: HTMLElement,
  elemnt: K
): HTMLElementTagNameMap[K] => {
  const result = container.querySelector(elemnt);
  if (!result) throw new Error(`${elemnt} is not available`);

  return result;
};
