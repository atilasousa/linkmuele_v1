import excludeGlobs from "../excludeUrls/excludeUrls.json";

export const sendMessageToOpenModal = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0]?.id, { action: "open_modal" });
  });
};

export const sendMessageToContentScript = (tabId, message) => {
  chrome.tabs.sendMessage(tabId, message);
};

export const setIcon = (tabId, type) => {
  chrome.action.setIcon({
    tabId,
    path: {
      16: `./assets/images/${type}/16.png`,
      32: `./assets/images/${type}/32.png`,
      48: `./assets/images/${type}/48.png`,
      128: `./assets/images/${type}/128.png`,
    },
  });
};

export const convertUrlToBase64 = (url) => {
  return btoa(url).replace(/^\=+|\=+$/g, "");
};

export const revertUrlFromBase64 = (url) => {
  return btoa(url).replace(/-/g, "/");
};

export const storeDataInLocalStorage = (key, data) => {
  chrome.storage.local.set({
    [key]: data,
  });
};
