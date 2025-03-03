/**
 * Track a click on a button using the asynchronous tracking API.
 *
 * See http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html
 * for information on how to use the asynchronous tracking API.
 */
function trackButtonClick(e) {
  _gaq.push(["_trackEvent", e.target.id, "clicked"]);
}

document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById("openUrlBtn").addEventListener("click", openUrl);
  document.getElementById("settingsToggle").addEventListener("click", toggleSettingsControls);
  document.getElementById("addProjectPrefixBtn").addEventListener("click", addProjectPrefix);

  document.getElementById("mainUrl").addEventListener("focusout", storeSettings);

  document.getElementsByTagName("BODY")[0].style.width = "400px";
  //document.getElementsByTagName("html")[0].style.height = "108px";
  document.getElementsByClassName("settings").hidden = true;

  chrome.storage.local.get("mainUrl", function (result) {
    if (result.mainUrl != undefined) document.getElementById("mainUrl").value = result.mainUrl;
  });

  chrome.storage.local.get("prefixes", function (result) {
    console.log("prefixes", result.prefixes);
    if (!result.prefixes) return;
   
    var prefixes = result.prefixes;
    var prefixesContainer = document.getElementById("prefixesContainer");
    for (var i = 0; i < prefixes.length; i++) {
      addProjectPrefixElement(prefixes[i], prefixesContainer);
    }
  });

});

function addProjectPrefixElement(prefix, parentElement) {
      var div = document.createElement("div");
      div.className = "field";
      var input = document.createElement("input");
      input.type = "text";
      input.value = prefix;
      input.className = "projectPrefixInput";
      input.addEventListener("focusout", storeSettings);
      div.appendChild(input);
      var label = document.createElement("label");
      label.htmlFor = "prefixId";
      var span = document.createElement("span");
      span.innerHTML = "Project prefix";
      label.appendChild(span);
  div.appendChild(label);
  // Here I need to add a button to remove the prefix
  var removeButton = document.createElement("button");
  removeButton.innerHTML = "Remove";
  removeButton.className = "active";
  removeButton.onclick = function () {
    div.remove();
    storeSettings();
  }
  div.appendChild(removeButton);

      parentElement.appendChild(div);
}

document.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    document.getElementById("openUrlBtn").click();
  }
});

async function openUrl() {
  let mainUrl = await getStorageSync("mainUrl");
  if (!mainUrl) return;
  
  let prefixes = await getStorageSync("prefixes");
  var taskId = document.getElementById("taskId").value;

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

async function addProjectPrefix() {
  addProjectPrefixElement("", document.getElementById("prefixesContainer"));
}

async function isLinkBroken(url) {
    try {
      const response = await fetch(`https://broken-link-checker-1xea.vercel.app/check?url=${url}`);
      console.log("response", response);
      return !response.ok; // Returns true if the link is broken
    } catch (error) {
        return true; // If fetch fails (network error, CORS issue, etc.), consider the link broken
    }
}

function storeSettings() {
  var mainUrl = document.getElementById("mainUrl").value;
  chrome.storage.local.set({ mainUrl: mainUrl });

  // Here I need to collect all values from the inputs with class `projectPrefixInput`
  // and store them in the storage
  var projectPrefixInputs = document.getElementsByClassName("projectPrefixInput");
  var prefixes = [];
  for (var i = 0; i < projectPrefixInputs.length; i++) {
    const value = projectPrefixInputs[i].value;
    if (value) prefixes.push(value);
  }
  chrome.storage.local.set({ prefixes: prefixes });
}

function toggleSettingsControls() {
  var isHidden = document.getElementsByClassName("settings").hidden;
  if (isHidden) {
    document.getElementsByTagName("html")[0].style.height = "270px";
    document.getElementsByClassName("settings").hidden = false;
  } else {
    document.getElementsByTagName("html")[0].style.height = "108px";
    document.getElementsByClassName("settings").hidden = true;
  }
}

function getStorageSync(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], function (result) {
            resolve(result[key]);
        });
    });
}