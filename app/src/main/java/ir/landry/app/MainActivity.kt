package ir.landry.app

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader

/**
 * «لندری من» — پوسته اندروید برای وب‌اپ مستقل آفلاین
 * داده‌ها در localStorage خود WebView ذخیره می‌شود (روی حافظه گوشی).
 * از WebViewAssetLoader استفاده شده تا origin به شکل https باشد
 * و localStorage/فونت‌ها به‌طور پایدار کار کنند.
 */
class MainActivity : Activity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            cacheMode = WebSettings.LOAD_DEFAULT
            textZoom = 100
            mediaPlaybackRequiresUserGesture = true
        }
        webView.setBackgroundColor(0xFFF8FAFC.toInt())

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                return handleExternalUrl(request.url)
            }
        }

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            webView.loadUrl("https://appassets.androidplatform.net/assets/www/index.html")
        }
    }

    /** لینک تماس (tel:) و پیامک را به اپلیکیشن خود گوشی می‌سپارد */
    private fun handleExternalUrl(url: Uri): Boolean {
        val scheme = url.scheme ?: return false
        return when (scheme) {
            "tel" -> {
                startActivity(Intent(Intent.ACTION_DIAL, url))
                true
            }
            "sms", "mailto" -> {
                startActivity(Intent(Intent.ACTION_VIEW, url))
                true
            }
            else -> false
        }
    }

    override fun onBackPressed() {
        if (this::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        if (this::webView.isInitialized) webView.saveState(outState)
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        }
    }
}
