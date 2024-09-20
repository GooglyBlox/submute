function createMuteButton(subreddit) {
    const button = document.createElement('button');
    button.innerText = 'Mute';
    button.className = 'mute-button button-secondary button-x-small button join-btn leading-none h-[24px]';
    button.onclick = () => {
        muteSubreddit(subreddit);
        button.disabled = true;
        button.innerText = 'Muted';
    };
    return button;
}

function muteSubreddit(subreddit) {
    chrome.storage.sync.get(['mutedSubreddits'], (result) => {
        let muted = result.mutedSubreddits || [];
        if (!muted.includes(subreddit)) {
            muted.push(subreddit);
            chrome.storage.sync.set({ mutedSubreddits: muted }, () => {
                if (chrome.runtime.lastError) {
                    console.error(`Error muting subreddit: ${chrome.runtime.lastError}`);
                    return;
                }
                console.log(`Muted subreddit: ${subreddit}`);
                hideMutedPosts();
            });
        }
    });
}

function hideMutedPosts() {
    chrome.storage.sync.get(['mutedSubreddits'], (result) => {
        const muted = result.mutedSubreddits || [];
        if (muted.length === 0) return;

        muted.forEach((sub) => {
            const subredditLinks = document.querySelectorAll(`a[data-testid="subreddit-name"]`);
            subredditLinks.forEach((link) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith(`/r/${sub}/`)) {
                    const shredditPost = link.closest('shreddit-post');
                    if (shredditPost) {
                        shredditPost.style.display = 'none';
                    }
                }
            });
        });
    });
}

function addMuteButtons() {
    chrome.storage.sync.get(['mutedSubreddits'], (result) => {
        const muted = result.mutedSubreddits || [];
        let joinButtons = document.querySelectorAll('shreddit-join-button');

        if (joinButtons.length === 0) {
            joinButtons = document.querySelectorAll('button[aria-label="Join"]');
            console.log(`SubMute: Found ${joinButtons.length} fallback join buttons.`);
        } else {
            console.log(`SubMute: Found ${joinButtons.length} join buttons.`);
        }

        joinButtons.forEach((joinButton) => {
            if (joinButton.nextSibling && joinButton.nextSibling.classList && joinButton.nextSibling.classList.contains('mute-button')) {
                return;
            }

            let shredditPost = joinButton.closest('shreddit-post');
            if (!shredditPost) {
                shredditPost = joinButton.closest('article');
                if (!shredditPost) {
                    console.log('SubMute: No post container found for a join button.');
                    return;
                }
            }

            const subredditLink = shredditPost.querySelector('a[data-testid="subreddit-name"]');
            if (!subredditLink) {
                console.log('SubMute: Subreddit link not found within a post.');
                return;
            }

            const subreddit = subredditLink.innerText.replace(/^r\//, '').trim();
            console.log(`SubMute: Processing subreddit: r/${subreddit}`);

            if (muted.includes(subreddit)) {
                console.log(`SubMute: Subreddit r/${subreddit} is already muted.`);
                shredditPost.style.display = 'none';
                return;
            }

            const muteBtn = createMuteButton(subreddit);
            joinButton.parentNode.insertBefore(muteBtn, joinButton.nextSibling);
        });
    });
}

addMuteButtons();
hideMutedPosts();

const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            shouldRun = true;
        }
    });
    if (shouldRun) {
        console.log('SubMute: Mutation detected, adding mute buttons.');
        addMuteButtons();
        hideMutedPosts();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
