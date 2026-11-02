package de.lernziel.sprachcoach.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.R

/** Palette from `src/site/styles/main.css`. */
object Palette {
    val Purple = Color(0xFFAB4DBB)
    val PurpleDark = Color(0xFF7B2D8B)
    val PurpleTint = Color(0xFFF6E3F8)
    val Cream = Color(0xFFF5F6CF)
    val Card = Color(0xFFFFFFFF)
    val Answer = Color(0xFFF2F2F2)
    val Border = Color(0xFFCCCCCC)
    val Green = Color(0xFF4CAF50)
    val GreenDark = Color(0xFF2E7D32)
    val Red = Color(0xFFED4545)
    val Revealed = Color(0xFFFFF59D)
    val Muted = Color(0xFF777777)
    val Text = Color(0xFF1A1A1A)
}

@Composable
fun SprachCoachTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = Palette.Purple,
            onPrimary = Color.White,
            background = Palette.Cream,
            surface = Palette.Cream,
            onBackground = Palette.Text,
            onSurface = Palette.Text,
        ),
        content = content,
    )
}

@Composable
fun LzdLogo(size: Dp, modifier: Modifier = Modifier) {
    Image(
        painter = painterResource(R.drawable.lzd_logo),
        contentDescription = "LZD",
        modifier = modifier.size(size),
    )
}

/** Filled purple pill, used for primary actions. */
@Composable
fun PrimaryButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier,
        shape = RoundedCornerShape(24.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Palette.Purple),
        contentPadding = PaddingValues(horizontal = 22.dp, vertical = 12.dp),
    ) {
        Text(text, fontWeight = FontWeight.Bold)
    }
}

/** White outlined pill, used for secondary actions. */
@Composable
fun SecondaryButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true) {
    OutlinedButton(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier,
        shape = RoundedCornerShape(24.dp),
        border = BorderStroke(1.dp, Palette.Border),
        colors = ButtonDefaults.outlinedButtonColors(containerColor = Palette.Card, contentColor = Palette.Text),
        contentPadding = PaddingValues(horizontal = 18.dp, vertical = 12.dp),
    ) {
        Text(text, fontWeight = FontWeight.Bold)
    }
}

/** Simple rounded progress bar (Material's indicator draws extra stop/gap marks). */
@Composable
fun SegmentedProgress(fraction: Float, color: Color, modifier: Modifier = Modifier) {
    Box(modifier.clip(RoundedCornerShape(50)).background(Color(0xFFDDDDDD))) {
        Box(Modifier.fillMaxHeight().fillMaxWidth(fraction.coerceIn(0f, 1f)).background(color))
    }
}

/** CEFR level pill (A1 … B2); [highlighted] fills it purple. */
@Composable
fun LevelPill(level: String, highlighted: Boolean = false) {
    Text(
        level,
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        color = if (highlighted) Color.White else Palette.PurpleDark,
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(if (highlighted) Palette.Purple else Palette.PurpleTint)
            .border(1.dp, Palette.Purple, RoundedCornerShape(12.dp))
            .padding(horizontal = 10.dp, vertical = 3.dp),
    )
}
