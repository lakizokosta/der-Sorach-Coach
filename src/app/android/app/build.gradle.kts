plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
}

android {
    namespace = "de.lernziel.sprachcoach"
    compileSdk = 37

    defaultConfig {
        applicationId = "de.lernziel.sprachcoach"
        minSdk = 26
        targetSdk = 37
        versionCode = 1
        versionName = "0.1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    androidResources {
        // Question banks are large JSON files; keep them uncompressed for fast reads.
        noCompress += "json"
    }
}

// The question bank and legal pages live in src/site. Export them as assets with the
// same parser the website uses (scripts/export-android-assets.mjs). Requires Node.js.
val repoRoot = rootDir.resolve("../../..")
val exportAssets = tasks.register<Exec>("exportAssets") {
    description = "Exports questions, catalogue, hints, dictionary and legal pages from src/site into app assets."
    workingDir = repoRoot
    commandLine("node", "scripts/export-android-assets.mjs", file("src/main/assets").absolutePath)
    inputs.dir(repoRoot.resolve("src/site/questions"))
    inputs.dir(repoRoot.resolve("src/site/questions-vocab"))
    inputs.dir(repoRoot.resolve("src/site/utils"))
    inputs.dir(repoRoot.resolve("src/site/data"))
    inputs.file(repoRoot.resolve("docs/extra.md"))
    inputs.file(repoRoot.resolve("scripts/export-android-assets.mjs"))
    inputs.dir(repoRoot.resolve("scripts/lib"))
    outputs.dir("src/main/assets")
}
tasks.named("preBuild") { dependsOn(exportAssets) }

dependencies {
    implementation(platform(libs.compose.bom))
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.compose.foundation)
    implementation(libs.compose.material3)
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.kotlinx.serialization.json)
    debugImplementation(libs.compose.ui.tooling)

    testImplementation(libs.junit)
}
