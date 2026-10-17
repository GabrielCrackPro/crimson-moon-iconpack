package com.crimsonmoon.iconpack;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.res.XmlResourceParser;

import org.xmlpull.v1.XmlPullParser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Reads the pack's own generated resources.
 *
 * <p>Both XML files are looked up by name at runtime rather than through the
 * {@code R} class, so this module still compiles before {@code npm run build}
 * has produced them.
 *
 * <p>Launchers match icons by exact {@code package/activity} component. That
 * splits the apps on a phone into three groups, and the middle one is the
 * interesting one:
 *
 * <ul>
 *   <li>{@link #COVERED} — the exact component is in appfilter.xml.</li>
 *   <li>{@link #MISMATCH} — the pack ships an icon for this <em>package</em>,
 *       but not for the component the phone actually reports, so the icon
 *       silently refuses to apply. Usually a ROM or app update moved the
 *       launcher activity.</li>
 *   <li>{@link #MISSING} — the pack has no icon for this package at all.</li>
 * </ul>
 *
 * <p>Both non-covered groups are fixed by the same file, so they share one
 * export.
 */
final class PackInfo {

    static final int COVERED = 0;
    static final int MISMATCH = 1;
    static final int MISSING = 2;

    /** One installed launcher entry and how the pack relates to it. */
    static final class Entry {
        final String label;
        final String component;
        final String drawable;
        final int kind;

        Entry(String label, String component, String drawable, int kind) {
            this.label = label;
            this.component = component;
            this.drawable = drawable;
            this.kind = kind;
        }
    }

    private PackInfo() {
    }

    private static XmlResourceParser open(Context ctx, String name) {
        int id = ctx.getResources().getIdentifier(name, "xml", ctx.getPackageName());
        return id == 0 ? null : ctx.getResources().getXml(id);
    }

    /** Icon names, straight from drawable.xml — every drawable the pack ships. */
    static String[] iconNames(Context ctx) {
        List<String> names = new ArrayList<>();
        XmlResourceParser parser = open(ctx, "drawable");
        if (parser != null) {
            try {
                int event;
                while ((event = parser.next()) != XmlPullParser.END_DOCUMENT) {
                    if (event == XmlPullParser.START_TAG && "item".equals(parser.getName())) {
                        String drawable = parser.getAttributeValue(null, "drawable");
                        if (drawable != null) names.add(drawable);
                    }
                }
            } catch (Exception ignored) {
                // A malformed resource must not take the whole screen down.
            } finally {
                parser.close();
            }
        }
        Collections.sort(names, String.CASE_INSENSITIVE_ORDER);
        return names.toArray(new String[0]);
    }

    /** appfilter.xml as both component → drawable and package → drawable. */
    private static void readMappings(Context ctx, Map<String, String> byComponent, Map<String, String> byPackage) {
        XmlResourceParser parser = open(ctx, "appfilter");
        if (parser == null) return;
        try {
            int event;
            while ((event = parser.next()) != XmlPullParser.END_DOCUMENT) {
                if (event != XmlPullParser.START_TAG || !"item".equals(parser.getName())) continue;
                String drawable = parser.getAttributeValue(null, "drawable");
                String component = parser.getAttributeValue(null, "component");
                if (drawable == null || component == null) continue;
                int start = component.indexOf('{');
                int end = component.lastIndexOf('}');
                if (start >= 0 && end > start) component = component.substring(start + 1, end);
                if (component.isEmpty()) continue;
                byComponent.put(component, drawable);
                int slash = component.indexOf('/');
                if (slash > 0) byPackage.putIfAbsent(component.substring(0, slash), drawable);
            }
        } catch (Exception ignored) {
            // Same reasoning as above.
        } finally {
            parser.close();
        }
    }

    /** Every launcher app on this phone, classified, one line per app. */
    static List<Entry> entries(Context ctx) {
        Map<String, String> byComponent = new HashMap<>();
        Map<String, String> byPackage = new HashMap<>();
        readMappings(ctx, byComponent, byPackage);

        PackageManager pm = ctx.getPackageManager();
        String self = ctx.getPackageName();
        Intent launcher = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER);

        // Keyed by label: an app with several launcher activities is one row, and
        // a component the pack does not match outranks one it does.
        Map<String, Entry> byLabel = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        for (ResolveInfo info : pm.queryIntentActivities(launcher, 0)) {
            if (info.activityInfo == null) continue;
            String pkg = info.activityInfo.packageName;
            if (self.equals(pkg)) continue;
            String component = pkg + "/" + info.activityInfo.name;

            String exact = byComponent.get(component);
            String drawable = exact != null ? exact : byPackage.get(pkg);
            int kind = exact != null ? COVERED : (drawable != null ? MISMATCH : MISSING);

            String label = String.valueOf(info.loadLabel(pm));
            Entry existing = byLabel.get(label);
            if (existing == null || (existing.kind == COVERED && kind != COVERED)) {
                byLabel.put(label, new Entry(label, component, drawable, kind));
            }
        }
        return new ArrayList<>(byLabel.values());
    }

    static List<Entry> ofKind(List<Entry> entries, int kind) {
        List<Entry> out = new ArrayList<>();
        for (Entry entry : entries) {
            if (entry.kind == kind) out.add(entry);
        }
        return out;
    }

    /**
     * Every component the pack does not match, in plain {@code package/activity}
     * lines — the format tools/sync-components.mjs reads from a device dump.
     */
    static String exportText(Context ctx) {
        List<Entry> all = entries(ctx);
        List<Entry> mismatched = ofKind(all, MISMATCH);
        List<Entry> missing = ofKind(all, MISSING);

        StringBuilder out = new StringBuilder();
        out.append("# Crimson Moon — components this build does not match.\n");
        out.append("# Save as a file, then run: node tools/sync-components.mjs <file>\n");
        if (!mismatched.isEmpty()) {
            out.append("#\n# The pack has an icon for these apps, but your phone reports a\n");
            out.append("# different launcher component, so the icon never applied:\n");
            for (Entry entry : mismatched) {
                out.append("#   ").append(entry.label).append(" -> ").append(entry.drawable).append('\n');
            }
        }
        for (Entry entry : mismatched) out.append(entry.component).append('\n');
        if (!missing.isEmpty()) {
            out.append("#\n# No icon in the pack for these apps yet:\n");
            for (Entry entry : missing) {
                out.append("#   ").append(entry.label).append('\n');
            }
        }
        for (Entry entry : missing) out.append(entry.component).append('\n');
        return out.toString();
    }
}
