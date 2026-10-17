// App -> glyph mapping.
// A package string may be "com.pkg/fully.qualified.Activity"; additional
// candidate activities improve hit rate across launchers and app versions.

const app = (id, label, glyph, ...pkgs) => ({ id, label, glyph, pkgs });

export const APPS = [
  app(
    "phone",
    "Phone",
    "phone",
    "com.android.dialer/com.android.dialer.main.impl.MainActivity",
    "com.android.dialer/com.android.dialer.DialtactsActivity",
    "com.google.android.dialer/com.google.android.dialer.extensions.GoogleDialtactsActivity",
    "com.google.android.dialer/com.android.dialer.main.impl.MainActivity",
    "com.samsung.android.dialer/com.samsung.android.dialer.DialtactsActivity",
  ),
  app(
    "messages",
    "Messages",
    "messages",
    "com.google.android.apps.messaging/com.google.android.apps.messaging.ui.ConversationListActivity",
    "com.android.mms/com.android.mms.ui.ConversationList",
    "com.samsung.android.messaging/com.samsung.android.messaging.ui.view.main.WithActivity",
  ),
  app(
    "contacts",
    "Contacts",
    "contacts",
    "com.google.android.contacts/com.android.contacts.activities.PeopleActivity",
    "com.android.contacts/com.android.contacts.activities.PeopleActivity",
    "com.samsung.android.app.contacts/com.samsung.android.contacts.activities.PeopleActivity",
  ),
  app(
    "camera",
    "Camera",
    "camera",
    "com.google.android.GoogleCamera/com.android.camera.CameraActivity",
    "com.android.camera/com.android.camera.CameraActivity",
    "com.samsung.android.camera/com.sec.android.app.camera.Camera",
  ),
  app("photos", "Photos", "photos", "com.google.android.apps.photos/com.google.android.apps.photos.home.HomeActivity"),
  app(
    "gallery",
    "Gallery",
    "image",
    "com.android.gallery3d/com.android.gallery3d.app.GalleryActivity",
    "com.samsung.android.gallery/com.samsung.android.gallery.app.activity.GalleryActivity",
    "com.miui.gallery/com.miui.gallery.activity.HomePageActivity",
  ),
  app("browser", "Chrome", "compass", "com.android.chrome/com.google.android.apps.chrome.Main"),
  app(
    "mail",
    "Gmail",
    "mail",
    "com.google.android.gm/com.google.android.gm.ConversationListActivityGmail",
    "com.android.email/com.android.email.activity.Welcome",
  ),
  app(
    "calendar",
    "Calendar",
    "calendar",
    "com.google.android.calendar/com.android.calendar.AllInOneActivity",
    "com.samsung.android.calendar/com.samsung.android.app.calendar.activity.MainActivity",
  ),
  app(
    "clock",
    "Clock",
    "clock",
    "com.google.android.deskclock/com.android.deskclock.DeskClock",
    "com.samsung.android.app.clockpack/com.samsung.android.app.clockpack.ClockPackage",
  ),
  app("calculator", "Calculator", "calculator", "com.google.android.calculator/com.google.android.calculator.CalculatorActivity"),
  app("settings", "Settings", "settings", "com.android.settings/com.android.settings.Settings"),
  app("play", "Play Store", "play", "com.android.vending/com.android.vending.AssetBrowserActivity"),
  app("youtube", "YouTube", "youtube", "com.google.android.youtube/com.google.android.apps.youtube.app.WatchWhileActivity"),
  app("maps", "Maps", "pin", "com.google.android.apps.maps/com.google.android.maps.MapsActivity"),
  app("drive", "Drive", "drive", "com.google.android.apps.docs/com.google.android.apps.docs.app.NewMainProxyActivity"),
  app("keep", "Keep", "note", "com.google.android.keep/com.google.android.keep.activities.BrowseActivity"),
  app(
    "files",
    "Files",
    "folder",
    "com.google.android.apps.nbu.files/com.google.android.apps.nbu.files.home.HomeActivity",
    "com.android.documentsui/com.android.documentsui.LauncherActivity",
  ),
  app("music", "Music", "music", "com.google.android.apps.youtube.music/com.google.android.apps.youtube.music.activities.MusicActivity"),
  app("podcasts", "Podcasts", "mic", "com.google.android.apps.podcasts/com.google.android.apps.podcasts.PodcastsActivity"),
  app("wallet", "Wallet", "wallet", "com.google.android.apps.walletnfcrel/com.google.android.apps.wallet.WalletApp"),
  app("whatsapp", "WhatsApp", "whatsapp", "com.whatsapp/com.whatsapp.Main"),
  app("instagram", "Instagram", "instagram", "com.instagram.android/com.instagram.android.activity.MainTabActivity"),
  app("facebook", "Facebook", "facebook", "com.facebook.katana/com.facebook.katana.LoginActivity"),
  app("tiktok", "TikTok", "tiktok", "com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity"),
  app("x", "X", "x", "com.twitter.android/com.twitter.android.StartActivity"),
  app("telegram", "Telegram", "telegram", "org.telegram.messenger/org.telegram.ui.LaunchActivity"),
  app("netflix", "Netflix", "netflix", "com.netflix.mediaclient/com.netflix.mediaclient.ui.launch.UIWebViewActivity"),
  app("spotify", "Spotify", "spotify", "com.spotify.music/com.spotify.music.MainActivity"),
  app("amazon", "Amazon", "bag", "com.amazon.mShop.android.shopping/com.amazon.mShop.home.HomeActivity"),
  app("slack", "Slack", "slack", "com.Slack/com.Slack.ui.HomeActivity"),
  app("zoom", "Zoom", "video", "us.zoom.videomeetings/us.zoom.videomeetings.LauncherActivity"),
  app("teams", "Teams", "people", "com.microsoft.teams/com.microsoft.teams.MainActivity"),
  app("linkedin", "LinkedIn", "linkedin", "com.linkedin.android/com.linkedin.android.authenticator.LaunchActivity"),
  app("pinterest", "Pinterest", "pinterest", "com.pinterest/com.pinterest.activity.PinterestActivity"),
  app("twitch", "Twitch", "twitch", "tv.twitch.android.app/tv.twitch.android.app.consumer.MainActivity"),
  app("outlook", "Outlook", "mail", "com.microsoft.office.outlook/com.microsoft.office.outlook.MainActivity"),
  app("termux", "Termux", "terminal", "com.termux/com.termux.app.TermuxActivity"),
  app("github", "GitHub", "branch", "com.github.android/com.github.android.app.MainActivity"),
  app("weather", "Weather", "sun", "com.google.android.apps.weather/com.google.android.apps.weather.MainActivity"),

  // ------------------------------------------------------------ Google suite
  app(
    "docs",
    "Docs",
    "docs",
    "com.google.android.apps.docs.editors.docs/com.google.android.apps.docs.editors.docs.DocumentPickerActivity",
    "com.google.android.apps.docs.editors.docs",
  ),
  app(
    "sheets",
    "Sheets",
    "sheets",
    "com.google.android.apps.docs.editors.sheets/com.google.android.apps.docs.editors.sheets.SheetsActivity",
    "com.google.android.apps.docs.editors.sheets",
  ),
  app(
    "slides",
    "Slides",
    "slides",
    "com.google.android.apps.docs.editors.slides/com.google.android.apps.docs.editors.slides.SlidesActivity",
    "com.google.android.apps.docs.editors.slides",
  ),
  app("meet", "Meet", "meet", "com.google.android.apps.tachyon/com.google.android.apps.tachyon.MainActivity", "com.google.android.apps.tachyon"),
  app("tasks", "Tasks", "tasks", "com.google.android.apps.tasks/com.google.android.apps.tasks.ui.TaskListsActivity", "com.google.android.apps.tasks"),
  app("news", "News", "news", "com.google.android.apps.magazines/com.google.apps.dots.android.app.activity.CurrentsStartActivity", "com.google.android.apps.magazines"),
  app("earth", "Earth", "earth", "com.google.android.apps.earth/com.google.android.apps.earth.MainActivity", "com.google.android.apps.earth"),
  app("books", "Play Books", "books", "com.google.android.apps.books/com.google.android.apps.books.app.BooksActivity", "com.google.android.apps.books"),
  app("games", "Play Games", "games", "com.google.android.play.games/com.google.android.gms.games.ui.destination.main.MainActivity", "com.google.android.play.games"),
  app("recorder", "Recorder", "recorder", "com.google.android.apps.recorder/com.google.android.apps.recorder.ui.recordings.MainActivity", "com.google.android.apps.recorder"),

  // ---------------------------------------------------------------- tools
  app("notion", "Notion", "notion", "notion.id/notion.id.MainActivity", "notion.id"),
  app("trello", "Trello", "trello", "com.trello/com.trello.home.HomeActivity", "com.trello"),
  app("capcut", "CapCut", "capcut", "com.lemon.lvoverseas/com.lemon.lvoverseas.MainActivity", "com.lemon.lvoverseas"),
  app("lightroom", "Lightroom", "lightroom", "com.adobe.lrmobile/com.adobe.lrmobile.LrMobileActivity", "com.adobe.lrmobile"),

  // ---------------------------------------------------------------- social
  app("discord", "Discord", "discord", "com.discord/com.discord.main.MainActivity", "com.discord"),
  app("reddit", "Reddit", "reddit", "com.reddit.frontpage/com.reddit.launch.main.MainActivity", "com.reddit.frontpage"),
  app("snapchat", "Snapchat", "snapchat", "com.snapchat.android/com.snapchat.android.LandingPageActivity", "com.snapchat.android"),
  app("signal", "Signal", "signal", "org.thoughtcrime.securesms/org.thoughtcrime.securesms.ConversationListActivity", "org.thoughtcrime.securesms"),
  app("messenger", "Messenger", "messenger", "com.facebook.orca/com.facebook.orca.auth.StartScreenActivity", "com.facebook.orca"),

  // ---------------------------------------------------------------- browsers
  app("firefox", "Firefox", "firefox", "org.mozilla.firefox/org.mozilla.firefox.App", "org.mozilla.firefox"),
  app("brave", "Brave", "brave", "com.brave.browser/com.brave.browser.MainActivity", "com.brave.browser"),

  // ---------------------------------------------------------------- media
  app("kindle", "Kindle", "kindle", "com.amazon.kindle/com.amazon.kindle.UpgradePage", "com.amazon.kindle"),
  app("disney", "Disney+", "disney", "com.disney.disneyplus/com.disney.disneyplus.MainActivity", "com.disney.disneyplus"),
  app("prime", "Prime Video", "prime", "com.amazon.avod.thirdpartyclient/com.amazon.avod.thirdpartyclient.MainActivity", "com.amazon.avod.thirdpartyclient"),

  // ---------------------------------------------------------------- finance
  app("bank", "Bank", "bank", "com.chase.sig.android/com.chase.sig.android.ui.SplashActivity", "com.chase.sig.android"),
  app("coin", "Coinbase", "coin", "com.coinbase.android/com.coinbase.android.MainActivity", "com.coinbase.android"),
  app("chart", "Robinhood", "chart", "com.robinhood.android/com.robinhood.android.MainActivity", "com.robinhood.android"),

  // ---------------------------------------------------------------- games
  app("minecraft", "Minecraft", "minecraft", "com.mojang.minecraftpe/com.mojang.minecraftpe.MainActivity", "com.mojang.minecraftpe"),
  app("pokemon", "Pokemon GO", "pokemon", "com.nianticlabs.pokemongo/com.nianticproject.holoholo.libholoholo.unity.UnityMainActivity", "com.nianticlabs.pokemongo"),

  app("uber", "Uber", "uber", "com.ubercab/com.ubercab.presidio.app.core.root.RootActivity", "com.ubercab"),
];

// Components for a package entry, e.g. "com.x/com.x.MainActivity".
export function componentsFor(pkgs) {
  const out = [];
  for (const p of pkgs) {
    if (p.includes("/")) {
      const [pkg, act] = p.split("/");
      out.push({ pkg, cls: act });
    } else {
      out.push({ pkg: p, cls: `${p}.MainActivity` });
    }
  }
  return out;
}

export const PACK_ICON = "generic";
