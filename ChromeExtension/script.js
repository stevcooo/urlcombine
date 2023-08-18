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

  document.getElementById("mainUrl").addEventListener("focusout", storeSettings);
  document.getElementById("prefixId").addEventListener("focusout", storeSettings);

  document.getElementsByTagName("BODY")[0].style.width = "400px";
  document.getElementsByTagName("html")[0].style.height = "120px";
  document.getElementsByClassName("settings").hidden = true;
  chrome.storage.local.get("prefixId", function (result) {
    if (result.prefixId != undefined) document.getElementById("prefixId").value = result.prefixId;
  });

  chrome.storage.local.get("mainUrl", function (result) {
    if (result.mainUrl != undefined) document.getElementById("mainUrl").value = result.mainUrl;
  });
});

document.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    document.getElementById("openUrlBtn").click();
  }
});

function openUrl() {
  var mainUrl = document.getElementById("mainUrl").value;
  var prefixId = document.getElementById("prefixId").value;
  var taskId = document.getElementById("taskId").value;

  if (mainUrl != undefined) {
    storeSettings();

    var destinationUrl = mainUrl + prefixId + taskId;
    if (!destinationUrl.startsWith("http")) {
      destinationUrl = "http://" + destinationUrl;
    }

    chrome.tabs.create({ url: destinationUrl });
  }
}

function storeSettings() {
  var mainUrl = document.getElementById("mainUrl").value;
  var prefixId = document.getElementById("prefixId").value;

  chrome.storage.local.set({ prefixId: prefixId });
  chrome.storage.local.set({ mainUrl: mainUrl });
}

function toggleSettingsControls() {
  var isHidden = document.getElementsByClassName("settings").hidden;
  if (isHidden) {
    document.getElementsByTagName("html")[0].style.height = "290px";
    document.getElementsByClassName("settings").hidden = false;
  } else {
    document.getElementsByTagName("html")[0].style.height = "120px";
    document.getElementsByClassName("settings").hidden = true;
  }
}
