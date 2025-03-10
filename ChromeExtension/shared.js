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
  let mainUrl = await getStorageSync("mainUrl");
  if (!mainUrl) return;
  
  let prefixes = await getStorageSync("prefixes");

  if (!prefixes || prefixes.length === 0) {
    //In this case we will open the mainUrl + taskId
    var destinationUrl = mainUrl + taskId;
    chrome.tabs.create({ url: destinationUrl });
  }
  else { // we will open the mainUrl + prefix + taskId for each prefix
      for (var i = 0; i < prefixes.length; i++) {
      var destinationUrl = mainUrl + prefixes[i] + taskId;
      if (!destinationUrl.startsWith("http")) {
        destinationUrl = "http://" + destinationUrl;
      }

      if (!await isLinkBroken(destinationUrl)) {
            chrome.tabs.create({ url: destinationUrl });
      } else {
        console.log("Link is broken", destinationUrl);
      }
    }
  }
  
}