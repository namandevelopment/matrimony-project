# ==============================================================================
# ProGuard & R8 Optimization Rules
# Sindhi Matrimony Application
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. GENERAL OPTIMIZATIONS & SUPPRESSIONS
# ------------------------------------------------------------------------------
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose

# Optimization passes for R8
-repackageclasses
-allowaccessmodification

# Keep line numbers and source files for readable stack traces in crash reporting
-keepattributes SourceFile,LineNumberTable,*Annotation*,Signature,EnclosingMethod,InnerClasses

# ------------------------------------------------------------------------------
# 2. REACT NATIVE CORE & HERMES ENGINE
# ------------------------------------------------------------------------------
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

# Do not strip any method or class annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}

-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.HybridData { *; }

# Keep React Native Turbomodules and Fabric components
-keep interface com.facebook.react.bridge.JavaScriptModule { *; }
-keep interface com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class * extends com.facebook.react.bridge.NativeModule {
    <init>(...);
    public <methods>;
}
-keep class * extends com.facebook.react.uimanager.ViewManager {
    <init>(...);
    public <methods>;
}

# ------------------------------------------------------------------------------
# 3. REACT NATIVE REANIMATED & WORKLETS
# ------------------------------------------------------------------------------
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.worklets.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# ------------------------------------------------------------------------------
# 4. REACT NATIVE GESTURE HANDLER & SCREENS
# ------------------------------------------------------------------------------
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.rnscreens.** { *; }

# ------------------------------------------------------------------------------
# 5. REACT NATIVE SVG
# ------------------------------------------------------------------------------
-keep class com.horcrux.svg.** { *; }

# ------------------------------------------------------------------------------
# 6. REACT NATIVE FAST IMAGE (GLIDE)
# ------------------------------------------------------------------------------
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule {
    <init>(...);
}
-keep public enum com.bumptech.glide.load.resource.bitmap.ImageHeaderParser$** {
    **[] $VALUES;
    public *;
}
-keep class com.dylanvann.fastimage.** { *; }

# ------------------------------------------------------------------------------
# 7. LOTTIE REACT NATIVE
# ------------------------------------------------------------------------------
-keep class com.airbnb.lottie.** { *; }

# ------------------------------------------------------------------------------
# 8. MMKV & ASYNC STORAGE
# ------------------------------------------------------------------------------
-keep class com.tencent.mmkv.** { *; }
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# ------------------------------------------------------------------------------
# 9. NITRO MODULES & VISION CAMERA
# ------------------------------------------------------------------------------
-keep class com.margelo.nitro.** { *; }
-keep class com.mrousavy.camera.** { *; }

# ------------------------------------------------------------------------------
# 10. REACT NATIVE IMAGE CROP PICKER & DATE PICKER
# ------------------------------------------------------------------------------
-keep class com.reactnative.ivpusic.imagepicker.** { *; }
-keep class com.henninghall.date_picker.** { *; }
-keep class com.reactcommunity.rndatetimepicker.** { *; }

# ------------------------------------------------------------------------------
# 11. NOTIFEE NOTIFICATIONS
# ------------------------------------------------------------------------------
-keep class app.notifee.core.** { *; }
-keep class app.notifee.core.model.** { *; }
-keepclassmembers class app.notifee.core.** { *; }

# ------------------------------------------------------------------------------
# 12. FIREBASE APP & FIREBASE MESSAGING
# ------------------------------------------------------------------------------
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod

-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ------------------------------------------------------------------------------
# 13. OKHTTP & OKIO NETWORK STACK
# ------------------------------------------------------------------------------
-dontwarn okhttp3.**
-dontwarn okio.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
-dontwarn javax.annotation.**

# ------------------------------------------------------------------------------
# 14. VECTOR ICONS
# ------------------------------------------------------------------------------
-keep class com.oblador.vectoricons.** { *; }
