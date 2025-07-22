# OTA Updates Guide for CamPricer

## Overview
Your app is now fully configured for Over-the-Air (OTA) updates using EAS Updates. This allows you to push JavaScript/React Native code changes instantly to users without going through the App Store review process.

## Current Configuration

### app.json
- ✅ Runtime version policy: `appVersion` (updates tied to app version)
- ✅ Updates enabled: `true`
- ✅ Project ID configured: `11db3343-3f4b-44fc-b0b2-19a68ff735a0`
- ✅ Updates URL configured

### eas.json
- ✅ Production channel: `production`
- ✅ Staging channel: `staging` (for testing updates)
- ✅ Preview channel: available for internal testing

## How OTA Updates Work

### Automatic Updates
- App checks for updates on startup (after fonts load)
- Only works in production builds (not development)
- Downloads and installs updates automatically
- Restarts app to apply updates

### Update Channels
- **Production**: Live app store users get these updates
- **Staging**: Internal testing before production
- **Preview**: Development testing

## Publishing Updates

### 1. Production Update (Live Users)
```bash
npm run update:production "Fix camera search bug"
# OR
eas update --branch production --message "Fix camera search bug"
```

### 2. Staging Update (Testing)
```bash
npm run update:staging "Test new search feature"
# OR  
eas update --branch staging --message "Test new search feature"
```

### 3. Preview Update (Development)
```bash
npm run update:preview "Test experimental feature"
# OR
eas update --branch preview --message "Test experimental feature"
```

## What Can Be Updated OTA

✅ **Can Update**:
- JavaScript code changes
- React Native component updates
- New features in existing screens
- Bug fixes
- Styling changes
- API endpoint changes
- New npm packages (JS only)

❌ **Cannot Update** (Requires New Build):
- Native dependencies (native modules)
- App permissions
- App icon changes
- Splash screen changes
- Native configuration changes
- Expo SDK major version upgrades

## Update Workflow

### Development → Production
1. **Test locally**: `npm run ios` / `npm run android`
2. **Deploy to staging**: `npm run update:staging "Description"`
3. **Test staging build**: Install internal build, verify update works
4. **Deploy to production**: `npm run update:production "Description"`
5. **Monitor**: Check logs for update adoption

### Emergency Fixes
For critical bugs in production:
```bash
# Quick fix and immediate deployment
git add .
git commit -m "Critical fix: resolve crash on camera search"
npm run update:production "Critical fix: resolve crash on camera search"
```

## Monitoring Updates

### Check Update Status
```bash
# View recent updates
eas update:list --branch production

# View specific update
eas update:view [update-id]
```

### Update Analytics
- Updates are tracked in EAS dashboard
- Monitor adoption rates
- Track rollback if needed

## Version Management

### Current Setup
- **App Version**: 1.1.3 (in app.json)
- **Runtime Version**: Tied to app version
- **Build Numbers**: Auto-increment on builds

### When Runtime Version Changes
If you change the app version (1.1.3 → 1.2.0), existing users won't receive OTA updates until they update via App Store. This ensures compatibility.

## Testing Updates

### Internal Testing Device Setup
1. Install internal build with staging channel
2. Test updates on staging before production
3. Use different test devices for iOS/Android

### Rollback Strategy
If an update causes issues:
```bash
# Create rollback update
npm run update:production "Rollback to previous version"
```

## Best Practices

### Update Messages
- Be descriptive: "Fix camera search crash on iPhone SE"
- Include ticket numbers: "CMP-123: Add dark mode support"
- Use consistent format

### Update Timing
- Deploy production updates during low usage hours
- Test thoroughly on staging first
- Monitor app performance after updates

### Code Organization
- Keep OTA-updateable code separate from native code
- Document breaking changes
- Use feature flags for gradual rollouts

## Troubleshooting

### Common Issues

**Updates not appearing**:
- Check if app is in development mode (`__DEV__ = true`)
- Verify runtime version compatibility
- Check network connectivity

**Update fails to download**:
- Check update size (keep under 50MB)
- Verify EAS project configuration
- Check device storage space

**App crashes after update**:
- Test update on staging first
- Check for breaking changes in dependencies
- Rollback immediately if needed

### Debug Commands
```bash
# Check current update status
expo install expo-updates
expo updates:configure

# View update logs
eas update:list --branch production --limit 10
```

## Quick Reference

### Daily Commands
```bash
# Deploy bug fix
npm run update:production "Fix: Camera upload timeout"

# Deploy new feature  
npm run update:production "Feature: Add camera model suggestions"

# Check recent updates
eas update:list --branch production
```

### Emergency Commands
```bash
# Immediate critical fix
npm run update:production "CRITICAL: Fix app crash on startup"

# Rollback (create new update that reverts changes)
git revert [commit-hash]
npm run update:production "Rollback: Revert problematic changes"
```

Your OTA update system is now fully configured and ready for use! 🚀