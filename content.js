const createMuteControl = (subreddit) => {
  const button = document.createElement("button");
  button.innerText = "Mute";
  button.className =
    "mute-button button-secondary button-x-small button join-btn leading-none h-[24px]";
  button.onclick = () => {
    toggleSubredditMute(subreddit);
    button.disabled = true;
    button.innerText = "Muted";
  };
  return button;
};

const toggleSubredditMute = (subreddit) => {
  chrome.storage.sync.get(["mutedSubreddits"], (result) => {
    const mutedList = result.mutedSubreddits || [];
    if (!mutedList.includes(subreddit)) {
      mutedList.push(subreddit);
      updateMutedSubreddits(mutedList);
    }
  });
};

const updateMutedSubreddits = (mutedList) => {
  chrome.storage.sync.set({ mutedSubreddits: mutedList }, () => {
    if (chrome.runtime.lastError) {
      console.error(`SubMute: Storage error - ${chrome.runtime.lastError}`);
      return;
    }
    updateFeed();
  });
};

const updateFeed = () => {
  chrome.storage.sync.get(["mutedSubreddits"], (result) => {
    const mutedList = result.mutedSubreddits || [];
    if (mutedList.length === 0) return;

    const subredditPosts = document.querySelectorAll(
      'a[data-testid="subreddit-name"]'
    );
    subredditPosts.forEach((link) => {
      const subredditPath = link.getAttribute("href");
      const shouldHide = mutedList.some((sub) =>
        subredditPath?.startsWith(`/r/${sub}/`)
      );

      if (shouldHide) {
        const postContainer =
          link.closest("shreddit-post") || link.closest("article");
        if (postContainer) {
          postContainer.style.display = "none";
        }
      }
    });
  });
};

const initializeMuteControls = () => {
  chrome.storage.sync.get(["mutedSubreddits"], (result) => {
    const mutedList = result.mutedSubreddits || [];
    const joinButtons = getJoinButtons();

    joinButtons.forEach((joinButton) => {
      if (hasExistingMuteControl(joinButton)) return;

      const postData = extractPostData(joinButton);
      if (!postData) return;

      const { container, subreddit } = postData;

      if (mutedList.includes(subreddit)) {
        container.style.display = "none";
        return;
      }

      const muteButton = createMuteControl(subreddit);
      joinButton.parentNode.insertBefore(muteButton, joinButton.nextSibling);
    });
  });
};

const getJoinButtons = () => {
  const primary = document.querySelectorAll("shreddit-join-button");
  return primary.length > 0
    ? primary
    : document.querySelectorAll('button[aria-label="Join"]');
};

const hasExistingMuteControl = (button) => {
  return button.nextSibling?.classList?.contains("mute-button");
};

const extractPostData = (joinButton) => {
  const container =
    joinButton.closest("shreddit-post") || joinButton.closest("article");
  if (!container) return null;

  const subredditLink = container.querySelector(
    'a[data-testid="subreddit-name"]'
  );
  if (!subredditLink) return null;

  const subreddit = subredditLink.innerText.replace(/^r\//, "").trim();
  return { container, subreddit };
};

const isPopularFeed = () => {
  const isPopularUrl = /^https?:\/\/(www\.)?reddit\.com\/r\/popular\/?/.test(
    window.location.href
  );
  const hasPopularInPath = window.location.pathname.includes("/r/popular");
  return isPopularUrl || hasPopularInPath;
};

let debounceTimeout;
const debounce = (func, wait) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(func, wait);
};

const handleNavigationChange = () => {
  if (isPopularFeed()) {
    debounce(() => {
      initializeMuteControls();
      updateFeed();
    }, 100);
  }
};

const setupNavigationWatcher = () => {
  if ("navigation" in window) {
    window.navigation.addEventListener("navigate", () => {
      handleNavigationChange();
    });

    window.navigation.addEventListener("navigatesuccess", () => {
      handleNavigationChange();
    });
  }

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
      handleNavigationChange();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      handleNavigationChange();
    }
  }).observe(document.documentElement, { subtree: true, childList: true });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupNavigationWatcher();
    handleNavigationChange();
  });
} else {
  setupNavigationWatcher();
  handleNavigationChange();
}

window.addEventListener("load", handleNavigationChange);
window.addEventListener("popstate", handleNavigationChange);
window.addEventListener("pushstate", handleNavigationChange);
window.addEventListener("replacestate", handleNavigationChange);
