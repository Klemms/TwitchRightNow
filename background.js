let backgroundColor = "#88549e";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({backgroundColor});
    console.log("color set");
});