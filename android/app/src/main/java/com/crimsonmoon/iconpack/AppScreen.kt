package com.crimsonmoon.iconpack

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * The pack's screen: apply it, browse it, and find out what it misses.
 *
 * The coverage panel is the useful half. Launchers match icons by exact
 * `package/activity` component, so an icon that refuses to apply is either
 * *mismatched* (the pack has the icon, the phone reports another component) or
 * *missing* (no icon for that package at all). The screen computes both on the
 * phone and exports them in the format the repo's device-sync tool reads.
 *
 * Three segmented tabs replace the old fixed-column layout: pinning the header,
 * the apply card, the grid and the coverage card on one screen is what made the
 * old layout feel cramped on a tall phone.
 */
data class PackData(
    val iconNames: List<String>,
    val entries: List<PackInfo.Entry>,
    val launchers: List<Launchers.Launcher>,
    val export: String,
) {
    val mismatched: List<PackInfo.Entry> get() = PackInfo.ofKind(entries, PackInfo.MISMATCH)
    val missing: List<PackInfo.Entry> get() = PackInfo.ofKind(entries, PackInfo.MISSING)
    val covered: Int get() = entries.size - mismatched.size - missing.size
}

/** Loads the pack off the main thread, then hands the screen a ready model. */
@Composable
fun PackScreen() {
    val ctx = androidx.compose.ui.platform.LocalContext.current
    val data by produceState<PackData?>(initialValue = null) {
        value = withContext(Dispatchers.IO) {
            val entries = PackInfo.entries(ctx)
            PackData(
                iconNames = PackInfo.iconNames(ctx),
                entries = entries,
                launchers = Launchers.installed(ctx),
                export = PackInfo.exportText(entries),
            )
        }
    }

    val current = data
    if (current == null) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                CircularProgressIndicator(
                    color = MaterialTheme.colorScheme.primary,
                    trackColor = MaterialTheme.colorScheme.outlineVariant,
                    strokeWidth = 2.dp,
                )
                Spacer(Modifier.height(14.dp))
                Text(
                    stringResource(R.string.ui_loading),
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    style = MaterialTheme.typography.bodySmall,
                )
            }
        }
    } else {
        AppScreen(current)
    }
}

@Composable
private fun AppScreen(data: PackData) {
    val ctx = androidx.compose.ui.platform.LocalContext.current
    val snackbar = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    // Strings the event handlers need are captured here: stringResource is a
    // composable read, not something a plain callback may call later.
    val nothingMissing = stringResource(R.string.ui_nothing_missing)
    val copiedMessage = stringResource(R.string.ui_copied)
    val shareLabel = stringResource(R.string.ui_share)

    var tab by rememberSaveable { mutableIntStateOf(0) }

    fun say(message: String, duration: SnackbarDuration = SnackbarDuration.Short) {
        scope.launch { snackbar.showSnackbar(message, duration = duration) }
    }

    fun copy() {
        if (data.mismatched.isEmpty() && data.missing.isEmpty()) {
            say(nothingMissing)
            return
        }
        val clipboard = ctx.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        clipboard.setPrimaryClip(ClipData.newPlainText("Crimson Moon components", data.export))
        say(copiedMessage)
    }

    fun share() {
        if (data.mismatched.isEmpty() && data.missing.isEmpty()) {
            say(nothingMissing)
            return
        }
        val send = Intent(Intent.ACTION_SEND)
            .setType("text/plain")
            .putExtra(Intent.EXTRA_SUBJECT, "Crimson Moon — components to add")
            .putExtra(Intent.EXTRA_TEXT, data.export)
        try {
            ctx.startActivity(Intent.createChooser(send, shareLabel))
        } catch (e: ActivityNotFoundException) {
            say(shareLabel)
        }
    }

    fun runLauncher(launcher: Launchers.Launcher) {
        if (launcher.action != null) {
            try {
                ctx.startActivity(Launchers.apply(launcher, ctx.packageName))
                return
            } catch (e: ActivityNotFoundException) {
                // Falls through to opening the launcher itself.
            }
        }
        try {
            ctx.startActivity(Launchers.open(launcher))
        } catch (e: ActivityNotFoundException) {
            say("${launcher.name} could not be opened")
            return
        }
        launcher.path?.let { say(it, SnackbarDuration.Long) }
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        snackbarHost = { SnackbarHost(snackbar) },
        topBar = { PackHeader(data) },
    ) { padding ->
        Column(Modifier.padding(padding).fillMaxSize()) {
            val tabs = listOf(
                stringResource(R.string.ui_tab_apply),
                stringResource(R.string.ui_tab_icons),
                stringResource(R.string.ui_tab_coverage),
            )
            SingleChoiceSegmentedButtonRow(
                Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 6.dp),
            ) {
                tabs.forEachIndexed { index, label ->
                    SegmentedButton(
                        selected = tab == index,
                        onClick = { tab = index },
                        shape = SegmentedButtonDefaults.itemShape(index = index, count = tabs.size),
                        colors = SegmentedButtonDefaults.colors(
                            activeContainerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.16f),
                            activeContentColor = MaterialTheme.colorScheme.onBackground,
                            activeBorderColor = MaterialTheme.colorScheme.primary,
                        ),
                        label = {
                            Text(label, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        },
                    )
                }
            }

            when (tab) {
                0 -> ApplyPanel(data, Modifier.weight(1f).fillMaxWidth(), ::runLauncher)
                1 -> IconsPanel(data, Modifier.weight(1f).fillMaxWidth())
                else -> CoveragePanel(data, Modifier.weight(1f).fillMaxWidth(), ::copy, ::share)
            }
        }
    }

}

// ------------------------------------------------------------------ header

@Composable
private fun PackHeader(data: PackData) {
    val ctx = androidx.compose.ui.platform.LocalContext.current
    val markId = remember(ctx) {
        ctx.resources.getIdentifier("generic", "drawable", ctx.packageName)
            .takeIf { it != 0 } ?: android.R.drawable.sym_def_app_icon
    }
    val subtitle = stringResource(R.string.ui_icons_fmt, data.iconNames.size) +
        " · " +
        stringResource(R.string.ui_coverage_fmt, data.covered, data.entries.size)

    Surface(color = MaterialTheme.colorScheme.background) {
        Row(
            Modifier
                .fillMaxWidth()
                .windowInsetsPadding(WindowInsets.statusBars)
                .padding(start = 16.dp, end = 16.dp, top = 14.dp, bottom = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Image(
                painter = painterResource(markId),
                contentDescription = stringResource(R.string.ui_kicker),
                modifier = Modifier.size(60.dp).clip(RoundedCornerShape(16.dp)),
                contentScale = ContentScale.Crop,
            )
            Spacer(Modifier.width(14.dp))
            Column {
                Text(
                    stringResource(R.string.ui_kicker),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                )
                Spacer(Modifier.height(2.dp))
                Text(
                    stringResource(R.string.app_name),
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                )
                Spacer(Modifier.height(2.dp))
                Text(
                    subtitle,
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.65f),
                )
            }
        }
    }
}

// ------------------------------------------------------------------- apply

@Composable
private fun ApplyPanel(
    data: PackData,
    modifier: Modifier,
    onLaunch: (Launchers.Launcher) -> Unit,
) {
    Column(
        modifier
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 8.dp),
    ) {
        SectionTitle(stringResource(R.string.ui_apply_title))
        Spacer(Modifier.height(8.dp))
        BodyText(stringResource(R.string.ui_apply_body))
        Spacer(Modifier.height(14.dp))

        if (data.launchers.isEmpty()) {
            BodyText(stringResource(R.string.ui_no_launcher))
        }
        data.launchers.forEach { launcher ->
            CrimsonButton(
                text = stringResource(
                    if (launcher.action != null) R.string.ui_apply_now else R.string.ui_open_launcher,
                    launcher.name,
                ),
                modifier = Modifier.fillMaxWidth(),
                leadingIcon = OpenInNewIcon,
                onClick = { onLaunch(launcher) },
            )
            launcher.path?.let { path ->
                Spacer(Modifier.height(6.dp))
                Text(
                    path,
                    style = MaterialTheme.typography.bodySmall,
                    fontFamily = FontFamily.Monospace,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.55f),
                    modifier = Modifier.padding(start = 4.dp),
                )
            }
            Spacer(Modifier.height(8.dp))
        }

        Spacer(Modifier.height(8.dp))
        PanelFooter()
    }
}

// ------------------------------------------------------------------- icons

@Composable
private fun IconsPanel(data: PackData, modifier: Modifier) {
    val ctx = androidx.compose.ui.platform.LocalContext.current
    var query by rememberSaveable { mutableStateOf("") }

    val filtered = remember(data.iconNames, query) {
        val needle = query.trim().lowercase()
        if (needle.isEmpty()) data.iconNames
        else data.iconNames.filter { name ->
            iconLabel(name).lowercase().contains(needle) || name.lowercase().contains(needle)
        }
    }

    // getIdentifier is a map lookup at runtime; resolve each name once, not on
    // every recomposition of a scrolling cell.
    val iconIds = remember(data.iconNames) {
        data.iconNames.associateWith { name ->
            ctx.resources.getIdentifier(name, "drawable", ctx.packageName)
        }
    }

    Column(modifier) {
        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 6.dp),
            placeholder = { Text(stringResource(R.string.ui_search_hint)) },
            leadingIcon = {
                Icon(
                    Icons.Filled.Search,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            },
            singleLine = true,
            shape = RoundedCornerShape(22.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                cursorColor = MaterialTheme.colorScheme.primary,
                focusedTextColor = MaterialTheme.colorScheme.onBackground,
                unfocusedTextColor = MaterialTheme.colorScheme.onBackground,
                focusedPlaceholderColor = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                unfocusedPlaceholderColor = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                focusedLeadingIconColor = MaterialTheme.colorScheme.primary,
                unfocusedLeadingIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
            ),
        )

        Text(
            stringResource(R.string.ui_icon_count_search, filtered.size),
            fontSize = 11.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.65f),
            modifier = Modifier.padding(start = 18.dp, top = 8.dp, bottom = 2.dp),
        )

        LazyVerticalGrid(
            columns = GridCells.Adaptive(minSize = 76.dp),
            contentPadding = PaddingValues(start = 12.dp, end = 12.dp, top = 4.dp, bottom = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.weight(1f).fillMaxWidth(),
        ) {
            items(filtered, key = { it }) { name -> IconCell(name, iconIds[name] ?: 0) }
            item(span = { GridItemSpan(maxLineSpan) }) { PanelFooter() }
        }
    }
}

@Composable
private fun IconCell(name: String, resId: Int) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(vertical = 4.dp),
    ) {
        Image(
            painter = painterResource(if (resId != 0) resId else android.R.drawable.sym_def_app_icon),
            contentDescription = iconLabel(name),
            modifier = Modifier.size(56.dp).clip(RoundedCornerShape(14.dp)),
            contentScale = ContentScale.Crop,
        )
        Spacer(Modifier.height(5.dp))
        Text(
            iconLabel(name),
            fontSize = 10.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth(),
        )
    }
}

/** {@code google_tv} → {@code Google tv}, good enough for a grid caption. */
private fun iconLabel(id: String): String {
    val words = id.replace('_', ' ')
    return words.replaceFirstChar { it.uppercaseChar() }
}

// ---------------------------------------------------------------- coverage

@Composable
private fun CoveragePanel(
    data: PackData,
    modifier: Modifier,
    onCopy: () -> Unit,
    onShare: () -> Unit,
) {
    var shown by remember { mutableIntStateOf(-1) }

    Column(
        modifier
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 8.dp),
    ) {
        SectionTitle(stringResource(R.string.ui_coverage_title))
        Spacer(Modifier.height(10.dp))

        val nothingToFix = data.mismatched.isEmpty() && data.missing.isEmpty()
        if (nothingToFix) {
            BodyText(stringResource(R.string.ui_coverage_none))
        } else {
            StatRow(
                label = stringResource(R.string.ui_mismatch_title),
                count = data.mismatched.size,
                onShow = { shown = PackInfo.MISMATCH },
            )
            StatRow(
                label = stringResource(R.string.ui_missing_title),
                count = data.missing.size,
                onShow = { shown = PackInfo.MISSING },
            )
            Spacer(Modifier.height(8.dp))
            BodyText(
                stringResource(
                    R.string.ui_coverage_body,
                    data.mismatched.size,
                    data.missing.size,
                ),
            )
            Spacer(Modifier.height(12.dp))
            Row(Modifier.fillMaxWidth()) {
                GhostButton(
                    text = stringResource(R.string.ui_copy),
                    icon = CopyIcon,
                    modifier = Modifier.weight(1f),
                    onClick = onCopy,
                )
                Spacer(Modifier.width(8.dp))
                CrimsonButton(
                    text = stringResource(R.string.ui_share),
                    modifier = Modifier.weight(1f),
                    onClick = onShare,
                )
            }
            Spacer(Modifier.height(10.dp))
            Text(
                stringResource(R.string.ui_export_hint),
                style = MaterialTheme.typography.bodySmall,
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.65f),
            )
        }

        Spacer(Modifier.height(8.dp))
        PanelFooter()
    }

    if (shown >= 0) {
        val entries = if (shown == PackInfo.MISMATCH) data.mismatched else data.missing
        val isMismatch = shown == PackInfo.MISMATCH
        AlertDialog(
            onDismissRequest = { shown = -1 },
            containerColor = MaterialTheme.colorScheme.surface,
            titleContentColor = MaterialTheme.colorScheme.onBackground,
            textContentColor = MaterialTheme.colorScheme.onSurfaceVariant,
            title = {
                Text(
                    stringResource(
                        if (isMismatch) R.string.ui_mismatch_title else R.string.ui_missing_title,
                    ) + " · " + entries.size,
                )
            },
            text = {
                Column(
                    Modifier.verticalScroll(rememberScrollState()).heightIn(max = 340.dp),
                ) {
                    Text(
                        stringResource(
                            if (isMismatch) R.string.ui_mismatch_help else R.string.ui_missing_help,
                        ),
                        style = MaterialTheme.typography.bodyMedium,
                    )
                    Spacer(Modifier.height(10.dp))
                    entries.forEach { entry ->
                        Text(
                            entry.label,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.secondary,
                        )
                        Text(
                            entry.component,
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        Spacer(Modifier.height(8.dp))
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { shown = -1 }) {
                    Text(
                        stringResource(android.R.string.ok),
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            },
        )
    }
}

@Composable
private fun StatRow(label: String, count: Int, onShow: () -> Unit) {
    Row(
        Modifier.fillMaxWidth().padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            label,
            fontFamily = FontFamily.Monospace,
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.secondary,
            modifier = Modifier.weight(1f),
        )
        Text(
            count.toString(),
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier.padding(end = 10.dp),
        )
        GhostButton(
            text = stringResource(R.string.ui_show),
            enabled = count > 0,
            compact = true,
            onClick = onShow,
        )
    }
}

// ---------------------------------------------------------------- chrome

@Composable
private fun SectionTitle(text: String) {
    Text(
        text,
        style = MaterialTheme.typography.titleSmall,
        color = MaterialTheme.colorScheme.secondary,
    )
}

@Composable
private fun BodyText(text: String) {
    Text(
        text,
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
    )
}

@Composable
private fun PanelFooter() {
    Text(
        stringResource(R.string.ui_footer),
        fontSize = 10.sp,
        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.55f),
        textAlign = TextAlign.Center,
        modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp),
    )
}

/**
 * The pack's buttons, redrawn from the XML shapes they replace: the same
 * crimson gradient with a sakura press flash, the same 12dp corners, the same
 * hairline stroke — now with ripple and pressed states instead of selectors.
 */
@Composable
private fun CrimsonButton(
    text: String,
    modifier: Modifier = Modifier,
    leadingIcon: androidx.compose.ui.graphics.vector.ImageVector? = null,
    onClick: () -> Unit,
) {
    CrimsonSurfaceButton(
        text = text,
        modifier = modifier,
        leadingIcon = leadingIcon,
        filled = true,
        enabled = true,
        compact = false,
        onClick = onClick,
    )
}

@Composable
private fun GhostButton(
    text: String,
    modifier: Modifier = Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector? = null,
    enabled: Boolean = true,
    compact: Boolean = false,
    onClick: () -> Unit,
) {
    CrimsonSurfaceButton(
        text = text,
        modifier = modifier,
        leadingIcon = icon,
        filled = false,
        enabled = enabled,
        compact = compact,
        onClick = onClick,
    )
}

@Composable
private fun CrimsonSurfaceButton(
    text: String,
    modifier: Modifier,
    leadingIcon: androidx.compose.ui.graphics.vector.ImageVector?,
    filled: Boolean,
    enabled: Boolean,
    compact: Boolean,
    onClick: () -> Unit,
) {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val shape = RoundedCornerShape(12.dp)
    val contentColor = when {
        !enabled -> MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)
        filled -> MaterialTheme.colorScheme.onBackground
        else -> MaterialTheme.colorScheme.secondary
    }

    Box(
        modifier = modifier
            .height(if (compact) 36.dp else 44.dp)
            .clip(shape)
            .background(
                // One brush per branch: background() takes a Brush or a Color,
                // never a mix of both.
                when {
                    pressed && filled -> CrimsonButtonPressBrush
                    filled -> CrimsonButtonBrush
                    pressed -> SolidColor(MaterialTheme.colorScheme.primary.copy(alpha = 0.14f))
                    else -> SolidColor(Color.Transparent)
                },
            )
            .border(
                width = 1.dp,
                color = when {
                    pressed -> MaterialTheme.colorScheme.secondary
                    filled -> MaterialTheme.colorScheme.secondary.copy(alpha = 0.35f)
                    else -> MaterialTheme.colorScheme.outline
                },
                shape = shape,
            )
            .clickable(
                interactionSource = interaction,
                indication = ripple(bounded = true, color = MaterialTheme.colorScheme.background),
                enabled = enabled,
                onClick = onClick,
            )
            .padding(horizontal = 18.dp),
        contentAlignment = Alignment.Center,
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            if (leadingIcon != null) {
                Icon(
                    leadingIcon,
                    contentDescription = null,
                    tint = contentColor,
                    modifier = Modifier.size(16.dp),
                )
                Spacer(Modifier.width(8.dp))
            }
            Text(text, color = contentColor, fontSize = 13.sp, maxLines = 1)
        }
    }
}

/** The XML gradients these buttons used, kept stop for stop. */
private val CrimsonButtonBrush = androidx.compose.ui.graphics.Brush.verticalGradient(
    listOf(Color(0xFF8E0F26), Color(0xFF5A0716)),
)
private val CrimsonButtonPressBrush = androidx.compose.ui.graphics.Brush.verticalGradient(
    listOf(Color(0xFFFF2F5D), Color(0xFFA30A26)),
)
