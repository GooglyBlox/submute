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
  return /^https?:\/\/(www\.)?reddit\.com\/r\/popular\/?/.test(
    window.location.href
  );
};

const handleUrlChange = () => {
  if (isPopularFeed()) {
    initializeMuteControls();
    updateFeed();
  }
};

let currentUrl = window.location.href;

const initializeObserver = () => {
  const observer = new MutationObserver((mutations) => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      handleUrlChange();
      return;
    }

    if (
      mutations.some((mutation) => mutation.addedNodes.length) &&
      isPopularFeed()
    ) {
      initializeMuteControls();
      updateFeed();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", handleUrlChange);
} else {
  handleUrlChange();
}

initializeObserver();
