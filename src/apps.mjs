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
  app("browser", "Chrome", "chrome", "com.android.chrome/com.google.android.apps.chrome.Main"),
  app(
    "gmail",
    "Gmail",
    "gmail",
    "com.google.android.gm/com.google.android.gm.ConversationListActivityGmail",
    "com.android.email/com.android.email.activity.Welcome",
  ),
  app(
    "calendar",
    "Calendar",
    "calendar",
    "com.google.android.calendar/com.android.calendar.AllInOneActivity",
    "com.android.calendar/com.android.calendar.AllInOneActivity",
    "com.xiaomi.calendar/com.android.calendar.homepage.AllInOneActivity",
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
  app("keep", "Keep", "bulb", "com.google.android.keep/com.google.android.keep.activities.BrowseActivity"),
  app(
    "files",
    "Files",
    "folder",
    "com.google.android.apps.nbu.files/com.google.android.apps.nbu.files.home.HomeActivity",
    "com.android.documentsui/com.android.documentsui.LauncherActivity",
  ),
  app("music", "Music", "ytmusic", "com.google.android.apps.youtube.music/com.google.android.apps.youtube.music.activities.MusicActivity"),
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
  app(
    "myspoti",
    "Myspoti",
    "wave",
    // Stable and beta ship as different packages under one launcher activity
    // (app.myspoti.MainActivity); both get the same mark.
    "app.myspoti.stable/app.myspoti.MainActivity",
    "app.myspoti/app.myspoti.MainActivity",
  ),
  app("amazon", "Amazon", "amazon", "com.amazon.mShop.android.shopping/com.amazon.mShop.home.HomeActivity"),
  app("slack", "Slack", "slack", "com.Slack/com.Slack.ui.HomeActivity"),
  app("zoom", "Zoom", "zoom", "us.zoom.videomeetings/us.zoom.videomeetings.LauncherActivity"),
  app("teams", "Teams", "teams", "com.microsoft.teams/com.microsoft.teams.MainActivity"),
  app("linkedin", "LinkedIn", "linkedin", "com.linkedin.android/com.linkedin.android.authenticator.LaunchActivity"),
  app("pinterest", "Pinterest", "pinterest", "com.pinterest/com.pinterest.activity.PinterestActivity"),
  app("twitch", "Twitch", "twitch", "tv.twitch.android.app/tv.twitch.android.app.consumer.MainActivity"),
  app("outlook", "Outlook", "outlook", "com.microsoft.office.outlook/com.microsoft.office.outlook.MainActivity"),
  app("termux", "Termux", "terminal", "com.termux/com.termux.app.TermuxActivity"),
  app("github", "GitHub", "github", "com.github.android/com.github.android.app.MainActivity"),
  app("weather", "Weather", "weather", "com.google.android.apps.weather/com.google.android.apps.weather.MainActivity"),

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
  app("bank", "Bank", "chase", "com.chase.sig.android/com.chase.sig.android.ui.SplashActivity", "com.chase.sig.android"),
  app("coin", "Coinbase", "coin", "com.coinbase.android/com.coinbase.android.MainActivity", "com.coinbase.android"),
  app("robinhood", "Robinhood", "robinhood", "com.robinhood.android/com.robinhood.android.MainActivity", "com.robinhood.android"),

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
  app("miweather", "Weather", "miweather", "com.miui.weather2/com.miui.weather2.ActivityWeatherMain", "com.miui.weather2"),
  app(
    "mifiles",
    "File Manager",
    "mifolder",
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
  app("mibrowser", "Mi Browser", "planet", "com.mi.globalbrowser/com.mi.globalbrowser.Main", "com.mi.globalbrowser"),
  app("mimusic", "Mi Music", "music", "com.miui.player/com.miui.player.ui.MusicBrowserActivity", "com.miui.player"),
  app("minotes", "Notes", "note", "com.miui.notes/com.miui.notes.ui.NotesListActivity", "com.miui.notes"),
  app("gamecenter", "Game Center", "gamepad", "com.xiaomi.glgm/com.xiaomi.glgm.MainActivity", "com.xiaomi.glgm"),
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
  app("f1", "F1", "f1", "com.softpauer.f1timingapp2014.basic"),
  app(
    "motogp",
    "MotoGP",
    "motogp",
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
    "hp",
    "com.hp.printercontrol/com.hp.printercontrol.base.PrinterControlActivity",
    "com.hp.printercontrol",
  ),
  app("daily", "daily.dev", "dailydot", "dev.daily/dev.daily.MainActivity", "dev.daily"),
  app("elpais", "El País", "elpais", "com.elpais.elpais/com.elpais.elpais.MainActivity", "com.elpais.elpais"),
  app("gree", "Gree+", "snowflake", "com.gree.greeplus/com.gree.greeplus.MainActivity", "com.gree.greeplus"),
  app("kick", "Kick", "kick", "com.kick.mobile/com.kick.mobile.MainActivity", "com.kick.mobile"),
  app("kwgt", "KWGT", "kwgt", "org.kustom.widget/org.kustom.widget.MainActivity", "org.kustom.widget"),
  app(
    "life360",
    "Life360",
    "life",
    "com.life360.android.safetymapd/com.life360.android.safetymapd.MainActivity",
    "com.life360.android.safetymapd",
  ),
  app("localsend", "LocalSend", "localsend", "org.localsend.localsend_app/org.localsend.localsend_app.MainActivity"),
  app("pluto", "Pluto TV", "pluto", "tv.pluto.android/tv.pluto.android.MainActivity", "tv.pluto.android"),
  app("psapp", "PS App", "psapp", "com.scee.psxandroid/com.scee.psxandroid.MainActivity", "com.scee.psxandroid"),
  app(
    "psremote",
    "PS Remote Play",
    "remoteplay",
    "com.playstation.remoteplay/com.playstation.remoteplay.MainActivity",
    "com.playstation.remoteplay",
  ),
  app("samsunghealth", "Samsung Health", "health", "com.sec.android.app.shealth/com.samsung.android.app.shealth.home.HomeMainActivity",
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
  app("ubereats", "Uber Eats", "ubereats", "com.ubercab.eats/com.ubercab.eats.app.feature.launch.LauncherActivity",
    "com.ubercab.eats",
  ),
  app("vlc", "VLC", "cone", "org.videolan.vlc/org.videolan.vlc.StartActivity", "org.videolan.vlc"),
  app("zoho", "Zoho People", "zoho", "com.zoho.people/com.zoho.people.MainActivity", "com.zoho.people"),

  // ------------------------------- reported by a global Redmi (Note, MIUI/HyperOS)
  // Xiaomi system apps
  app("getapps", "GetApps", "store", "com.xiaomi.mipicks/com.xiaomi.mipicks.AppMallAlias", "com.xiaomi.mipicks"),
  app("mistore", "Mi Store", "mistore", "com.mi.global.shop/com.mi.global.home.ui.LaunchActivity", "com.mi.global.shop"),
  app("themes", "Themes", "palette", "com.android.thememanager/com.android.thememanager.ThemeResourceTabActivity", "com.android.thememanager"),
  app("minusscreen", "App vault", "minusscreen", "com.mi.globalminusscreen/com.mi.globalminusscreen.LauncherAlias", "com.mi.globalminusscreen"),
  app("xiaomihome", "Xiaomi Home", "smarthome", "com.xiaomi.smarthome/com.xiaomi.smarthome.SmartHomeMainActivity", "com.xiaomi.smarthome"),
  app("mimover", "Mi Mover", "mimover", "com.miui.huanji/com.miui.huanji.MainActivity", "com.miui.huanji"),
  app("xscanner", "Scanner", "scan", "com.xiaomi.scanner/com.xiaomi.scanner.app.ScanActivity", "com.xiaomi.scanner"),
  app("micommunity", "Mi Community", "bunny", "com.mi.global.bbs/com.mi.global.bbslib.headlines.ui.SplashActivity", "com.mi.global.bbs"),
  app("soundrecorder", "Recorder", "recorder", "com.android.soundrecorder/com.android.soundrecorder.StartActivity", "com.android.soundrecorder"),

  // Google
  app(
    "findmydevice",
    "Find My Device",
    "devicelocator",
    "com.google.android.apps.adm/com.google.android.apps.adm.activities.MainActivity",
    "com.google.android.apps.adm",
  ),
  app(
    "safetyhub",
    "Safety Hub",
    "safety",
    "com.google.android.apps.safetyhub/com.google.android.apps.safetyhub.LauncherActivity",
    "com.google.android.apps.safetyhub",
  ),

  // Launchers and tools
  app("nova", "Nova Launcher", "nova", "com.teslacoilsw.launcher/com.teslacoilsw.launcher.NovaShortcutHandler", "com.teslacoilsw.launcher"),
  app(
    "novaprime",
    "Nova Launcher Prime",
    "nova",
    "com.teslacoilsw.launcher.prime/com.teslacoilsw.launcher.prime.NovaLauncherPrimeActivity",
    "com.teslacoilsw.launcher.prime",
  ),
  app("shizuku", "Shizuku", "droplet", "moe.shizuku.privileged.api/moe.shizuku.manager.MainActivity", "moe.shizuku.privileged.api"),
  app("arcticons", "Arcticons", "arcticons", "com.donnnno.arcticons.you.play/com.donnnno.arcticons.activities.MainActivity", "com.donnnno.arcticons.you.play"),
  app("vidmate", "Video Downloader", "downloader", "downloader.vitmate.downloaderapp/downloader.vitmate.downloaderapp.activity.MainActivity", "downloader.vitmate.downloaderapp"),
  app("kwgtpack", "Minimal KWGT", "widget", "com.ao.minimalkwgt/org.kustom.api.dashboard.DashboardActivity", "com.ao.minimalkwgt"),
  app("hpprint", "HP Print Service", "hp", "com.hp.android.printservice/com.hp.android.printservice.launcher.SplashActivity", "com.hp.android.printservice"),
  app("v380", "V380 Pro", "webcam", "com.macrovideo.v380pro/com.macrovideo.v380pro.activities.LaunchActivityWithAd", "com.macrovideo.v380pro"),
  app("vpnpro", "VPN Pro", "vpn", "com.appntox.vpnpro/com.appntox.vpnpro.other.SplashActivity", "com.appntox.vpnpro"),
  app("meulify", "Meuify", "meulify", "top.meulify.app/top.meulify.app.GlossyIconAlias", "top.meulify.app"),

  // Spanish apps
  app("sabadell", "Banco Sabadell", "sabadell", "net.inverline.bancosabadell.officelocator.android/net.inverline.bancosabadell.officelocator.android.sab.SplashActivity", "net.inverline.bancosabadell.officelocator.android"),
  app("cobee", "Cobee", "card", "perkfinance.cobee/perkfinance.cobee.MainActivity", "perkfinance.cobee"),
  app("axa", "AXA", "umbrella", "com.axa.app.myaxa.es/com.axa.app.MainActivity", "com.axa.app.myaxa.es"),
  app("pin24h", "PIN 24h", "receipt", "es.aeat.pin24h/es.aeat.pin24h.presentation.activities.splash.SplashActivity", "es.aeat.pin24h"),
  app("carpeta", "Carpeta Ciudadana", "badge", "es.gob.carpeta/es.gob.carpeta.MainActivity", "es.gob.carpeta"),
  app("autoservef", "Autoservé", "medical", "es.gva.autoservef/es.gva.autoservef.MainActivity", "es.gva.autoservef"),
  app("buselche", "Bus Elche", "bus", "org.JavandSoft.BusElche/crc64bddf25fb79e73ff2.SplashActivity", "org.JavandSoft.BusElche"),
  app("cecotec", "Cecotec", "fan", "es.cecotec.forceclima/com.smart.ThingSplashActivity", "es.cecotec.forceclima"),
  app("localweather", "Weather Radar", "radar", "com.localweather.radar.climate/com.lcwrd.climate.ui.splash.SplashActivity", "com.localweather.radar.climate"),

  // Everything else
  app("yoigo", "Yoigo", "carrier", "com.yoigo.miyoigo/com.ragnarok.apps.ui.base.MainActivity", "com.yoigo.miyoigo"),
  app("tdtchannels", "TDTChannels", "tdt", "com.tdtchannels.player/com.tdtchannels.player.SplashScreenActivity", "com.tdtchannels.player"),
  app("auesapay", "Auesa Pay", "elx", "com.auesa.auesapay/com.auesa.auesapay.MainActivity", "com.auesa.auesapay"),
  app("corecitizen", "Core Citizen", "people", "com.corecitizenmobile.android/com.corecitizenmobile.android.MainActivity", "com.corecitizenmobile.android"),
  app("neweden", "New Eden", "gemini", "com.studio.neweden/org.bitspark.android.Spark", "com.studio.neweden"),
];

// Launcher entry points reported by that phone. Each one belongs to a package
// already listed above: vendors ship several launcher aliases per app (Nova's
// settings shortcut, Reddit's "launcher.default", Discord's "MainDefault"…) and
// a ROM declares whichever it likes, so the curated guesses alone leave those
// icons unmatched. Dumped from the pack's own Coverage panel, then folded in
// here so the shipped pack covers them without a local device file.
const DEVICE_ALIASES = {
  settings: ["com.android.settings/com.android.settings.MainSettings"],
  authenticator: ["com.google.android.apps.authenticator2/com.google.android.apps.authenticator2.main.MainActivity"],
  brave: ["com.brave.browser/com.google.android.apps.chrome.Main"],
  gamecenter: ["com.xiaomi.glgm/com.mig.play.Icon0"],
  chollo: ["com.chollometro/com.pepper.apps.android.presentation.MainActivityDarkIcon"],
  daily: ["dev.daily/dev.daily.LauncherActivity"],
  downloads: ["com.android.providers.downloads.ui/com.android.providers.downloads.ui.activity.DownloadListEntry"],
  discord: ["com.discord/com.discord.main.MainDefault"],
  duckduckgo: ["com.duckduckgo.mobile.android/com.duckduckgo.app.launch.Launcher"],
  f1: ["com.softpauer.f1timingapp2014.basic/com.formula1.MainActivity"],
  galaxywear: ["com.samsung.android.app.watchmanager/com.samsung.android.app.watchmanager.setupwizard.SetupWizardWelcomeActivity"],
  github: ["com.github.android/com.github.android.main.MainActivity"],
  googletv: ["com.google.android.videos/com.google.android.videos.GoogleTvEntryPoint"],
  gree: ["com.gree.greeplus/io.gree.activity.loading.LoadingInitActivity"],
  googlehome: ["com.google.android.apps.chromecast.app/com.google.android.apps.chromecast.app.DiscoveryActivity"],
  hp: ["com.hp.printercontrol/com.hp.printercontrol.hpx.PrinterControlWrapperActivity"],
  kwgt: ["org.kustom.widget/org.kustom.widget.picker.WidgetPicker"],
  life360: ["com.life360.android.safetymapd/com.life360.koko.LauncherNormal"],
  linkedin: ["com.linkedin.android/com.linkedin.android.authenticator.LaunchActivityDefault"],
  mivideo: ["com.miui.videoplayer/com.miui.video.global.app.LauncherAlias"],
  motogp: ["com.dorna.officialmotogp/com.dorna.officialmotogp.SplashActivity"],
  pluto: ["tv.pluto.android/com.paramount.android.pplus.features.splash.mobile.integration.SplashActivity"],
  psapp: ["com.scee.psxandroid/com.scee.psxandroid.activity.TopActivity"],
  psremote: ["com.playstation.remoteplay/com.playstation.remoteplay.RpActivityMain"],
  reddit: ["com.reddit.frontpage/launcher.default"],
  splitwise: ["com.Splitwise.SplitwiseMobile/com.Splitwise.SplitwiseMobile.views.SplitwiseSplashScreen"],
  telegram: ["org.telegram.messenger/org.telegram.messenger.DefaultIcon"],
  twitch: ["tv.twitch.android.app/tv.twitch.android.app.core.LandingActivity"],
  ubereats: ["com.ubercab.eats/com.ubercab.eats.core.activity.LauncherActivity"],
  wallet: ["com.google.android.apps.walletnfcrel/com.google.commerce.tapandpay.android.wallet.WalletActivity"],
  x: ["com.twitter.android/com.x.android.main.MainActivity"],
  youtube: ["com.google.android.youtube/com.google.android.youtube.app.honeycomb.Shell$HomeActivity"],
  zoho: ["com.zoho.people/com.zoho.people.home.HomeActivityForLauncher"],
};

for (const [id, components] of Object.entries(DEVICE_ALIASES)) {
  const entry = APPS.find((a) => a.id === id);
  if (!entry) throw new Error(`DEVICE_ALIASES points at unknown app id: ${id}`);
  for (const component of components) {
    if (!entry.pkgs.includes(component)) entry.pkgs.push(component);
  }
}

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
