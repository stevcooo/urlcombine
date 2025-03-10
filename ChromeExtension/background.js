import { openUrl } from "./shared.js";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openNewTab",
    title: "Open '%s'",
    contexts: ["selection"] // Only show for selected text
  });
});


chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "openNewTab" && info.selectionText) {
      const query = encodeURIComponent(info.selectionText);
      await openUrl(query);
  }
});
