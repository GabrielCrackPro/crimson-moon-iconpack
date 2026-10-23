package com.crimsonmoon.iconpack

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

/**
 * The pack's palette, read from the same resources the icons use, so the screen
 * and the artwork cannot drift apart: colors.xml is regenerated from the pack's
 * tokens on every build, ui.xml holds the hand-tuned screen shades.
 *
 * The scheme is always dark — a neon-noir pack has no light mode — so the
 * system theme is deliberately not consulted.
 */
@Composable
fun CrimsonTheme(content: @Composable () -> Unit) {
    val colorScheme = darkColorScheme(
        primary = colorResource(R.color.crimson),
        onPrimary = colorResource(R.color.ink),
        primaryContainer = colorResource(R.color.ui_plate_hi),
        onPrimaryContainer = colorResource(R.color.ui_text),
        secondary = colorResource(R.color.sakura),
        onSecondary = colorResource(R.color.ink),
        background = colorResource(R.color.ink),
        onBackground = colorResource(R.color.ui_text),
        surface = colorResource(R.color.ui_plate),
        onSurface = colorResource(R.color.ui_text),
        surfaceVariant = colorResource(R.color.ui_plate_hi),
        onSurfaceVariant = colorResource(R.color.ui_dim),
        surfaceContainer = colorResource(R.color.ui_plate_hi),
        outline = colorResource(R.color.ui_hair),
        outlineVariant = colorResource(R.color.ui_hair),
        error = colorResource(R.color.deep_crimson),
        onError = colorResource(R.color.ui_text),
    )
    MaterialTheme(colorScheme = colorScheme, typography = CrimsonTypography, content = content)
}

/**
 * Type scale in the screen's own voice: a 30sp title with tight tracking, wide
 * letterspaced uppercase kickers, and a monospace for component paths — the
 * values the XML layouts used, expressed as one scale.
 */
private val CrimsonTypography = Typography(
    headlineMedium = TextStyle(
        fontSize = 30.sp,
        letterSpacing = (-0.02).em,
        fontWeight = FontWeight.SemiBold,
    ),
    labelSmall = TextStyle(
        fontSize = 11.sp,
        letterSpacing = 0.24.em,
        fontWeight = FontWeight.Medium,
    ),
    titleSmall = TextStyle(
        fontSize = 12.sp,
        letterSpacing = 0.18.em,
        fontWeight = FontWeight.Medium,
    ),
    bodyMedium = TextStyle(
        fontSize = 12.5.sp,
        lineHeight = 17.sp,
    ),
    bodySmall = TextStyle(
        fontSize = 11.sp,
        lineHeight = 15.sp,
    ),
    labelMedium = TextStyle(
        fontSize = 13.sp,
        fontWeight = FontWeight.Medium,
    ),
)

/** A colour resource, so screens never hard-code a hex the pack might change. */
@Composable
fun colorResource(id: Int): Color = androidx.compose.ui.res.colorResource(id)
