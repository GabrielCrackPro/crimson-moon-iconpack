package com.crimsonmoon.iconpack;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

/**
 * The pack's own screen: apply it, browse it, and find out what it still misses.
 *
 * <p>The coverage card is the useful half. Launchers match icons by exact
 * {@code package/activity} component, so an icon that refuses to apply is either
 * <em>mismatched</em> (the pack has the icon, the phone reports another component)
 * or <em>missing</em> (no icon for that package at all). The screen computes both
 * on the phone and exports them in the format the repo's device-sync tool reads.
 */
public class MainActivity extends Activity {

    private IconAdapter adapter;
    private TextView countView;
    private String[] iconNames;
    private List<PackInfo.Entry> mismatched;
    private List<PackInfo.Entry> missing;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        setContentView(R.layout.activity_main);

        iconNames = PackInfo.iconNames(this);
        List<PackInfo.Entry> entries = PackInfo.entries(this);
        mismatched = PackInfo.ofKind(entries, PackInfo.MISMATCH);
        missing = PackInfo.ofKind(entries, PackInfo.MISSING);
        int covered = entries.size() - mismatched.size() - missing.size();

        bindHeader(covered, entries.size());
        bindApplyCard();
        bindGrid();
        bindCoverage();
    }

    // ------------------------------------------------------------------ header

    private void bindHeader(int covered, int total) {
        ImageView mark = findViewById(R.id.pack_mark);
        int markRes = getResources().getIdentifier("generic", "drawable", getPackageName());
        if (markRes != 0) mark.setImageResource(markRes);

        TextView subtitle = findViewById(R.id.pack_subtitle);
        subtitle.setText(getString(R.string.ui_icons_fmt, iconNames.length)
                + " · " + getString(R.string.ui_coverage_fmt, covered, total));
    }

    // ------------------------------------------------------------- apply card

    private void bindApplyCard() {
        LinearLayout list = findViewById(R.id.apply_list);
        List<Launchers.Launcher> launchers = Launchers.installed(this);

        if (launchers.isEmpty()) {
            list.addView(body(getString(R.string.ui_no_launcher)));
            return;
        }

        for (Launchers.Launcher launcher : launchers) {
            LinearLayout block = new LinearLayout(this);
            block.setOrientation(LinearLayout.VERTICAL);
            block.setLayoutParams(new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT));
            block.setPadding(0, dp(4), 0, dp(4));

            boolean canApply = launcher.action != null;
            Button button = new Button(this);
            button.setText(getString(canApply ? R.string.ui_apply_now : R.string.ui_open_launcher, launcher.name));
            button.setBackgroundResource(R.drawable.ui_button);
            button.setTextColor(getColor(R.color.ui_text));
            button.setTextSize(13f);
            button.setAllCaps(false);
            button.setMinHeight(dp(44));
            button.setPadding(dp(18), 0, dp(18), 0);
            button.setGravity(Gravity.CENTER_VERTICAL);
            button.setOnClickListener(v -> runLauncher(launcher));
            block.addView(button);

            if (launcher.path != null) {
                TextView steps = body(getString(R.string.ui_apply_manual, launcher.path));
                steps.setTextSize(11f);
                steps.setTextColor(getColor(R.color.ui_dimmer));
                steps.setPadding(dp(4), dp(6), 0, 0);
                block.addView(steps);
            }
            list.addView(block);
        }
    }

    private void runLauncher(Launchers.Launcher launcher) {
        if (launcher.action != null) {
            try {
                startActivity(Launchers.apply(launcher, getPackageName()));
                return;
            } catch (ActivityNotFoundException e) {
                // Falls through to opening the launcher itself.
            }
        }
        try {
            startActivity(Launchers.open(launcher));
        } catch (ActivityNotFoundException e) {
            toast(launcher.name + " could not be opened");
            return;
        }
        if (launcher.path != null) toast(launcher.path);
    }

    // -------------------------------------------------------------- icon grid

    private void bindGrid() {
        GridView grid = findViewById(R.id.icon_grid);
        countView = findViewById(R.id.icon_count);
        adapter = new IconAdapter(getApplicationContext(), iconNames);
        grid.setAdapter(adapter);
        updateCount();

        EditText search = findViewById(R.id.icon_search);
        search.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                adapter.filter(s.toString());
                updateCount();
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }

    private void updateCount() {
        countView.setText(getString(R.string.ui_icon_count_search, adapter.getCount()));
    }

    // ---------------------------------------------------------- coverage card

    private void bindCoverage() {
        TextView mismatchCount = findViewById(R.id.mismatch_count);
        TextView missingCount = findViewById(R.id.missing_count);
        Button showMismatch = findViewById(R.id.mismatch_show);
        Button showMissing = findViewById(R.id.missing_show);
        TextView bodyView = findViewById(R.id.coverage_body);
        TextView hint = findViewById(R.id.export_hint);
        Button copy = findViewById(R.id.coverage_copy);
        Button share = findViewById(R.id.coverage_share);

        mismatchCount.setText(String.valueOf(mismatched.size()));
        missingCount.setText(String.valueOf(missing.size()));

        boolean nothingToFix = mismatched.isEmpty() && missing.isEmpty();
        if (nothingToFix) {
            bodyView.setText(R.string.ui_coverage_none);
            hint.setVisibility(View.GONE);
            copy.setVisibility(View.GONE);
            share.setVisibility(View.GONE);
            showMismatch.setVisibility(View.GONE);
            showMissing.setVisibility(View.GONE);
            return;
        }

        bodyView.setText(getString(R.string.ui_coverage_body, mismatched.size(), missing.size()));
        hint.setText(getString(R.string.ui_export_hint));
        copy.setOnClickListener(v -> copyList());
        share.setOnClickListener(v -> shareList());

        showMismatch.setEnabled(!mismatched.isEmpty());
        showMismatch.setOnClickListener(v -> showList(mismatched, R.string.ui_mismatch_title, R.string.ui_mismatch_help));
        showMissing.setEnabled(!missing.isEmpty());
        showMissing.setOnClickListener(v -> showList(missing, R.string.ui_missing_title, R.string.ui_missing_help));
    }

    private void copyList() {
        if (mismatched.isEmpty() && missing.isEmpty()) {
            toast(getString(R.string.ui_nothing_missing));
            return;
        }
        ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
        clipboard.setPrimaryClip(ClipData.newPlainText("Crimson Moon components", PackInfo.exportText(this)));
        toast(getString(R.string.ui_copied));
    }

    private void shareList() {
        if (mismatched.isEmpty() && missing.isEmpty()) {
            toast(getString(R.string.ui_nothing_missing));
            return;
        }
        Intent send = new Intent(Intent.ACTION_SEND)
                .setType("text/plain")
                .putExtra(Intent.EXTRA_SUBJECT, "Crimson Moon — components to add")
                .putExtra(Intent.EXTRA_TEXT, PackInfo.exportText(this));
        startActivity(Intent.createChooser(send, getString(R.string.ui_share)));
    }

    private void showList(List<PackInfo.Entry> entries, int titleRes, int helpRes) {
        if (entries.isEmpty()) {
            toast(getString(R.string.ui_nothing_missing));
            return;
        }
        String[] rows = new String[entries.size()];
        for (int i = 0; i < entries.size(); i++) {
            PackInfo.Entry entry = entries.get(i);
            rows[i] = entry.label + "\n" + entry.component;
        }
        new AlertDialog.Builder(this)
                .setTitle(getString(titleRes) + " · " + entries.size())
                .setMessage(getString(helpRes))
                .setItems(rows, null)
                .setPositiveButton(android.R.string.ok, null)
                .show();
    }

    // ----------------------------------------------------------------- helpers

    private TextView body(String text) {
        TextView view = new TextView(this);
        view.setText(text);
        view.setTextColor(getColor(R.color.ui_dim));
        view.setTextSize(12.5f);
        view.setLineSpacing(0f, 1.15f);
        return view;
    }

    private void toast(String text) {
        Toast.makeText(this, text, Toast.LENGTH_LONG).show();
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
