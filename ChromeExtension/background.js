chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openNewTab",
    title: "Open Task '%s'",
    contexts: ["selection"] // Only show for selected text
  });
});


chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "openNewTab" && info.selectionText) {
      console.log("Opening new tab with task: " + info.selectionText);
    const query = encodeURIComponent(info.selectionText);

    // Retrieve a value from chrome.storage.local
    const mainUrl = await getStoredValue("mainUrl");
    const prefixId = await getStoredValue("prefixId");
      
    var destinationUrl = mainUrl + prefixId + query;
    if (!destinationUrl.startsWith("http")) {
      destinationUrl = "http://" + destinationUrl;
    }
    chrome.tabs.create({ url: destinationUrl });
  }
});

// Helper function to get data from storage
async function getStoredValue(key) {
  return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
          console.log("Retrieved value for key " + key + ": " + result);
      resolve(result[key]); // Return the stored value or undefined if not set
    });
  });
}
