package com.migdlp.galletafactory;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;

public final class MainActivity extends Activity {
    private WebView game;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        game = new WebView(this);
        game.setBackgroundColor(0xff17120f);
        game.getSettings().setJavaScriptEnabled(true);
        game.getSettings().setDomStorageEnabled(true);
        game.getSettings().setAllowFileAccessFromFileURLs(false);
        game.getSettings().setAllowUniversalAccessFromFileURLs(false);
        game.setWebChromeClient(new WebChromeClient());
        game.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return true; // The game has no external navigation.
            }
        });
        // Respect system bars, including Android 15 edge-to-edge enforcement.
        game.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        setContentView(game);
        game.requestApplyInsets();
        game.loadUrl("file:///android_asset/index.html");
    }

    @Override protected void onPause() {
        game.evaluateJavascript("window.saveGame && window.saveGame()", null);
        game.onPause();
        game.pauseTimers();
        super.onPause();
    }

    @Override protected void onResume() {
        super.onResume();
        if (game != null) {
            game.onResume();
            game.resumeTimers();
        }
    }

    @Override protected void onDestroy() {
        game.destroy();
        super.onDestroy();
    }
}
