export const scrollToElement = (id: string) => {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
};

export const openInNewTab = (url: string) => {
  window.open(url, "_blank").focus();
};
