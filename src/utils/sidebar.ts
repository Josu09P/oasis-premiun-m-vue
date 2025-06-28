export type SidebarState = 'visible' | 'hidden';

export interface SidebarElements {
  toggleBtn: HTMLElement;
  sidebar: HTMLElement;
  mainContent: HTMLElement;
}

export const getSidebarElements = (): SidebarElements | null => {
  const toggleBtn = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");

  if (!toggleBtn || !sidebar || !mainContent) {
    console.warn("No se encontraron todos los elementos del sidebar");
    return null;
  }

  return { toggleBtn, sidebar, mainContent };
};

export const getSavedSidebarState = (): SidebarState | null => {
  const savedState = localStorage.getItem("sidebarState");
  return savedState === "hidden" || savedState === "visible" ? savedState : null;
};

export const applySidebarState = (elements: SidebarElements, state: SidebarState): void => {
  const { sidebar, mainContent } = elements;

  if (state === "hidden") {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("full-width");
  } else {
    sidebar.classList.remove("collapsed");
    mainContent.classList.remove("full-width");
  }
};

export const toggleSidebar = (elements: SidebarElements): void => {
  const { sidebar, mainContent } = elements;
  const isCollapsed = sidebar.classList.contains("collapsed");

  if (isCollapsed) {
    sidebar.classList.remove("collapsed");
    mainContent.classList.remove("full-width");
    localStorage.setItem("sidebarState", "visible");
  } else {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("full-width");
    localStorage.setItem("sidebarState", "hidden");
  }
};

export const initializeSidebar = (): void => {
  const elements = getSidebarElements();
  if (!elements) return;

  const savedState = getSavedSidebarState();
  if (savedState) {
    applySidebarState(elements, savedState);
  }

  elements.toggleBtn.addEventListener("click", () => toggleSidebar(elements));
};
