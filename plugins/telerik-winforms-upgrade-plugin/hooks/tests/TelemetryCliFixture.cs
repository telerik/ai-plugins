using System;
using System.IO;
using System.Text;
using System.Threading;

public static class TelemetryCliFixture
{
    public static int Main(string[] args)
    {
        var directory = Environment.GetEnvironmentVariable("TEST_TELEMETRY_DIRECTORY");
        var mode = Environment.GetEnvironmentVariable("TEST_TELEMETRY_MODE");
        File.AppendAllText(Path.Combine(directory, "calls.txt"),
            string.Join("|", args) + "\n", new UTF8Encoding(false));
        Console.WriteLine("CLI output must not enter the hook response.");
        var help = args.Length == 3 && args[0] == "telemetry"
            && args[1] == "record" && args[2] == "--help";
        if (help)
        {
            if (mode == "timeout-help") Thread.Sleep(10000);
            return mode == "unsupported" ? 2 : 0;
        }
        if (args.Length != 5 || args[0] != "telemetry" || args[1] != "record"
            || args[2] != "--source" || args[3] != "winforms-upgrade-plugin"
            || args[4] != "--stdin") return 4;
        if (mode == "timeout-record") Thread.Sleep(10000);
        if (mode == "failure")
        {
            Console.Error.WriteLine("CLI error must not enter the hook response.");
            return 3;
        }
        Console.InputEncoding = new UTF8Encoding(false);
        File.AppendAllText(Path.Combine(directory, "forwarded.jsonl"),
            Console.In.ReadToEnd(), new UTF8Encoding(false));
        return 0;
    }
}
