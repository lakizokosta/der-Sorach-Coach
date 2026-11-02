package de.lernziel.sprachcoach.ui

import android.content.Intent
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import de.lernziel.sprachcoach.R

/** AGB / Datenschutz / Impressum (spec 05-legal), rendered from the exported HTML. */
@Composable
fun LegalScreen(
    slug: String,
    loadHtml: (String) -> String,
    onSelect: (String) -> Unit,
    onBack: () -> Unit,
) {
    Column(Modifier.fillMaxSize().safeDrawingPadding().padding(horizontal = 16.dp, vertical = 8.dp)) {
        Text(
            stringResource(R.string.trainer_back),
            color = Palette.Purple,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.clickable(role = Role.Button, onClick = onBack).padding(vertical = 8.dp),
        )
        Row(
            Modifier.fillMaxWidth().padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp, androidx.compose.ui.Alignment.CenterHorizontally),
        ) {
            LEGAL_PAGES.forEach { (s, label) ->
                val active = s == slug
                Text(
                    stringResource(label),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (active) Palette.PurpleDark else Palette.Muted,
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (active) Palette.PurpleTint else Palette.Card)
                        .border(1.dp, if (active) Palette.Purple else Palette.Border, RoundedCornerShape(16.dp))
                        .clickable(role = Role.Tab) { if (!active) onSelect(s) }
                        .padding(horizontal = 14.dp, vertical = 6.dp),
                )
            }
        }
        Spacer(Modifier.height(4.dp))
        LegalHtml(html = loadHtml(slug), modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(16.dp)))
    }
}

@Composable
private fun LegalHtml(html: String, modifier: Modifier) {
    val page = """
        <html><head><meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a;
                 margin: 0; padding: 18px; background: #fff; overflow-wrap: anywhere; }
          h1 { font-size: 22px; } h2, h3 { color: #AB4DBB; font-size: 18px; }
          a { color: #AB4DBB; }
        </style></head><body>$html</body></html>
    """.trimIndent()
    AndroidView(
        modifier = modifier,
        factory = { context ->
            WebView(context).apply {
                webViewClient = object : WebViewClient() {
                    // Links (mail, website) open outside the app.
                    override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                        runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, request.url)) }
                        return true
                    }
                }
            }
        },
        update = { it.loadDataWithBaseURL(null, page, "text/html", "UTF-8", null) },
    )
}
