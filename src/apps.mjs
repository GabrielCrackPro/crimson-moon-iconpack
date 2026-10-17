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
    "com.android.camera/com.android.camera.Camera",
    "com.samsung.android.camera/com.sec.android.app.camera.Camera",
    "com.android.camera",
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
    "com.android.calendar/com.android.calendar.AllInOneActivity",
    "com.samsung.android.calendar/com.samsung.android.app.calendar.activity.MainActivity",
    "com.android.calendar",
  ),
  app(
    "clock",
    "Clock",
    "clock",
    "com.google.android.deskclock/com.android.deskclock.DeskClock",
    "com.android.deskclock/com.android.deskclock.DeskClockTabActivity",
    "com.samsung.android.app.clockpack/com.samsung.android.app.clockpack.ClockPackage",
    "com.android.deskclock",
  ),
  app(
    "calculator",
    "Calculator",
    "calculator",
    "com.google.android.calculator/com.google.android.calculator.CalculatorActivity",
    "com.miui.calculator/com.miui.calculator.cal.CalculatorActivity",
    "com.android.calculator2/com.android.calculator2.Calculator",
    "com.miui.calculator",
  ),
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

  // ------------------------------------------------- Xiaomi / MIUI system
  // A global Redmi shows these next to the Google apps. Activities are the
  // shipping ones as far as public listings show; `npm run sync` with a device
  // dump overrides any of them that have moved since.
  app("compass", "Compass", "needle", "com.miui.compass/com.miui.compass.CompassActivity", "com.miui.compass"),
  app(
    "security",
    "Security",
    "security",
    "com.miui.securitycenter/com.miui.securityscan.MainActivity",
    "com.miui.securitycenter",
  ),
  app(
    "services",
    "Services & feedback",
    "support",
    "com.miui.miservice/com.miui.miservice.main.MainActivity",
    "com.miui.miservice",
  ),
  app("miweather", "Weather", "sun", "com.miui.weather2/com.miui.weather2.ActivityWeatherMain", "com.miui.weather2"),
  app(
    "mifiles",
    "File Manager",
    "folder",
    "com.mi.android.globalFileexplorer/com.android.fileexplorer.FileExplorerTabActivity",
    "com.mi.android.globalFileexplorer",
  ),
  app(
    "miremote",
    "Mi Remote",
    "remote",
    "com.duokan.phone.remotecontroller/com.xiaomi.mitv.phone.remotecontroller.HoriWidgetMainActivityV2",
    "com.duokan.phone.remotecontroller",
  ),
  app(
    "mivideo",
    "Mi Video",
    "player",
    "com.miui.videoplayer/com.miui.video.global.app.LauncherActivity",
    "com.miui.videoplayer",
  ),
  app("mibrowser", "Mi Browser", "earth", "com.mi.globalbrowser/com.mi.globalbrowser.Main", "com.mi.globalbrowser"),
  app("mimusic", "Mi Music", "music", "com.miui.player/com.miui.player.ui.MusicBrowserActivity", "com.miui.player"),
  app("minotes", "Notes", "note", "com.miui.notes/com.miui.notes.ui.NotesListActivity", "com.miui.notes"),
  app("gamecenter", "Game Center", "games", "com.xiaomi.glgm/com.xiaomi.glgm.MainActivity", "com.xiaomi.glgm"),
  app(
    "downloads",
    "Downloads",
    "download",
    "com.android.providers.downloads.ui/com.android.providers.downloads.ui.DownloadList",
    "com.android.providers.downloads.ui",
  ),

  // -------------------------------------------------------------- Google
  app(
    "google",
    "Google",
    "search",
    "com.google.android.googlequicksearchbox/com.google.android.googlequicksearchbox.SearchActivity",
    "com.google.android.googlequicksearchbox",
  ),
  app(
    "assistant",
    "Assistant",
    "assistant",
    "com.google.android.apps.googleassistant/com.google.android.apps.googleassistant.AssistantActivity",
    "com.google.android.apps.googleassistant",
  ),
  app(
    "googletv",
    "Google TV",
    "tv",
    "com.google.android.videos/com.google.android.videos.activity.LauncherActivity",
    "com.google.android.videos",
  ),
  app(
    "googlehome",
    "Google Home",
    "home",
    "com.google.android.apps.chromecast.app/com.google.android.apps.chromecast.app.home.activity.MainActivity",
    "com.google.android.apps.chromecast.app",
  ),
  app(
    "googleone",
    "Google One",
    "cloud",
    "com.google.android.apps.subscriptions.red/com.google.android.apps.subscriptions.red.LauncherActivity",
    "com.google.android.apps.subscriptions.red",
  ),
  app(
    "gemini",
    "Gemini",
    "gemini",
    "com.google.android.apps.bard/com.google.android.apps.bard.shellapp.BardEntryPointActivity",
    "com.google.android.apps.bard",
  ),
  app(
    "wallpapers",
    "Wallpapers",
    "wallpaper",
    "com.google.android.apps.wallpaper/com.google.android.apps.wallpaper.picker.CategoryPickerActivity",
    "com.google.android.apps.wallpaper",
  ),
  app(
    "authenticator",
    "Authenticator",
    "authenticator",
    "com.google.android.apps.authenticator2/com.google.android.apps.authenticator.AuthenticatorActivity",
    "com.google.android.apps.authenticator2",
  ),
  app(
    "msauth",
    "Microsoft Authenticator",
    "lock",
    "com.azure.authenticator/com.azure.authenticator.ui.LaunchActivity",
    "com.azure.authenticator",
  ),

  // ------------------------------------------------------- services & media
  app("f1", "F1", "flag", "com.softpauer.f1timingapp2014.basic"),
  app(
    "motogp",
    "MotoGP",
    "helmet",
    "com.dorna.officialmotogp/com.worldline.motogp.view.activity.SplashActivity",
    "com.dorna.officialmotogp",
  ),
  app(
    "duckduckgo",
    "DuckDuckGo",
    "duck",
    "com.duckduckgo.mobile.android/com.duckduckgo.app.launch.LaunchActivity",
    "com.duckduckgo.mobile.android",
  ),
  app("galaxywear", "Galaxy Wearable", "watch", "com.samsung.android.app.watchmanager", "com.samsung.android.app.watchmanager2"),
  app("chatgpt", "ChatGPT", "chatgpt", "com.openai.chatgpt/com.openai.chatgpt.MainActivity", "com.openai.chatgpt"),
  app("chollo", "Chollometro", "chollo", "com.chollometro/com.chollometro.MainActivity", "com.chollometro"),
  app(
    "hp",
    "HP",
    "printer",
    "com.hp.printercontrol/com.hp.printercontrol.base.PrinterControlActivity",
    "com.hp.printercontrol",
  ),
  app("daily", "daily.dev", "flame", "dev.daily/dev.daily.MainActivity", "dev.daily"),
  app("elpais", "El País", "news", "com.elpais.elpais/com.elpais.elpais.MainActivity", "com.elpais.elpais"),
  app("gree", "Gree+", "snowflake", "com.gree.greeplus/com.gree.greeplus.MainActivity", "com.gree.greeplus"),
  app("kick", "Kick", "kick", "com.kick.mobile/com.kick.mobile.MainActivity", "com.kick.mobile"),
  app("kwgt", "KWGT", "widget", "org.kustom.widget/org.kustom.widget.MainActivity", "org.kustom.widget"),
  app(
    "life360",
    "Life360",
    "rings",
    "com.life360.android.safetymapd/com.life360.android.safetymapd.MainActivity",
    "com.life360.android.safetymapd",
  ),
  app("localsend", "LocalSend", "send", "org.localsend.localsend_app/org.localsend.localsend_app.MainActivity"),
  app("pluto", "Pluto TV", "pluto", "tv.pluto.android/tv.pluto.android.MainActivity", "tv.pluto.android"),
  app("psapp", "PS App", "psbuttons", "com.scee.psxandroid/com.scee.psxandroid.MainActivity", "com.scee.psxandroid"),
  app(
    "psremote",
    "PS Remote Play",
    "remoteplay",
    "com.playstation.remoteplay/com.playstation.remoteplay.MainActivity",
    "com.playstation.remoteplay",
  ),
  app(
    "samsunghealth",
    "Samsung Health",
    "heart",
    "com.sec.android.app.shealth/com.samsung.android.app.shealth.home.HomeMainActivity",
    "com.sec.android.app.shealth",
  ),
  app(
    "soundconnect",
    "Sound Connect",
    "headphones",
    "com.sony.songpal.mdr/com.sony.songpal.mdr.vim.activity.MdrMainActivity",
    "com.sony.songpal.mdr",
  ),
  app("splitwise", "Splitwise", "split", "com.Splitwise.SplitwiseMobile/com.Splitwise.SplitwiseMobile.MainActivity"),
  app(
    "steam",
    "Steam",
    "steam",
    "com.valvesoftware.android.steam.community/com.valvesoftware.android.steam.community.MainActivity",
  ),
  app(
    "ubereats",
    "Uber Eats",
    "food",
    "com.ubercab.eats/com.ubercab.eats.app.feature.launch.LauncherActivity",
    "com.ubercab.eats",
  ),
  app("vlc", "VLC", "cone", "org.videolan.vlc/org.videolan.vlc.StartActivity", "org.videolan.vlc"),
  app("zoho", "Zoho People", "people", "com.zoho.people/com.zoho.people.MainActivity", "com.zoho.people"),
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
