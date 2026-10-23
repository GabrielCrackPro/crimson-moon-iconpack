plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

// Release signing material is injected by CI (see .github/workflows/release.yml).
// Local debug builds never need it.
val keystorePath: String? = System.getenv("CM_KEYSTORE_PATH")
val keystorePassword: String? = System.getenv("CM_KEYSTORE_PASSWORD")
val keyAliasValue: String? = System.getenv("CM_KEY_ALIAS")
val keyPasswordValue: String? = System.getenv("CM_KEY_PASSWORD")

val ciVersionName: String? = (findProperty("appVersionName") as String?)
val ciVersionCode: Int? = (findProperty("appVersionCode") as String?)?.toIntOrNull()

android {
    namespace = "com.crimsonmoon.iconpack"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.crimsonmoon.iconpack"
        minSdk = 23
        targetSdk = 35
        versionCode = ciVersionCode ?: 1
        versionName = ciVersionName ?: "1.0"
    }

    signingConfigs {
        if (keystorePath != null) {
            create("release") {
                storeFile = file(keystorePath)
                storePassword = keystorePassword
                keyAlias = keyAliasValue
                keyPassword = keyPasswordValue
                enableV1Signing = true
                enableV2Signing = true
                enableV3Signing = true
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.findByName("release")
            if (signingConfig == null) {
                logger.warn("No CM_KEYSTORE_PATH set: assembleRelease will produce an unsigned APK.")
            }
        }
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-compose:1.9.3")

    // One BOM pins every compose artifact to a tested set.
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    // The handful of glyphs the screen needs (search, share, check…) without
    // pulling in material-icons-extended; the two icons core lacks live in
    // CrimsonIcons.kt as hand-written ImageVectors.
    implementation("androidx.compose.material:material-icons-core")
}
