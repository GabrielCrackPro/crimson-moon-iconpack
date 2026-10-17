package com.crimsonmoon.iconpack;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;

import java.util.ArrayList;
import java.util.List;

/**
 * How to get the pack applied, per launcher.
 *
 * <p>Some launchers accept an "apply this icon pack" broadcast with our package
 * name as an extra; those get a one-tap button. The rest only expose their own
 * settings screen, so the app opens the launcher and spells out the path.
 */
final class Launchers {

    static final class Launcher {
        final String name;
        final String pkg;
        /** Explicit apply intent action, or null when we can only guide. */
        final String action;
        /** Where to tap once the user is inside that launcher's settings. */
        final String path;

        Launcher(String name, String pkg, String action, String path) {
            this.name = name;
            this.pkg = pkg;
            this.action = action;
            this.path = path;
        }
    }

    private static final Launcher[] KNOWN = {
            new Launcher("Nova Launcher", "com.teslacoilsw.launcher", null,
                    "Nova Settings → Look & feel → Icon style → Crimson Moon"),
            new Launcher("Lawnchair", "app.lawnchair", "app.lawnchair.APPLY_ICONS", null),
            new Launcher("Lawnchair", "ch.deletescape.lawnchair", "ch.deletescape.lawnchair.APPLY_ICONS", null),
            new Launcher("Niagara Launcher", "bitpit.launcher", "bitpit.launcher.APPLY_ICONS", null),
            new Launcher("ADW Launcher", "org.adw.launcher", null,
                    "ADW Settings → Theme → Crimson Moon"),
            new Launcher("Apex Launcher", "com.anddoes.launcher", null,
                    "Apex Settings → Theme settings → Icon pack → Crimson Moon"),
            new Launcher("Smart Launcher", "ginlemon.flowerfree", null,
                    "Smart Launcher preferences → Global appearance → Icon pack"),
            new Launcher("Smart Launcher", "ginlemon.flowerpro", null,
                    "Smart Launcher preferences → Global appearance → Icon pack"),
            new Launcher("Microsoft Launcher", "com.microsoft.launcher", null,
                    "Launcher settings → Personalize → Icon pack"),
            new Launcher("Total Launcher", "com.ss.launcher2", null,
                    "Launcher settings → Icon pack → Crimson Moon"),
    };

    private Launchers() {
    }

    /** Known launchers that are actually installed, without duplicates by package. */
    static List<Launcher> installed(Context ctx) {
        PackageManager pm = ctx.getPackageManager();
        List<Launcher> out = new ArrayList<>();
        List<String> seen = new ArrayList<>();
        for (Launcher launcher : KNOWN) {
            if (seen.contains(launcher.pkg)) continue;
            if (!isInstalled(pm, launcher.pkg)) continue;

            seen.add(launcher.pkg);
            out.add(launcher);
        }
        return out;
    }

    private static boolean isInstalled(PackageManager pm, String pkg) {
        try {
            pm.getPackageInfo(pkg, 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    /** Opens the launcher so the user can walk the settings path themselves. */
    static Intent open(Launcher launcher) {
        Intent intent = new Intent(Intent.ACTION_MAIN)
                .addCategory(Intent.CATEGORY_LAUNCHER)
                .setPackage(launcher.pkg)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return intent;
    }

    /** The launcher's own apply action, with our package name in the extra. */
    static Intent apply(Launcher launcher, String packPackage) {
        return new Intent(launcher.action)
                .setPackage(launcher.pkg)
                .putExtra("packageName", packPackage)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }
}
