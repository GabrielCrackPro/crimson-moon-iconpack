package com.crimsonmoon.iconpack

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge

/**
 * The pack's own screen, now a single Compose tree.
 *
 * The manifest still declares this activity under the same name and the same
 * launcher-theme intent filters — Nova, Lawnchair, ADW and friends scan for
 * those actions to list the pack, so they are load-bearing, not decoration.
 * tools/check.mjs guards them.
 */
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            CrimsonTheme {
                PackScreen()
            }
        }
    }
}
