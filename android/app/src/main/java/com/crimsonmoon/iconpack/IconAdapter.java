package com.crimsonmoon.iconpack;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/** Renders every icon in the pack, filtered by the search field. */
final class IconAdapter extends BaseAdapter {

    private final Context ctx;
    private final LayoutInflater inflater;
    private final String[] all;
    private final List<String> shown = new ArrayList<>();
    private final int fallbackIcon;

    IconAdapter(Context ctx, String[] iconNames) {
        this.ctx = ctx;
        this.inflater = LayoutInflater.from(ctx);
        this.all = iconNames;
        this.fallbackIcon = android.R.drawable.sym_def_app_icon;
        shown.addAll(Arrays.asList(iconNames));
    }

    void filter(String query) {
        String needle = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        shown.clear();
        for (String name : all) {
            if (needle.isEmpty() || label(name).toLowerCase(Locale.ROOT).contains(needle)
                    || name.toLowerCase(Locale.ROOT).contains(needle)) {
                shown.add(name);
            }
        }
        notifyDataSetChanged();
    }

    /** {@code google_tv} → {@code Google tv}, good enough for a grid caption. */
    static String label(String id) {
        String words = id.replace('_', ' ');
        return words.isEmpty() ? words : Character.toUpperCase(words.charAt(0)) + words.substring(1);
    }

    @Override
    public int getCount() {
        return shown.size();
    }

    @Override
    public Object getItem(int position) {
        return shown.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convert, ViewGroup parent) {
        View row = convert != null ? convert : inflater.inflate(R.layout.row_icon, parent, false);
        String name = shown.get(position);

        ImageView image = row.findViewById(R.id.icon_image);
        TextView caption = row.findViewById(R.id.icon_label);

        int drawable = ctx.getResources().getIdentifier(name, "drawable", ctx.getPackageName());
        image.setImageResource(drawable != 0 ? drawable : fallbackIcon);
        caption.setText(label(name));
        return row;
    }
}
