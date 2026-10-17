package com.crimsonmoon.iconpack;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.res.XmlResourceParser;

import org.xmlpull.v1.XmlPullParser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/**
 * Reads the pack's own generated resources.
 *
 * <p>Both XML files are looked up by name at runtime rather than through the
 * {@code R} class, so this module still compiles before {@code npm run build}
 * has produced them.
 */
final class PackInfo {

    /** An installed app whose launcher component the pack has no icon for. */
    static final class Missing {
        final String label;
        final String component;

        Missing(String label, String component) {
            this.label = label;
            this.component = component;
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

    /** Components the appfilter maps to an icon, as {@code package/activity}. */
    static Set<String> coveredComponents(Context ctx) {
        Set<String> covered = new HashSet<>();
        XmlResourceParser parser = open(ctx, "appfilter");
        if (parser == null) return covered;
        try {
            int event;
            while ((event = parser.next()) != XmlPullParser.END_DOCUMENT) {
                if (event != XmlPullParser.START_TAG || !"item".equals(parser.getName())) continue;
                String component = parser.getAttributeValue(null, "component");
                if (component == null) continue;
                int start = component.indexOf('{');
                int end = component.lastIndexOf('}');
                if (start >= 0 && end > start) component = component.substring(start + 1, end);
                if (!component.isEmpty()) covered.add(component);
            }
        } catch (Exception ignored) {
            // Same reasoning as above.
        } finally {
            parser.close();
        }
        return covered;
    }

    /** Launcher apps on this phone that the pack has no mapping for. */
    static List<Missing> missingApps(Context ctx) {
        Set<String> covered = coveredComponents(ctx);
        PackageManager pm = ctx.getPackageManager();
        String self = ctx.getPackageName();

        Intent launcher = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER);
        List<ResolveInfo> installed = pm.queryIntentActivities(launcher, 0);

        // Keyed by label so an app with several launcher activities is listed once.
        Map<String, Missing> byLabel = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        for (ResolveInfo info : installed) {
            if (info.activityInfo == null) continue;
            String pkg = info.activityInfo.packageName;
            if (self.equals(pkg)) continue;
            String component = pkg + "/" + info.activityInfo.name;
            if (covered.contains(component)) continue;
            String label = String.valueOf(info.loadLabel(pm));
            if (!byLabel.containsKey(label)) byLabel.put(label, new Missing(label, component));
        }
        return new ArrayList<>(byLabel.values());
    }

    /** Distinct launcher packages installed on this phone. */
    static int installedAppCount(Context ctx) {
        PackageManager pm = ctx.getPackageManager();
        Intent launcher = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER);
        Set<String> packages = new HashSet<>();
        for (ResolveInfo info : pm.queryIntentActivities(launcher, 0)) {
            if (info.activityInfo != null) packages.add(info.activityInfo.packageName);
        }
        packages.remove(ctx.getPackageName());
        return packages.size();
    }

    /**
     * The missing components as plain {@code package/activity} lines — the exact
     * format tools/sync-components.mjs reads from a device dump.
     */
    static String exportText(Context ctx) {
        StringBuilder out = new StringBuilder();
        out.append("# Crimson Moon — launcher components this build does not cover.\n");
        out.append("# Save as a file, then run: node tools/sync-components.mjs <file>\n");
        for (Missing missing : missingApps(ctx)) {
            out.append(missing.component).append('\n');
        }
        return out.toString();
    }
}
