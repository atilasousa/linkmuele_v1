import { optionsVirusTotal } from "./plugins/virustotal.js";
import {
  sendMessageToOpenModal,
  setIcon,
  convertUrlToBase64,
  revertUrlFromBase64,
  storeDataInLocalStorage,
} from "./utils/utils.js";
import {
  addUrlToAnalysedLinks,
  checkIfUrlIsAnalysed,
} from "./utils/firebaseFunctions.js";

const runtimeHandler = async (message, sender, sendResponse) => {
  const tabId = sender.tab.id;
  const tabHref = new URL(message?.url).href;
  const resutl = await checkIfUrlIsAnalysed(tabHref);

  if (!resutl.exists) {
    console.log("not exists");
    if (message.type === "runtime") {
      console.log("runtime");
      try {
        const urlBase64 = convertUrlToBase64(tabHref);
        const { signal, abort } = new AbortController();

        const response = await fetch(
          `https://www.virustotal.com/api/v3/urls/${urlBase64}`,
          {
            ...optionsVirusTotal,
            signal,
          }
        );

        const { data, error } = await response.json();

        if (error) {
          console.log(error);
          return;
        }

        console.log(data);

        const tabData = {
          name: tabHref,
          id: tabId,
          analysed: true,
          abort,
        };

        const dataList = Object.entries(
          data?.attributes?.last_analysis_results
        );
        const urlStats = data?.attributes?.last_analysis_stats;

        const filterData = (category) =>
          Object.fromEntries(
            dataList.filter(([_, { result }]) =>
              result.toLowerCase().includes(category)
            )
          );

        const phishingData = filterData("phishing");
        const malwareData = filterData("malware");
        const maliciousData = filterData("malicious");

        if (Object.keys(phishingData).length) {
          tabData["phishing"] = true;
          urlStats["phishing"] = Object.keys(phishingData).length;

          setIcon(tabId, "dangerIcon");
        } else if (urlStats.malicious > 0) {
          tabData["malicious"] = true;

          setIcon(tabId, "warningIcon");

          addUrlToAnalysedLinks(tabHref, {
            type: "malicious",
            stats: urlStats,
            maliciousData,
          }).catch((error) => console.error(error));

          sendMessageToOpenModal();
        } else if (urlStats.malicious === 0 && urlStats.harmless > 0) {
          setIcon(tabId, "safeIcon");

          addUrlToAnalysedLinks(tabHref, {
            type: "safe",
          });
        }
      } catch (error) {
        console.error(error);
      }

      return true;
    }
  } else {
    if (resutl.data.urlStats.type === "malicious") {
      setIcon(tabId, "warningIcon");
    } else if (resutl.data.urlStats.type === "phishing") {
      setIcon(tabId, "dangerIcon");
    } else if (resutl.data.urlStats.type === "safe") {
      console.log("safe");
      setIcon(tabId, "safeIcon");
    }

    const revertedUrl = revertUrlFromBase64(resutl.data.id);

    storeDataInLocalStorage(revertedUrl, resutl.data);
  }
};

const removeTabHandler = (tabId, removed) => {
  const index = accessedTabs.findIndex((tab) => tab.id === tabId);

  if (index !== -1) {
    const removedTab = accessedTabs[index];
    if (!removedTab.analysed) removedTab.abort();
    accessedTabs.splice(index, 1);
  }
};

chrome.action.onClicked.addListener(() => {
  sendMessageToOpenModal();
});

chrome.runtime.onMessage.removeListener(runtimeHandler);

chrome.runtime.onMessage.addListener(runtimeHandler);

chrome.tabs.onRemoved.removeListener(removeTabHandler);

chrome.tabs.onRemoved.addListener(removeTabHandler);
