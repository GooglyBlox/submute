document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('muted-list');

    chrome.storage.sync.get(['mutedSubreddits'], (result) => {
        const muted = result.mutedSubreddits || [];
        list.innerHTML = '';

        if (muted.length === 0) {
            const noMuted = document.createElement('li');
            noMuted.className = 'no-muted';
            noMuted.textContent = 'No muted subreddits.';
            list.appendChild(noMuted);
            return;
        }

        muted.forEach((sub) => {
            const li = document.createElement('li');

            const subName = document.createElement('span');
            subName.className = 'subreddit-name';
            subName.textContent = `r/${sub}`;
            subName.setAttribute('data-fullname', `r/${sub}`);

            const unmuteBtn = document.createElement('button');
            unmuteBtn.className = 'unmute-button';
            unmuteBtn.textContent = 'Unmute';
            unmuteBtn.onclick = () => {
                removeSubreddit(sub);
            };

            li.appendChild(subName);
            li.appendChild(unmuteBtn);
            list.appendChild(li);
        });
    });

    function removeSubreddit(subreddit) {
        chrome.storage.sync.get(['mutedSubreddits'], (result) => {
            let muted = result.mutedSubreddits || [];
            muted = muted.filter((s) => s !== subreddit);
            chrome.storage.sync.set({ mutedSubreddits: muted }, () => {
                if (chrome.runtime.lastError) {
                    console.error(`Error unmuting subreddit: ${chrome.runtime.lastError}`);
                    return;
                }
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.reload(tabs[0].id);
                });
                window.close();
            });
        });
    }
});