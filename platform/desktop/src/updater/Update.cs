using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;

namespace ZycordUpdater
{
    class Program
    {
        private const string UPDATE_MANIFEST_URL = "https://app.zyron.site/updates/windows/latest.yml";
        private const string UPDATE_INSTALLER_URL = "https://app.zyron.site/updates/windows/ZycordSetup.exe";

        static void Main(string[] args)
        {
            try
            {
                // Force TLS 1.2
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;

                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string targetExe = "Zycord.exe";

                for (int i = 0; i < args.Length; i++)
                {
                    if (args[i].Equals("--processStart", StringComparison.OrdinalIgnoreCase) && i + 1 < args.Length)
                    {
                        targetExe = args[i + 1];
                    }
                }

                string fullTargetPath = Path.Combine(baseDir, targetExe);

                // Quick update check with 4-second timeout
                CheckAndApplyUpdate(fullTargetPath);

                // Launch main executable
                if (File.Exists(fullTargetPath))
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = fullTargetPath,
                        WorkingDirectory = baseDir,
                        UseShellExecute = true
                    });
                }
            }
            catch (Exception ex)
            {
                // Safety fallback: always try to start main app
                try
                {
                    string fallbackExe = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Zycord.exe");
                    if (File.Exists(fallbackExe))
                    {
                        Process.Start(fallbackExe);
                    }
                }
                catch { }
            }
        }

        private static void CheckAndApplyUpdate(string localAppPath)
        {
            try
            {
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(UPDATE_MANIFEST_URL);
                req.Timeout = 4000;
                req.ReadWriteTimeout = 4000;
                req.UserAgent = "Zycord-UpdateClient/1.0";

                string ymlContent = null;
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                using (StreamReader reader = new StreamReader(resp.GetResponseStream()))
                {
                    ymlContent = reader.ReadToEnd();
                }

                if (string.IsNullOrEmpty(ymlContent)) return;

                Match m = Regex.Match(ymlContent, @"version:\s*([0-9\.]+)");
                if (!m.Success) return;

                Version remoteVer;
                if (!Version.TryParse(m.Groups[1].Value.Trim(), out remoteVer)) return;

                Version localVer = new Version(0, 0, 0);
                if (File.Exists(localAppPath))
                {
                    FileVersionInfo fvi = FileVersionInfo.GetVersionInfo(localAppPath);
                    Version.TryParse(fvi.ProductVersion ?? fvi.FileVersion, out localVer);
                }

                if (remoteVer > localVer)
                {
                    string tempInstaller = Path.Combine(Path.GetTempPath(), "ZycordSetup-" + remoteVer.ToString() + ".exe");
                    using (WebClient wc = new WebClient())
                    {
                        wc.Headers.Add("User-Agent", "Zycord-UpdateClient/1.0");
                        wc.DownloadFile(UPDATE_INSTALLER_URL, tempInstaller);
                    }

                    if (File.Exists(tempInstaller) && new FileInfo(tempInstaller).Length > 1000000)
                    {
                        Process p = Process.Start(new ProcessStartInfo
                        {
                            FileName = tempInstaller,
                            Arguments = "/S",
                            UseShellExecute = true
                        });
                        p.WaitForExit(30000);
                    }
                }
            }
            catch
            {
                // Ignore network/timeout errors to avoid blocking the launch
            }
        }
    }
}
