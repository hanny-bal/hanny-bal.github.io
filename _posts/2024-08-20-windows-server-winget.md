---
layout: post
title: "Automatic software updates for Windows Server 2019 using winget"
excerpt: "You can't always choose the server infrastracture you have to manage. But you can at least try to make the best out of it. A guide on how to install and use winget on Windows Server 2019."
minutes: 2
seo_title: "How to install and use winget on Windows Server 2019 for automatic software updates"
seo_description: "A tep-by-step guide to manually install winget on Windows Server 2019 and use it to automate software updates via PowerShell. Improve your server security and reduce manual maintenance!"
---

During my project work at the University, I was faced with having to manage four servers running Windows Server 2019, all crammed with software that needed to be run. The challenge: **All of the installed programs must always be up-to-date**. Otherwise, one would risk security issues or a not so kind email from the IT department. This meant
- either to manually update every single piece of software on each of those servers in regular intervals, resulting in an absurd time committent or
- to figure out a better way.

Save to say, I figured out a better way. 

Since the relase of Windows 10, I was always a fan of the [winget](https://github.com/microsoft/winget-cli){:target="_blank"} package manager. It integrates seamlessly and allows for the easy installation of almost every imaginable program. It also recognises installed software and allows for easy updates. 

However, winget is not compatible with Windows Server 2019 by default. But with a few hacks, it is still possible to install it manually.

## Installing winget on Windows Server 2019
To install winget on server running Windows Server 2019, run the following commands sequentially.

```powershell
# Install VCLibs 
Add-AppxPackage 'https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx'

# Install Microsoft.UI.Xaml.2.8.6 from NuGet 
Invoke-WebRequest -Uri https://www.nuget.org/api/v2/package/Microsoft.UI.Xaml/2.8.6 -OutFile .\microsoft.ui.xaml.2.8.6.zip 
Expand-Archive .\microsoft.ui.xaml.2.8.6.zip 
Add-AppxPackage .\microsoft.ui.xaml.2.8.6\tools\AppX\x64\Release\Microsoft.UI.Xaml.2.8.appx 
 
# Install the latest release of Microsoft.DesktopInstaller from GitHub 
Invoke-WebRequest -Uri https://github.com/microsoft/winget-cli/releases/latest/download/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle -OutFile .\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle 
Add-AppxPackage .\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle 
```

Subsequently, the permissions to the installed Microsoft.DesktopInstaller must be updated as well.

```powershell
TAKEOWN /F "C:\Program Files\WindowsApps\Microsoft.DesktopAppInstaller_1.22.11261.0_x64__8wekyb3d8bbwe" /R /A /D Y 
ICACLS "C:\Program Files\WindowsApps\Microsoft.DesktopAppInstaller_1.22.11261.0_x64__8wekyb3d8bbwe" /grant Administrators:F /T 
```

Now winget is installed. To use it, however, a few extra steps must be taken.

## Using winget on Windows Server 2019
To use the installed package manager, open up a Powershell instance as administrator. Subsequently, run the following command to add winget to the path variable.

```powershell
$ResolveWingetPath = Resolve-Path "C:\Program Files\WindowsApps\Microsoft.DesktopAppInstaller_*_x64__8wekyb3d8bbwe" 
    if ($ResolveWingetPath){ 
           $WingetPath = $ResolveWingetPath[-1].Path 
    } 
$ENV:PATH += ";$WingetPath" 
```

**This needs to be done every time you open up a new Powershell instance.** The `winget` command should work as intended now.

To update all of the installed software, you can now simply run:
```powershell
winget upgrade --all 
```

That's it. This process needs to be repeated every time you want to update the installed software. Not perfect, but much better than updating it all manually. Potentially, it is possible to set up a tool such as [Winget-AutoUpdate](https://github.com/Romanitho/Winget-AutoUpdate){:target="_blank"} or write a custom script to run updates automatically in set time intervals. Personally, however, I wanted to be in control about software updates to not unintentionally break things.

Cheers!
David