package com.crimsonmoon.iconpack

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager

/**
 * How to get the pack applied, per launcher.
 *
 * Some launchers accept an "apply this icon pack" broadcast with our package
 * name as an extra; those get a one-tap button. The rest only expose their own
 * settings screen, so the app opens the launcher and spells out the path.
 */
object Launchers {

    data class Launcher(
        val name: String,
        val pkg: String,
        /** Explicit apply intent action, or null when we can only guide. */
        val action: String?,
        /** Where to tap once the user is inside that launcher's settings. */
        val path: String?,
    )

    private val KNOWN = listOf(
        Launcher("Nova Launcher", "com.teslacoilsw.launcher", null,
            "Nova Settings → Look & feel → Icon style → Crimson Moon"),
        Launcher("Lawnchair", "app.lawnchair", "app.lawnchair.APPLY_ICONS", null),
        Launcher("Lawnchair", "ch.deletescape.lawnchair", "ch.deletescape.lawnchair.APPLY_ICONS", null),
        Launcher("Niagara Launcher", "bitpit.launcher", "bitpit.launcher.APPLY_ICONS", null),
        Launcher("ADW Launcher", "org.adw.launcher", null,
            "ADW Settings → Theme → Crimson Moon"),
        Launcher("Apex Launcher", "com.anddoes.launcher", null,
            "Apex Settings → Theme settings → Icon pack → Crimson Moon"),
        Launcher("Smart Launcher", "ginlemon.flowerfree", null,
            "Smart Launcher preferences → Global appearance → Icon pack"),
        Launcher("Smart Launcher", "ginlemon.flowerpro", null,
            "Smart Launcher preferences → Global appearance → Icon pack"),
        Launcher("Microsoft Launcher", "com.microsoft.launcher", null,
            "Launcher settings → Personalize → Icon pack"),
        Launcher("Total Launcher", "com.ss.launcher2", null,
            "Launcher settings → Icon pack → Crimson Moon"),
    )

    /** Known launchers that are actually installed, without duplicates by package. */
    fun installed(ctx: Context): List<Launcher> {
        val pm = ctx.packageManager
        val seen = mutableSetOf<String>()
        return KNOWN.filter { launcher ->
            if (seen.contains(launcher.pkg)) return@filter false
            if (!isInstalled(pm, launcher.pkg)) return@filter false
            seen.add(launcher.pkg)
            true
        }
    }

    private fun isInstalled(pm: PackageManager, pkg: String): Boolean = try {
        pm.getPackageInfo(pkg, 0)
        true
    } catch (e: PackageManager.NameNotFoundException) {
        false
    }

    /** Opens the launcher so the user can walk the settings path themselves. */
    fun open(launcher: Launcher): Intent = Intent(Intent.ACTION_MAIN)
        .addCategory(Intent.CATEGORY_LAUNCHER)
        .setPackage(launcher.pkg)
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

    /** The launcher's own apply action, with our package name in the extra. */
    fun apply(launcher: Launcher, packPackage: String): Intent = Intent(launcher.action)
        .setPackage(launcher.pkg)
        .putExtra("packageName", packPackage)
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
}
