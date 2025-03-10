import { openUrl } from "./shared.js";
/**
 * Track a click on a button using the asynchronous tracking API.
 *
 * See http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html
 * for information on how to use the asynchronous tracking API.
 */
function trackButtonClick(e) {
  _gaq.push(["_trackEvent", e.target.id, "clicked"]);
}

const documentMinBodyHeight = "108px";

document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById("openUrlBtn").addEventListener("click", openTask);
  document.getElementById("settingsToggle").addEventListener("click", toggleSettingsControls);
  document.getElementById("addProjectPrefixBtn").addEventListener("click", addProjectPrefix);

  document.getElementById("mainUrl").addEventListener("focusout", storeSettings);

  document.getElementsByTagName("BODY")[0].style.width = "400px";
  document.getElementsByTagName("BODY")[0].style.height = documentMinBodyHeight;

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

async function openTask() {
  var taskId = document.getElementById("taskId").value;
  await openUrl(taskId);
}

async function addProjectPrefix() {
  addProjectPrefixElement("", document.getElementById("prefixesContainer"));
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
  const isOnMinHeight = document.getElementsByTagName("BODY")[0].style.height === documentMinBodyHeight;
  document.getElementsByTagName("BODY")[0].style.height = isOnMinHeight ? null : documentMinBodyHeight;
}