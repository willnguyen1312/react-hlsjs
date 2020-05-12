export const getElement = <K extends keyof HTMLElementTagNameMap>(
  container: HTMLElement,
  element: K
): HTMLElementTagNameMap[K] => {
  const result = container.querySelector(element);
  if (!result) throw new Error(`${element} is not available`);

  return result;
};
