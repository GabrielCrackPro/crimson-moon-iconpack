package com.crimsonmoon.iconpack

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.XmlResourceParser
import org.xmlpull.v1.XmlPullParser
import java.util.TreeMap

/**
 * Reads the pack's own generated resources.
 *
 * Both XML files are looked up by name at runtime rather than through the
 * [android.R] class, so this module still compiles before `npm run build` has
 * produced them.
 *
 * Launchers match icons by exact `package/activity` component. That splits the
 * apps on a phone into three groups, and the middle one is the interesting one:
 *
 *  - [COVERED] — the exact component is in appfilter.xml.
 *  - [MISMATCH] — the pack ships an icon for this *package*, but not for the
 *    component the phone actually reports, so the icon silently refuses to
 *    apply. Usually a ROM or app update moved the launcher activity.
 *  - [MISSING] — the pack has no icon for this package at all.
 *
 * Both non-covered groups are fixed by the same file, so they share one export.
 */
object PackInfo {

    const val COVERED = 0
    const val MISMATCH = 1
    const val MISSING = 2

    /** One installed launcher entry and how the pack relates to it. */
    data class Entry(
        val label: String,
        val component: String,
        val drawable: String?,
        val kind: Int,
    )

    private fun open(ctx: Context, name: String): XmlResourceParser? {
        val id = ctx.resources.getIdentifier(name, "xml", ctx.packageName)
        return if (id == 0) null else ctx.resources.getXml(id)
    }

    /** Icon names, straight from drawable.xml — every drawable the pack ships. */
    fun iconNames(ctx: Context): List<String> {
        val names = mutableListOf<String>()
        val parser = open(ctx, "drawable") ?: return emptyList()
        parser.use {
            try {
                while (it.next() != XmlPullParser.END_DOCUMENT) {
                    if (it.eventType == XmlPullParser.START_TAG && it.name == "item") {
                        it.getAttributeValue(null, "drawable")?.let { drawable -> names.add(drawable) }
                    }
                }
            } catch (e: Exception) {
                // A malformed resource must not take the whole screen down.
            }
        }
        return names.sortedWith(String.CASE_INSENSITIVE_ORDER)
    }

    /** appfilter.xml as both component → drawable and package → drawable. */
    private fun readMappings(
        ctx: Context,
        byComponent: MutableMap<String, String>,
        byPackage: MutableMap<String, String>,
    ) {
        val parser = open(ctx, "appfilter") ?: return
        parser.use {
            try {
                while (it.next() != XmlPullParser.END_DOCUMENT) {
                    if (it.eventType != XmlPullParser.START_TAG || it.name != "item") continue
                    val drawable = it.getAttributeValue(null, "drawable") ?: continue
                    var component = it.getAttributeValue(null, "component") ?: continue
                    val start = component.indexOf('{')
                    val end = component.lastIndexOf('}')
                    if (start >= 0 && end > start) component = component.substring(start + 1, end)
                    if (component.isEmpty()) continue
                    byComponent[component] = drawable
                    val slash = component.indexOf('/')
                    if (slash > 0) byPackage.putIfAbsent(component.substring(0, slash), drawable)
                }
            } catch (e: Exception) {
                // Same reasoning as above.
            }
        }
    }

    /** Every launcher app on this phone, classified, one row per app. */
    fun entries(ctx: Context): List<Entry> {
        val byComponent = HashMap<String, String>()
        val byPackage = HashMap<String, String>()
        readMappings(ctx, byComponent, byPackage)

        val pm = ctx.packageManager
        val self = ctx.packageName
        val launcher = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)

        // Keyed by label: an app with several launcher activities is one row, and
        // a component the pack does not match outranks one it does.
        val byLabel = TreeMap<String, Entry>(String.CASE_INSENSITIVE_ORDER)
        for (info in pm.queryIntentActivities(launcher, 0)) {
            val activityInfo = info.activityInfo ?: continue
            val pkg = activityInfo.packageName
            if (self == pkg) continue
            val component = "$pkg/${activityInfo.name}"

            val exact = byComponent[component]
            val drawable = exact ?: byPackage[pkg]
            val kind = when {
                exact != null -> COVERED
                drawable != null -> MISMATCH
                else -> MISSING
            }

            val label = info.loadLabel(pm).toString()
            val existing = byLabel[label]
            if (existing == null || (existing.kind == COVERED && kind != COVERED)) {
                byLabel[label] = Entry(label, component, drawable, kind)
            }
        }
        return byLabel.values.toList()
    }

    fun ofKind(entries: List<Entry>, kind: Int): List<Entry> = entries.filter { it.kind == kind }

    /**
     * Every component the pack does not match, in plain `package/activity`
     * lines — the format tools/sync-components.mjs reads from a device dump.
     */
    fun exportText(entries: List<Entry>): String {
        val mismatched = ofKind(entries, MISMATCH)
        val missing = ofKind(entries, MISSING)

        val out = StringBuilder()
        out.append("# Crimson Moon — components this build does not match.\n")
        out.append("# Save as a file, then run: node tools/sync-components.mjs <file>\n")
        if (mismatched.isNotEmpty()) {
            out.append("#\n# The pack has an icon for these apps, but your phone reports a\n")
            out.append("# different launcher component, so the icon never applied:\n")
            for (entry in mismatched) out.append("#   ${entry.label} -> ${entry.drawable}\n")
        }
        for (entry in mismatched) out.append(entry.component).append('\n')
        if (missing.isNotEmpty()) {
            out.append("#\n# No icon in the pack for these apps yet:\n")
            for (entry in missing) out.append("#   ${entry.label}\n")
        }
        for (entry in missing) out.append(entry.component).append('\n')
        return out.toString()
    }
}
