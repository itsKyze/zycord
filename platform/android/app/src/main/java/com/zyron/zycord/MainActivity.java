package com.zyron.zycord;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.media.AudioManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {

    private static final String BASE_ORIGIN = "https://app.zyron.site";
    private static final String APP_URL = "https://app.zyron.site/app";
    private static final String NOTIFICATION_CHANNEL_ID = "zycord_messages";
    private static final int FILE_CHOOSER_REQUEST_CODE = 1001;
    private static final int PERMISSIONS_REQUEST_CODE = 1002;

    private WebView webView;
    private LinearLayout splashContainer;
    private TextView statusLabel;
    private ProgressBar loadingSpinner;
    private Button retryButton;
    private ValueCallback<Uri[]> filePathCallback;
    private PermissionRequest pendingWebPermissionRequest;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private boolean hasLoadedOnce = false;
    private int notificationCounter = 2000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setupSystemBars();
        createNotificationChannel();
        requestInitialPermissions();

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("#1E1F22"));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#1E1F22"));
        configureWebView();

        splashContainer = buildSplashOverlay();

        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        root.addView(splashContainer, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        setContentView(root);

        String targetUrl = resolveIntentUrl(getIntent());
        loadTargetUrl(targetUrl);
    }

    private void setupSystemBars() {
        Window window = getWindow();
        if (window == null) return;
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        int bgColor = Color.parseColor("#1E1F22");
        window.setStatusBarColor(bgColor);
        window.setNavigationBarColor(bgColor);
    }

    private LinearLayout buildSplashOverlay() {
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setGravity(Gravity.CENTER);
        container.setBackgroundColor(Color.parseColor("#1E1F22"));
        int pad = dp(32);
        container.setPadding(pad, pad, pad, pad);

        ImageView logo = new ImageView(this);
        logo.setImageResource(R.drawable.splash_logo);
        LinearLayout.LayoutParams logoParams = new LinearLayout.LayoutParams(dp(96), dp(96));
        logoParams.bottomMargin = dp(20);
        container.addView(logo, logoParams);

        TextView title = new TextView(this);
        title.setText("Zycord");
        title.setTextColor(Color.WHITE);
        title.setTextSize(24f);
        title.setTypeface(Typeface.create("sans-serif-medium", Typeface.BOLD));
        title.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        titleParams.bottomMargin = dp(8);
        container.addView(title, titleParams);

        statusLabel = new TextView(this);
        statusLabel.setText("Connecting to Zycord...");
        statusLabel.setTextColor(Color.parseColor("#B5BAC1"));
        statusLabel.setTextSize(14f);
        statusLabel.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams statusParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        statusParams.bottomMargin = dp(24);
        container.addView(statusLabel, statusParams);

        loadingSpinner = new ProgressBar(this);
        loadingSpinner.setIndeterminate(true);
        LinearLayout.LayoutParams spinnerParams = new LinearLayout.LayoutParams(dp(36), dp(36));
        container.addView(loadingSpinner, spinnerParams);

        retryButton = new Button(this);
        retryButton.setText("Retry Connection");
        retryButton.setTextColor(Color.WHITE);
        retryButton.setTextSize(15f);
        retryButton.setAllCaps(false);
        retryButton.setTypeface(Typeface.create("sans-serif-medium", Typeface.BOLD));
        GradientDrawable btnBg = new GradientDrawable();
        btnBg.setColor(Color.parseColor("#5865F2"));
        btnBg.setCornerRadius(dp(24));
        retryButton.setBackground(btnBg);
        retryButton.setPadding(dp(28), dp(12), dp(28), dp(12));
        retryButton.setVisibility(View.GONE);
        retryButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                retryButton.setVisibility(View.GONE);
                loadingSpinner.setVisibility(View.VISIBLE);
                statusLabel.setText("Reconnecting to Zycord...");
                webView.reload();
            }
        });
        LinearLayout.LayoutParams retryParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        retryParams.topMargin = dp(8);
        container.addView(retryButton, retryParams);

        return container;
    }

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

        // Strip "; wv" so ZycordMobileWeb & WebRTC recognize full mobile Chrome capabilities
        String defaultUa = settings.getUserAgentString();
        String cleanUa = defaultUa.replace("; wv)", ")").replace("Version/4.0 ", "");
        settings.setUserAgentString(cleanUa + " ZycordMobile/1.0.11");

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        webView.addJavascriptInterface(new ZycordAndroidBridge(), "ZycordAndroid");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri == null) return false;
                String scheme = uri.getScheme() != null ? uri.getScheme().toLowerCase() : "";
                String host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";

                if ("zycord".equals(scheme)) {
                    String path = uri.getPath() != null ? uri.getPath() : "/app";
                    view.loadUrl(BASE_ORIGIN + path);
                    return true;
                }

                if ("http".equals(scheme) || "https".equals(scheme)) {
                    if (host.endsWith("zyron.site")) {
                        return false;
                    }
                    try {
                        Intent browserIntent = new Intent(Intent.ACTION_VIEW, uri);
                        startActivity(browserIntent);
                    } catch (Exception ignored) {
                    }
                    return true;
                }

                try {
                    Intent externalIntent = new Intent(Intent.ACTION_VIEW, uri);
                    startActivity(externalIntent);
                } catch (Exception ignored) {
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                CookieManager.getInstance().flush();
                injectMobileBridgeScript();
                if (isNetworkAvailable()) {
                    hideSplashOverlay();
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request != null && request.isForMainFrame() && !hasLoadedOnce) {
                    showOfflineState("Unable to reach Zycord. Check your internet connection.");
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        handleWebPermissionRequest(request);
                    }
                });
            }

            @Override
            public boolean onShowFileChooser(
                    WebView webView,
                    ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams
            ) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;

                try {
                    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("*/*");
                    intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                    startActivityForResult(Intent.createChooser(intent, "Select File"), FILE_CHOOSER_REQUEST_CODE);
                    return true;
                } catch (Exception e) {
                    MainActivity.this.filePathCallback = null;
                    return false;
                }
            }
        });

        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                try {
                    if (url == null || url.startsWith("blob:") || url.startsWith("data:")) {
                        return;
                    }
                    DownloadManager.Request req = new DownloadManager.Request(Uri.parse(url));
                    String cookies = CookieManager.getInstance().getCookie(url);
                    if (cookies != null) {
                        req.addRequestHeader("cookie", cookies);
                    }
                    req.addRequestHeader("User-Agent", userAgent);
                    String fileName = URLUtil.guessFileName(url, contentDisposition, mimetype);
                    req.setTitle(fileName);
                    req.setDescription("Downloading from Zycord...");
                    req.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                    req.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);

                    DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                    if (dm != null) {
                        dm.enqueue(req);
                        Toast.makeText(MainActivity.this, "Downloading " + fileName, Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    } catch (Exception ignored) {
                    }
                }
            }
        });
    }

    private void handleWebPermissionRequest(PermissionRequest request) {
        String[] resources = request.getResources();
        List<String> missingAndroidPerms = new ArrayList<String>();
        boolean needsAudio = false;

        for (String res : resources) {
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(res)) {
                needsAudio = true;
                if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    missingAndroidPerms.add(Manifest.permission.RECORD_AUDIO);
                }
            } else if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(res)) {
                if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                    missingAndroidPerms.add(Manifest.permission.CAMERA);
                }
            }
        }

        if (needsAudio) {
            enableVoiceCommunicationAudio();
        }

        if (missingAndroidPerms.isEmpty()) {
            request.grant(resources);
        } else {
            pendingWebPermissionRequest = request;
            requestPermissions(missingAndroidPerms.toArray(new String[0]), PERMISSIONS_REQUEST_CODE);
        }
    }

    private void enableVoiceCommunicationAudio() {
        try {
            AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            if (audioManager != null) {
                audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
                if (!audioManager.isBluetoothScoOn() && !audioManager.isWiredHeadsetOn()) {
                    audioManager.setSpeakerphoneOn(true);
                }
            }
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        } catch (Exception ignored) {
        }
    }

    private void injectMobileBridgeScript() {
        String js = "(function(){"
                + "if(window.__zycordAndroidInjected)return;"
                + "window.__zycordAndroidInjected=true;"
                + "try{"
                + "  if(!localStorage.getItem('zycord.gifProvider'))localStorage.setItem('zycord.gifProvider','tenor');"
                + "  var style=document.createElement('style');"
                + "  style.id='zycord-android-styles';"
                + "  style.textContent='html,body{background:#1e1f22 !important;overscroll-behavior-y:none !important;-webkit-tap-highlight-color:transparent !important;}';"
                + "  (document.head||document.documentElement).appendChild(style);"
                + "  if(window.ZycordAndroid){"
                + "    var OrigNotif=window.Notification;"
                + "    function AndroidNotif(title,opts){"
                + "      opts=opts||{};"
                + "      try{window.ZycordAndroid.showNotification(String(title||'Zycord'),String(opts.body||''),location.pathname||'/app');}catch(e){}"
                + "      this.close=function(){};"
                + "      this.addEventListener=function(){};"
                + "      this.removeEventListener=function(){};"
                + "    }"
                + "    AndroidNotif.permission='granted';"
                + "    AndroidNotif.requestPermission=function(){return Promise.resolve('granted');};"
                + "    window.Notification=AndroidNotif;"
                + "    if(!navigator.share){"
                + "      navigator.share=function(data){"
                + "        data=data||{};"
                + "        window.ZycordAndroid.shareText(String(data.title||'Zycord'),String(data.url||data.text||location.href));"
                + "        return Promise.resolve();"
                + "      };"
                + "    }"
                + "    var currentVer=window.ZycordAndroid.getAppVersion();"
                + "    var currentCode=window.ZycordAndroid.getAppVersionCode();"
                + "    var initialWebHash=null;"
                + "    function showAndroidUpdateBanner(msg,downloadUrl){"
                + "      if(document.getElementById('zycord-android-update-bar'))return;"
                + "      var bar=document.createElement('div');"
                + "      bar.id='zycord-android-update-bar';"
                + "      bar.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#23a55a;color:#fff;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:600;box-shadow:0 2px 10px rgba(0,0,0,0.4);';"
                + "      var span=document.createElement('span');"
                + "      span.textContent=msg;"
                + "      var btn=document.createElement('button');"
                + "      btn.textContent=downloadUrl?'Update APK':'Reload';"
                + "      btn.style.cssText='background:#fff;color:#111214;border:none;border-radius:14px;padding:4px 12px;font-size:12px;font-weight:700;cursor:pointer;margin-left:10px;';"
                + "      btn.onclick=function(){"
                + "        if(downloadUrl){window.ZycordAndroid.downloadApkUpdate(downloadUrl);}else{location.reload();}"
                + "        bar.remove();"
                + "      };"
                + "      bar.appendChild(span);"
                + "      bar.appendChild(btn);"
                + "      (document.body||document.documentElement).appendChild(bar);"
                + "    }"
                + "    function checkAndroidUpdates(){"
                + "      fetch('/updates/android/latest.json?_t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(info){"
                + "        if(info&&info.versionCode&&Number(info.versionCode)>Number(currentCode)){"
                + "          showAndroidUpdateBanner('Zycord v'+info.version+' is available!',info.url||'/updates/android/Zycord.apk');"
                + "        }"
                + "      }).catch(function(){});"
                + "      var ch=(window.GLOBAL_ENV&&window.GLOBAL_ENV.RELEASE_CHANNEL)||'stable';"
                + "      fetch('/assets/version.'+ch+'.json?_t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(d){"
                + "        if(!d||!d.hash)return;"
                + "        if(!initialWebHash)initialWebHash=(window.GLOBAL_ENV&&window.GLOBAL_ENV.VERSION_HASH)||d.hash;"
                + "        else if(d.hash!==initialWebHash)showAndroidUpdateBanner('New Zycord update ready! Tap to refresh.',null);"
                + "      }).catch(function(){});"
                + "    }"
                + "    setTimeout(checkAndroidUpdates,12000);"
                + "    setInterval(checkAndroidUpdates,120000);"
                + "  }"
                + "}catch(e){}"
                + "})();";
        webView.evaluateJavascript(js, null);
    }

    private void hideSplashOverlay() {
        hasLoadedOnce = true;
        if (splashContainer.getVisibility() == View.GONE) return;
        mainHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                splashContainer.animate()
                        .alpha(0f)
                        .setDuration(260)
                        .withEndAction(new Runnable() {
                            @Override
                            public void run() {
                                splashContainer.setVisibility(View.GONE);
                            }
                        })
                        .start();
            }
        }, 250);
    }

    private void showOfflineState(String message) {
        splashContainer.setAlpha(1f);
        splashContainer.setVisibility(View.VISIBLE);
        loadingSpinner.setVisibility(View.GONE);
        statusLabel.setText(message);
        retryButton.setVisibility(View.VISIBLE);
    }

    private void loadTargetUrl(String url) {
        if (!isNetworkAvailable()) {
            showOfflineState("No internet connection. Please connect and tap Retry.");
            return;
        }
        webView.loadUrl(url);
    }

    private boolean isNetworkAvailable() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return true;
            NetworkInfo info = cm.getActiveNetworkInfo();
            return info != null && info.isConnected();
        } catch (Exception e) {
            return true;
        }
    }

    private String resolveIntentUrl(Intent intent) {
        if (intent != null && Intent.ACTION_VIEW.equals(intent.getAction())) {
            Uri data = intent.getData();
            if (data != null) {
                String scheme = data.getScheme() != null ? data.getScheme().toLowerCase() : "";
                if ("zycord".equals(scheme)) {
                    String path = data.getPath() != null && !data.getPath().isEmpty() ? data.getPath() : "/app";
                    return BASE_ORIGIN + path;
                }
                if (data.getHost() != null && data.getHost().toLowerCase().endsWith("zyron.site")) {
                    return data.toString();
                }
            }
        }
        return APP_URL;
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        String url = resolveIntentUrl(intent);
        if (webView != null && url != null) {
            webView.loadUrl(url);
        }
    }

    private void requestInitialPermissions() {
        if (Build.VERSION.SDK_INT >= 33) {
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, PERMISSIONS_REQUEST_CODE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSIONS_REQUEST_CODE && pendingWebPermissionRequest != null) {
            try {
                pendingWebPermissionRequest.grant(pendingWebPermissionRequest.getResources());
            } catch (Exception ignored) {
            }
            pendingWebPermissionRequest = null;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (filePathCallback == null) return;
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                if (data.getClipData() != null) {
                    ClipData clipData = data.getClipData();
                    results = new Uri[clipData.getItemCount()];
                    for (int i = 0; i < clipData.getItemCount(); i++) {
                        results[i] = clipData.getItemAt(i).getUri();
                    }
                } else if (data.getData() != null) {
                    results = new Uri[]{data.getData()};
                }
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView != null) {
            if (webView.canGoBack()) {
                webView.goBack();
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    NOTIFICATION_CHANNEL_ID,
                    "Zycord Messages",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Direct messages, mentions, and voice alerts from Zycord");
            channel.enableVibration(true);
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                nm.createNotificationChannel(channel);
            }
        }
    }

    public class ZycordAndroidBridge {

        @JavascriptInterface
        public void showNotification(String title, String body, String path) {
            try {
                NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm == null) return;

                Intent intent = new Intent(MainActivity.this, MainActivity.class);
                intent.setAction(Intent.ACTION_VIEW);
                String fullUrl = (path != null && path.startsWith("/")) ? (BASE_ORIGIN + path) : APP_URL;
                intent.setData(Uri.parse(fullUrl));
                intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);

                int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    flags |= PendingIntent.FLAG_IMMUTABLE;
                }
                PendingIntent pendingIntent = PendingIntent.getActivity(MainActivity.this, 0, intent, flags);

                Notification.Builder builder;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    builder = new Notification.Builder(MainActivity.this, NOTIFICATION_CHANNEL_ID);
                } else {
                    builder = new Notification.Builder(MainActivity.this);
                }

                builder.setSmallIcon(R.drawable.ic_notification)
                        .setContentTitle(title != null && !title.isEmpty() ? title : "Zycord")
                        .setContentText(body != null ? body : "")
                        .setAutoCancel(true)
                        .setContentIntent(pendingIntent);

                nm.notify(notificationCounter++, builder.build());
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public void copyToClipboard(String text) {
            try {
                ClipboardManager cb = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                if (cb != null) {
                    cb.setPrimaryClip(ClipData.newPlainText("Zycord", text != null ? text : ""));
                }
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public void shareText(String title, String text) {
            try {
                Intent sendIntent = new Intent(Intent.ACTION_SEND);
                sendIntent.setType("text/plain");
                sendIntent.putExtra(Intent.EXTRA_SUBJECT, title != null ? title : "Zycord");
                sendIntent.putExtra(Intent.EXTRA_TEXT, text != null ? text : APP_URL);
                startActivity(Intent.createChooser(sendIntent, "Share via"));
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public void vibrate(int durationMs) {
            try {
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null && v.hasVibrator()) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        v.vibrate(VibrationEffect.createOneShot(Math.max(10, durationMs), VibrationEffect.DEFAULT_AMPLITUDE));
                    } else {
                        v.vibrate(Math.max(10, durationMs));
                    }
                }
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public String getAppVersion() {
            return "1.0.11";
        }

        @JavascriptInterface
        public int getAppVersionCode() {
            return 11;
        }

        @JavascriptInterface
        public void downloadApkUpdate(String apkUrl) {
            try {
                String fullUrl = (apkUrl != null && apkUrl.startsWith("/")) ? (BASE_ORIGIN + apkUrl) : apkUrl;
                if (fullUrl == null || fullUrl.isEmpty()) {
                    fullUrl = BASE_ORIGIN + "/updates/android/Zycord.apk";
                }
                DownloadManager.Request req = new DownloadManager.Request(Uri.parse(fullUrl));
                req.setTitle("Zycord Update (Zycord.apk)");
                req.setDescription("Downloading latest Zycord update...");
                req.setMimeType("application/vnd.android.package-archive");
                req.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                req.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "Zycord.apk");
                DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                if (dm != null) {
                    dm.enqueue(req);
                    Toast.makeText(MainActivity.this, "Downloading Zycord update...", Toast.LENGTH_LONG).show();
                }
            } catch (Exception e) {
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(BASE_ORIGIN + "/download/android")));
                } catch (Exception ignored) {
                }
            }
        }
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
