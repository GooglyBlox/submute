document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("muted-list");
  const searchInput = document.getElementById("search-input");
  const sortCheckbox = document.getElementById("sort-checkbox");

  let mutedSubreddits = [];

  browser.storage.sync
    .get(["mutedSubreddits"])
    .then((result) => {
      mutedSubreddits = result.mutedSubreddits || [];
      renderList();
    })
    .catch((error) => {
      console.error(`SubMute: Storage error - ${error}`);
    });

  searchInput.addEventListener("input", () => {
    renderList();
  });

  sortCheckbox.addEventListener("change", () => {
    renderList();
  });

  function renderList() {
    const query = searchInput.value.toLowerCase();
    const isSorted = sortCheckbox.checked;

    let filtered = mutedSubreddits.filter((sub) =>
      sub.toLowerCase().includes(query)
    );

    if (isSorted) {
      filtered.sort((a, b) => a.localeCompare(b));
    }

    list.innerHTML = "";

    if (filtered.length === 0) {
      const noMuted = document.createElement("li");
      noMuted.className = "no-muted";
      noMuted.textContent = "No muted subreddits.";
      list.appendChild(noMuted);
      return;
    }

    filtered.forEach((sub) => {
      const li = document.createElement("li");

      const subName = document.createElement("span");
      subName.className = "subreddit-name";
      subName.textContent = `r/${sub}`;
      subName.setAttribute("data-fullname", `r/${sub}`);

      const unmuteBtn = document.createElement("button");
      unmuteBtn.className = "unmute-button";
      unmuteBtn.textContent = "Unmute";
      unmuteBtn.onclick = () => {
        removeSubreddit(sub);
      };

      li.appendChild(subName);
      li.appendChild(unmuteBtn);
      list.appendChild(li);
    });
  }

  function removeSubreddit(subreddit) {
    browser.storage.sync
      .get(["mutedSubreddits"])
      .then((result) => {
        let muted = result.mutedSubreddits || [];
        muted = muted.filter((s) => s !== subreddit);
        return browser.storage.sync.set({ mutedSubreddits: muted });
      })
      .then(() => {
        return browser.tabs.query({ active: true, currentWindow: true });
      })
      .then((tabs) => {
        return browser.tabs.reload(tabs[0].id);
      })
      .then(() => {
        window.close();
      })
      .catch((error) => {
        console.error(`Error unmuting subreddit: ${error}`);
      });
  }
});
