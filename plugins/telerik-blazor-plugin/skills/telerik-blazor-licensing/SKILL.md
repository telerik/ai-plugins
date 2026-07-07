---
name: telerik-blazor-licensing
description: This skill describes how the Telerik license verification works in Blazor apps and how to set up the Telerik license key, so that Blazor apps build without license-related warnings, and there are no license-related banners and watermarks in the application UI at runtime. Use this skill when the user has questions or issues that are related to Telerik licensing, license keys, build-time license verification, runtime license verification, or license-related warnings and errors.
---

# Telerik Licensing

## When to use this skill

Use this skill when the user (Blazor developer) has questions or issues about the Telerik license verification and license keys:

* **Understanding**: what versions require a key, what happens without one, how verification works, when keys expire
* **Setup**: obtaining, installing, and updating the license key for local or CI/CD environments
* **Troubleshooting**: build warnings, TKL error codes, license banners, watermarks, permission denied when using the Telerik Agentic UI Generator

A more verbose list of the topics covered by this skill is below:

* Which Telerik UI for Blazor versions require a license key.
* How to obtain a Telerik license key.
* How to install a Telerik license key. When to use a license file and when to use an environment variable.
* Which environments require a Telerik license key.
* When to update the Telerik license key.
* When does a Telerik license key expire.
* What happens if a Telerik license key is not installed, not valid or is expired.
* How does Telerik license verification work in Blazor apps.
* How to troubleshoot Telerik license-related warnings and errors in the build log of Telerik Blazor apps.
* How to enable detailed build-time Telerik license diagnostics.
* How to fix Telerik license-related warnings and errors.
* What causes a "Permission Denied (No Valid License)" error when using the Telerik Agentic UI Generator and how to fix it.

## Response Guidelines

* This skill contains links to web pages in the Telerik UI for Blazor documentation (`telerik.com/blazor-ui/documentation/`). Check the "Where to find more information about Telerik UI for Blazor licensing" section at the end of this skill. Read the linked articles for additional or up-to-date information. Provide the links directly to the user when relevant.
* This skill contains links to the Telerik Account section (`telerik.com/account`). These links are only accessible to users who have a valid Telerik account and are logged in. Do not try to read these pages. Instead, provide the links directly to the user.
* Do not guess or fabricate license key values or file paths.

## Terminology

The Telerik **license key** is a string that holds encoded information about the Telerik user and their licenses. The **license file** (`telerik-license.txt`) is the file that contains the license key.

The **Agentic UI Generator** is an MCP-based AI coding assistant tool that generates Telerik UI for Blazor code based on user prompts.

## Which Telerik UI for Blazor versions require a license key

A Telerik license key is required for all Telerik UI for Blazor versions starting from 8.0.0 that was released in February 2025. A license key is not required by Telerik UI for Blazor 7.1.0 and earlier versions.

Telerik UI for Blazor version 8.x generate build-time warnings if a license key is not installed or not valid. Versions 9.x and later also show a license banner and watermarks in the application UI.

The information from the previous two paragraphs is summarized in the following table:

| Telerik UI for Blazor version range | Build warnings | UI banner & watermarks |
|-------------------------------------|----------------|------------------------|
| 7.1.0 and earlier                   | No             | No                     |
| 8.x                                 | Yes            | No                     |
| 9.x and later                       | Yes            | Yes                    |

## How to obtain a Telerik license key

The license file can be downloaded automatically from different Telerik tools or downloaded manually from the Telerik account page: https://www.telerik.com/account/your-licenses/license-keys

## How to install a Telerik license key

There are multiple different automated and manual ways to install a Telerik license key in one's development environment:

* Use the Progress Control Panel: https://docs.telerik.com/controlpanel/introduction
* Use the Telerik UI for Blazor's Visual Studio extension: https://www.telerik.com/blazor-ui/documentation/installation/vs-integration/introduction
* Use the Telerik UI for Blazor's VS Code extension: https://www.telerik.com/blazor-ui/documentation/installation/vs-code-integration/introduction
* Use the Telerik CLI: https://www.telerik.com/blazor-ui/documentation/installation/telerik-cli
* Download the license key from the Telerik website and install it manually: https://www.telerik.com/account/your-licenses/license-keys

### Personal development computers

On personal development computers, use a license file with name `telerik-license.txt` in the user's directory:

* `%AppData%\Telerik\telerik-license.txt` on Windows
* `~/.telerik/telerik-license.txt` on macOS or Linux

### CI/CD environments

On cloud-based CI/CD environments, use an environment variable. There are two options:

* Set a `TELERIK_LICENSE` environment variable that contains the license key itself.
* Set a `TELERIK_LICENSE_PATH` environment variable that contains the path to the license file, including the license file name itself.

### Windows Limitation

Do not use a `TELERIK_LICENSE` environment variable on Windows machines due to environment variable length limitations that truncate and corrupt the license key.

## Which environments require a Telerik license key

A Telerik license key is required on all local, on-premise, and cloud-based environments that perform the following actions on a Blazor app:

* Build the app with `dotnet build` or through Visual Studio.
* Run unit tests, unless the `dotnet test` command uses the `--no-build` option
* Publish the app, unless the `dotnet publish` command uses the `--no-build` option

A Telerik license key is not required on the production web server that hosts the already deployed live web application.

## When to update the Telerik license key

Update the Telerik license key when:

* Renewing or purchasing a new Telerik license
* Starting a new trial

Use any of the existing automatic or manual options for initial license key installation to update the license key.

## When does a Telerik license key expire

The Telerik license key expires at the end of the license period:

* For subscription licenses, this is at the end of the subscription period.
* For trial users, this is at the end of the 30-day trial.
* For perpetual licenses, the license key does not expire. Instead, it is only valid for the Telerik UI for Blazor versions that were released during the active license period.

## What happens if a Telerik license key is not installed, not valid or is expired

If a Telerik license key is not installed, not valid, or is expired, the following happens:

* The build log of the Blazor app shows license-related warnings and errors.
* The application UI shows a license banner and watermarks.

## How does Telerik license verification work in Blazor apps

A custom MSBuild task checks what Telerik products and versions are used in the app. The task locates and verifies that the Telerik license key is valid for the detected products and versions. The MSBuild task adds metadata with its findings to the application's assembly. The metadata is then checked at runtime. Both the build-time and runtime license verification are performed by the `Telerik.Licensing` assembly, which is referenced by Telerik UI for Blazor.

## How to troubleshoot Telerik license-related warnings and errors in the build log of Telerik Blazor apps

First, check the application build log for license-related warnings and errors. If there are none, chances are that Telerik UI for Blazor is not referenced in the application's startup project. In such cases, add a reference to the `Telerik.Licensing` NuGet package in the startup project.

## How to enable detailed build-time Telerik license diagnostics

To enable more verbose Telerik licensing diagnostics in the build log, add the following code to the startup project's `.csproj` file:

```XML
<PropertyGroup>
  <TelerikLicensingVerbosity>diagnostic</TelerikLicensingVerbosity>
</PropertyGroup>
```

## How to fix Telerik license-related warnings and errors

The following subheadings list the possible build-time license-related warnings and errors, along with their meaning and how to fix them. Use the following table to map the error code to the subheading and detailed information:

### Error Code Quick Reference

| Code   | Short Description                                                |
|--------|------------------------------------------------------------------|
| TKL001 | No Telerik or Kendo UI product references detected in project    |
| TKL002 | No Telerik and Kendo UI License file found                       |
| TKL003 | Corrupted Telerik and Kendo UI License Key content               |
| TKL004 | Unable to locate licenses for all products                       |
| TKL101 | Telerik UI for Blazor is not listed in your current license file |
| TKL102 | Your current license has expired (version too new)               |
| TKL103 | Your subscription has expired                                    |
| TKL104 | Your subscription has expired                                    |
| TKL105 | Your trial expired                                               |

### No Telerik or Kendo UI product references detected in project (TKL001)

This error can occur when a project references `Telerik.Licensing`, but not any other Telerik packages. In this case, remove the `Telerik.Licensing` package from the project. If your scenario is different, contact Technical Support at https://www.telerik.com/account/support-center.

### No Telerik and Kendo UI License file found (TKL002)

The error means that the license key is missing or not set up correctly. For example, the environment variable is not set or the license file may be at the wrong place. The error can also occur if the environment variable or license file exists, but it is empty.

Try installing the license key again.

### Corrupted Telerik and Kendo UI License Key content (TKL003)

The license key is detected, but its value is invalid and cannot be decrypted. For example:

* The `TELERIK_LICENSE` environment variable has the license file location as its value. In such cases, set the license key itself as the variable value. Alternatively, remove `TELERIK_LICENSE` and use the `TELERIK_LICENSE_PATH` environment variable instead.
* The `TELERIK_LICENSE` environment variable was set through the Windows operating system's UI and the license key was truncated due to Windows limitations. In such cases, remove the environment variable and use a license key file instead.

Install the license key again.

### Unable to locate licenses for all products (TKL004)

Your license is not valid for the detected product(s), because it doesn't include them.

Review the purchase options for Telerik UI for Blazor at https://www.telerik.com/purchase/blazor-ui. If you have already purchased the required license, then update your license key.

### Telerik UI for Blazor is not listed in your current license file (TKL101)

Your license key does not include Telerik UI for Blazor.

Review the purchase options for Telerik UI for Blazor at https://www.telerik.com/purchase/blazor-ui. If you have already purchased the required license, then update your license key.

### Your current license has expired (TKL102)

This error applies to perpetual licenses. It means that you are using a product version released outside the validity period of your license. To remove the error message, do either of the following:

* Renew your license at https://www.telerik.com/account/your-licenses and then  update your license key.
* Use a Telerik UI for Blazor version that was released within the active period of your perpetual license.

### Your subscription has expired (TKL103, TKL104)

This error applies to Subscription licenses. Renew your subscription at https://www.telerik.com/account/your-licenses and then update your license key.

### Your trial expired (TKL105)

Purchase a commercial license to continue using Telerik UI for Blazor at https://www.telerik.com/purchase/blazor-ui.

## No Valid License Error when using the Telerik Agentic UI Generator

The Telerik Agentic UI Generator (MCP server) may exit unexpectedly with the following error:

`gRPC error in ValidateUserLicenseAsync: PermissionDenied - no valid license found for the requested product`

The error means one of the following:

* The user has a legacy Perpetual license, while the Telerik AI tools require a Subscription license. Telerik Subscription licenses were introduced in 2025 and they explicitly contain the word "Subscription" in their name, for example, DevCraft Complete Subscription. An automatically renewing license is not necessarily a Subscription license.
* The user's Telerik UI for Blazor Subscription license has expired.
* The user's Telerik UI for Blazor trial or Agentic UI Generator trial has expired.
* The Telerik license key on the user's computer needs updating.

Depending on the root cause, the possible solutions are:

* The user needs to request their Perpetual license to be converted to a Subscription license at https://www.telerik.com/account/support-center/contact-us/account-support
* The user needs to purchase a Telerik UI for Blazor Subscription license at https://www.telerik.com/purchase/blazor-ui.
* The user needs to update their license key, according to the instructions at https://www.telerik.com/blazor-ui/documentation/installation/license-key#license-key-updates

## Common Scenarios

* "I just upgraded to version 8.x and now I get warnings": A license key is now required. Follow the installation steps for personal computers or CI/CD.
* "My app builds and works locally but fails or shows a license banner and watermarks in CI/CD": Set the `TELERIK_LICENSE` environment variable or use `TELERIK_LICENSE_PATH`.
* "I set `TELERIK_LICENSE` on Windows but still get TKL003": Windows truncates the value. Remove the environment variable and use a license file or a `TELERIK_LICENSE_PATH` environment variable instead.
* "I don't get build-time license warnings but there is a license banner in the app UI": Add the `Telerik.Licensing` NuGet package to the startup project.
* "I get a 'gRPC error in ValidateUserLicenseAsync: PermissionDenied - no valid license found for the requested product' error when trying to use the Telerik Agentic UI Generator": The error is caused by an invalid or expired license, or an outdated license key. The Telerik Agentic UI Generator requires an active Subscription license. Check the license requirements at https://www.telerik.com/blazor-ui/documentation/ai/agentic-ui-generator/overview#license-requirements.

## Where to find more information about Telerik UI for Blazor licensing

There are three documentation pages, which describe all aspects of Telerik licensing in Blazor apps. Read these pages and provide the links to the user if they are relevant to their question or issue:

* https://www.telerik.com/blazor-ui/documentation/installation/license-key - contains information about Telerik license key fundamentals, installation, updating and frequently asked questions.
* https://www.telerik.com/blazor-ui/documentation/deployment/ci-cd-license-key - contains information about how to set up a Telerik license key in CI/CD environments such as Azure Pipelines, Azure DevOps, GitHub Actions, Docker.
* https://www.telerik.com/blazor-ui/documentation/troubleshooting/license-key-errors - contains information about troubleshooting of Telerik license key warnings and errors, and how to enable detailed build-time Telerik license diagnostics.
* https://www.telerik.com/blazor-ui/documentation/ai/agentic-ui-generator/overview#license-requirements - contains information about license requirements for the Telerik Agentic UI Generator, which is a tool that generates Telerik UI for Blazor code based on user prompts.
* https://www.telerik.com/blazor-ui/documentation/ai/agentic-ui-generator/troubleshooting - contains information about troubleshooting a Permission Denied error with the Telerik Agentic UI Generator.
