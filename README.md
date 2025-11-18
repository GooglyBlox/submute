# SubMute

SubMute is a Chrome (and now Firefox!) extension that allows you to mute subreddits directly from [r/popular](https://www.reddit.com/r/popular/). Developed in response to the request [A Chrome Extension that lets you mute a subreddit](https://www.reddit.com/r/SomebodyMakeThis/comments/1fjiqqo/a_chrome_extension_that_lets_you_mute_a_subreddit/).

![SubMute Preview](preview.gif)

## Installation

### Chrome Version

[![Install from Chrome Web Store](https://developer.chrome.com/static/docs/webstore/branding/image/206x58-chrome-web-bcb82d15b2486.png)](https://chromewebstore.google.com/detail/submute/ipcibelokeebihhlpcjcpnggaafhgmdl)

#### Method 1: Cloning via Git

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/GooglyBlox/submute.git
   ```

2. **Load Unpacked Extension:**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the `chrome` directory within the cloned `submute` directory.

3. **Verify Installation:**
   - Once loaded, you should see the **SubMute** icon appear in the Chrome toolbar.

#### Method 2: Download from the Latest Release

1. **Download the Latest Release:**
   - Visit the [SubMute Releases](https://github.com/GooglyBlox/submute/releases/latest) page.
   - Download the `submute-chrome.zip` file.

2. **Extract the Files:**
   - Extract the downloaded `.zip` file to a directory of your choice.

3. **Load the Extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the extracted `submute` directory.

4. **Verify Installation:**
   - Once loaded, you should see the **SubMute** icon appear in the Chrome toolbar.

### Firefox Version

[![Get the add-on](https://extensionworkshop.com/assets/img/documentation/publish/get-the-addon-178x60px.dad84b42.png)](https://addons.mozilla.org/en-US/firefox/addon/submute)

#### Method 1: Cloning via Git

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/GooglyBlox/submute.git
   ```

2. **Load the Extension:**
   - Open Firefox and navigate to `about:debugging`.
   - Click **This Firefox**.
   - Click **Load Temporary Add-on** and select the `manifest.json` file from the `firefox` directory within the cloned `submute` directory.

3. **Verify Installation:**
   - Once loaded, you should see the **SubMute** icon appear in the Firefox toolbar.

#### Method 2: Download from the Latest Release

1. **Download the Latest Release:**
   - Visit the [SubMute Releases](https://github.com/GooglyBlox/submute/releases/latest) page.
   - Download the `submute-firefox.xpi` file.

2. **Install the Extension:**
   - Open Firefox and navigate to `about:addons`.
   - Click the gear icon and select **Install Add-on From File**.
   - Select the downloaded `.xpi` file.

3. **Verify Installation:**
   - Once installed, you should see the **SubMute** icon appear in the Firefox toolbar.

## Usage

1. **Mute a Subreddit:**
   - Go to [r/popular](https://www.reddit.com/r/popular/).
   - Click the **Mute** button next to the subreddit you wish to hide.

2. **Manage Muted Subreddits:**
   - Click the **SubMute** icon in the browser toolbar.
   - View your muted subreddits and click **Unmute** to remove any.
