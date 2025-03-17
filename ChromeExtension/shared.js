export function getStorageSync(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], function (result) {
            resolve(result[key]);
        });
    });
}

export async function isLinkBroken(url) {
    try {
      const response = await fetch(`https://broken-link-checker-1xea.vercel.app/check?url=${url}`);
      console.log("response", response);
      return !response.ok; // Returns true if the link is broken
    } catch (error) {
        return true; // If fetch fails (network error, CORS issue, etc.), consider the link broken
    }
}

export async function openUrl(taskId) {
  if (!taskId) {
    console.error("Invalid taskId:", taskId);
    return;
  }

  let mainUrl = await getStorageSync("mainUrl");
  if (!mainUrl) return;

  let prefixes = await getStorageSync("prefixes");

  if (!Array.isArray(prefixes) || prefixes.length === 0) {
    let destinationUrl = mainUrl + taskId;
    chrome.tabs.create({ url: destinationUrl });
  } else {
    for (let prefix of prefixes) {
      let destinationUrl = mainUrl + prefix + taskId;
      chrome.tabs.create({ url: destinationUrl });
    }
  }
}