import { TaskPriority } from "./enums.js";
export function getElementById(selector) {
    const element = document.getElementById(selector);
    if (element) {
        return element;
    }
    else {
        throw new Error(`Element with selector "${selector}" not found.`);
    }
}
export function setTextContent(element, text) {
    element.textContent = String(text);
}
export function clearElementTextContent(element) {
    element.textContent = "";
}
export function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
export function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
export function removeFromStorage(key) {
    localStorage.removeItem(key);
}
export function addToStorageList(key, item) {
    const list = getFromStorage(key) || [];
    list.push(item);
    saveToStorage(key, list);
}
export function removeFromStorageList(key, id) {
    const list = getFromStorage(key) || [];
    const updatedList = list.filter((item) => item.id !== id);
    saveToStorage(key, updatedList);
}
export function calcTaskDuration(date) {
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
    }
    else if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`;
    }
    else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }
    else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }
    else if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }
    else if (diffInWeeks < 4) {
        return `${diffInWeeks}w ago`;
    }
    else if (diffInMonths < 12) {
        return `${diffInMonths}mo ago`;
    }
    else {
        return `${diffInYears}y ago`;
    }
}
export function getPriorityColor(priority) {
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
export function getPriorityBackgroundColor(priority) {
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
