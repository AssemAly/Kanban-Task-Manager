import { TaskPriority } from "./enums.js";
export function getElementById<T extends HTMLElement>(selector: string): T {
  const element = document.getElementById(selector);
  if (element) {
    return element as T;
  } else {
    throw new Error(`Element with selector "${selector}" not found.`);
  }
}
export function setTextContent(
  element: HTMLElement,
  text: string | number,
): void {
  element.textContent = String(text);
}
export function clearElementTextContent(element: HTMLElement): void {
  element.textContent = "";
}
export function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromStorage<T>(key: string): T | null {
  const data = localStorage.getItem(key);
  return data ? (JSON.parse(data) as T) : null;
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}

export function addToStorageList<T>(key: string, item: T): void {
  const list = getFromStorage<T[]>(key) || [];
  list.push(item);
  saveToStorage(key, list);
}

export function removeFromStorageList<T extends { id: number | string }>(
  key: string,
  id: number | string,
): void {
  const list = getFromStorage<T[]>(key) || [];
  const updatedList = list.filter((item) => item.id !== id);
  saveToStorage(key, updatedList);
}

export function calcTaskDuration(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 10) {
    return "Just now";
  } else if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  } else {
    return `${diffInYears}y ago`;
  }
}
export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.High:
      return "#dc3545";
    case TaskPriority.Medium:
      return "#F59E0B";
    case TaskPriority.Low:
      return "#3B82F6";
    default:
      return "gray";
  }
}

export function getPriorityBackgroundColor(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.High:
      return "#fee";
    case TaskPriority.Medium:
      return "#FEF3C7";
    case TaskPriority.Low:
      return "#EFF6FF";
    default:
      return "rgba(128, 128, 128, 0.1)";
  }
}
