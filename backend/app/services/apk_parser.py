"""APK metadata extraction service using androguard."""

import tempfile
import os
from typing import Optional
from pathlib import Path

from app.models.schemas import APKMetadata


class APKParser:
    """Parses APK files to extract metadata."""
    
    # Common permission descriptions for building context
    PERMISSION_CATEGORIES = {
        "android.permission.INTERNET": "Network access",
        "android.permission.ACCESS_FINE_LOCATION": "Precise location",
        "android.permission.ACCESS_COARSE_LOCATION": "Approximate location",
        "android.permission.CAMERA": "Camera access",
        "android.permission.READ_CONTACTS": "Contacts access",
        "android.permission.WRITE_CONTACTS": "Modify contacts",
        "android.permission.READ_SMS": "Read SMS messages",
        "android.permission.SEND_SMS": "Send SMS messages",
        "android.permission.READ_PHONE_STATE": "Phone state/identity",
        "android.permission.RECORD_AUDIO": "Microphone access",
        "android.permission.READ_EXTERNAL_STORAGE": "Read storage",
        "android.permission.WRITE_EXTERNAL_STORAGE": "Write storage",
        "android.permission.USE_BIOMETRIC": "Biometric authentication",
        "android.permission.USE_FINGERPRINT": "Fingerprint authentication",
        "android.permission.RECEIVE_BOOT_COMPLETED": "Start at boot",
        "android.permission.VIBRATE": "Vibration",
        "android.permission.WAKE_LOCK": "Prevent sleep",
        "android.permission.NFC": "NFC access",
        "android.permission.BLUETOOTH": "Bluetooth access",
        "android.permission.ACCESS_WIFI_STATE": "WiFi state",
        "android.permission.CHANGE_WIFI_STATE": "Modify WiFi",
    }
    
    @staticmethod
    async def parse_apk(apk_content: bytes, filename: str = "app.apk") -> APKMetadata:
        """Parse an APK file and extract metadata.
        
        Args:
            apk_content: Raw bytes of the APK file
            filename: Original filename (for reference)
            
        Returns:
            APKMetadata with extracted information
        """
        # Write to temporary file for androguard
        with tempfile.NamedTemporaryFile(suffix=".apk", delete=False) as tmp:
            tmp.write(apk_content)
            tmp_path = tmp.name
        
        try:
            # Import androguard here to handle cases where it's not installed
            from androguard.core.apk import APK
            
            apk = APK(tmp_path)
            
            # Extract basic info
            app_name = apk.get_app_name() or Path(filename).stem
            package_name = apk.get_package() or "unknown"
            version_name = apk.get_androidversion_name()
            version_code = apk.get_androidversion_code()
            
            # SDK versions
            min_sdk = apk.get_min_sdk_version()
            target_sdk = apk.get_target_sdk_version()
            
            # Permissions
            permissions = list(apk.get_permissions())
            
            # Components
            activities = list(apk.get_activities())
            services = list(apk.get_services())
            receivers = list(apk.get_receivers())
            providers = list(apk.get_providers())
            
            return APKMetadata(
                app_name=app_name,
                package_name=package_name,
                version_name=version_name,
                version_code=int(version_code) if version_code else None,
                min_sdk=int(min_sdk) if min_sdk else None,
                target_sdk=int(target_sdk) if target_sdk else None,
                permissions=permissions,
                activities=activities,
                services=services,
                receivers=receivers,
                providers=providers
            )
            
        finally:
            # Clean up temp file
            os.unlink(tmp_path)
    
    @staticmethod
    def metadata_to_description(metadata: APKMetadata) -> str:
        """Convert APK metadata to a description string for analysis.
        
        Args:
            metadata: Extracted APK metadata
            
        Returns:
            Human-readable description suitable for the prompt chain
        """
        lines = []
        
        # Basic info
        lines.append(f"Android application: {metadata.app_name}")
        lines.append(f"Package: {metadata.package_name}")
        
        if metadata.version_name:
            lines.append(f"Version: {metadata.version_name}")
        
        if metadata.target_sdk:
            lines.append(f"Target SDK: {metadata.target_sdk} (Android {APKParser._sdk_to_android_version(metadata.target_sdk)})")
        
        # Permissions analysis
        if metadata.permissions:
            lines.append("\nRequested Permissions:")
            
            # Group by category
            sensitive_perms = []
            for perm in metadata.permissions:
                # Get short name
                short_name = perm.replace("android.permission.", "")
                category = APKParser.PERMISSION_CATEGORIES.get(perm)
                
                if category:
                    sensitive_perms.append(f"- {short_name}: {category}")
                else:
                    sensitive_perms.append(f"- {short_name}")
            
            lines.extend(sensitive_perms[:20])  # Limit to top 20
            
            if len(metadata.permissions) > 20:
                lines.append(f"  ... and {len(metadata.permissions) - 20} more permissions")
        
        # Components indicate functionality
        lines.append("\nApp Components:")
        lines.append(f"- Activities (screens): {len(metadata.activities)}")
        lines.append(f"- Services (background): {len(metadata.services)}")
        lines.append(f"- Broadcast Receivers: {len(metadata.receivers)}")
        lines.append(f"- Content Providers: {len(metadata.providers)}")
        
        # Infer capabilities from permissions
        capabilities = APKParser._infer_capabilities_from_permissions(metadata.permissions)
        if capabilities:
            lines.append("\nInferred Capabilities (from permissions):")
            for cap in capabilities:
                lines.append(f"- {cap}")
        
        return "\n".join(lines)
    
    @staticmethod
    def _sdk_to_android_version(sdk: int) -> str:
        """Convert SDK level to Android version string."""
        sdk_map = {
            21: "5.0 Lollipop",
            22: "5.1 Lollipop",
            23: "6.0 Marshmallow",
            24: "7.0 Nougat",
            25: "7.1 Nougat",
            26: "8.0 Oreo",
            27: "8.1 Oreo",
            28: "9.0 Pie",
            29: "10",
            30: "11",
            31: "12",
            32: "12L",
            33: "13",
            34: "14",
        }
        return sdk_map.get(sdk, f"API {sdk}")
    
    @staticmethod
    def _infer_capabilities_from_permissions(permissions: list[str]) -> list[str]:
        """Infer high-level capabilities from permission list."""
        capabilities = []
        perm_set = set(permissions)
        
        # Network/API communication
        if "android.permission.INTERNET" in perm_set:
            capabilities.append("Network communication / API calls")
        
        # Location tracking
        if any("LOCATION" in p for p in perm_set):
            capabilities.append("Location tracking / Geofencing")
        
        # Camera/Media
        if "android.permission.CAMERA" in perm_set:
            capabilities.append("Camera capture (possibly document scanning, check deposits)")
        
        # Biometrics
        if any("BIOMETRIC" in p or "FINGERPRINT" in p for p in perm_set):
            capabilities.append("Biometric authentication")
        
        # Storage
        if any("STORAGE" in p for p in perm_set):
            capabilities.append("File/data storage access")
        
        # SMS (often used for OTP)
        if any("SMS" in p for p in perm_set):
            capabilities.append("SMS access (possibly OTP/2FA)")
        
        # Contacts
        if any("CONTACTS" in p for p in perm_set):
            capabilities.append("Contacts access")
        
        # Phone identity
        if "android.permission.READ_PHONE_STATE" in perm_set:
            capabilities.append("Device identification")
        
        # Background operation
        if "android.permission.RECEIVE_BOOT_COMPLETED" in perm_set:
            capabilities.append("Background/startup operation")
        
        # NFC
        if "android.permission.NFC" in perm_set:
            capabilities.append("NFC communication (possibly payments)")
        
        return capabilities
