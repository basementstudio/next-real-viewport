function debounce(func: () => void, wait: number, immediate?: boolean) {
  let timeout: number | null;
  return function () {
    timeout && window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      timeout = null;
      if (!immediate) func();
    }, wait);
    if (immediate && !timeout) func();
  };
}

export { debounce };
