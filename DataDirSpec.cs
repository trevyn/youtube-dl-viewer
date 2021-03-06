﻿using System;
using System.IO;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace youtube_dl_viewer
{
    public class DataDirSpec
    {
        public readonly string Path;
        public readonly string Name;
        public readonly bool UseFilenameAsTitle;
        public readonly int RecursionDepth;
        public readonly string FilenameFilter;
        public readonly string OrderFilename;
        public readonly string HTMLTitle;
        
        public readonly int? DisplayOverride;
        public readonly int? WidthOverride;
        public readonly int? OrderOverride;
        public readonly int? VideomodeOverride;

        public string FullOrderFilename
        {
            get
            {
                if (OrderFilename == null) return null;
                return System.IO.Path.Combine(Path, OrderFilename);
            }
        }

        public DataDirSpec(string path, string name, 
            bool useFilenameAsTitle, int recursionDepth, string filenameFilter, string orderFilename, string htmltitle,
            int? display_override, int? width_override, int? order_override, int? videomode_override)
        {
            Path               = path;
            Name               = name;
            UseFilenameAsTitle = useFilenameAsTitle;
            RecursionDepth     = recursionDepth;
            FilenameFilter     = filenameFilter;
            OrderFilename      = orderFilename;
            HTMLTitle          = htmltitle;
            
            DisplayOverride    = display_override;
            WidthOverride      = width_override;
            OrderOverride      = order_override;
            VideomodeOverride  = videomode_override;
        }

        public static DataDirSpec Parse(string spec)
        {
            if (!spec.StartsWith("{")) return FromPath(spec);

            var json = JObject.Parse(spec);

            var path = json.Value<string>("path");
            if (path == null) throw new Exception("Cannot parse extended path-spec (missing 'path' attribute)");

            var name = json.Value<string>("name") ?? path;

            var useFilename = json.GetValue("use_filename_as_title")?.Value<bool>() ?? false;
            
            var recDepth = json.GetValue("recursion")?.Value<int>() ?? 0;
            
            var filter = json.Value<string>("filter") ?? "*";

            var order = json.GetValue("ext_order")?.Value<string>();
            
            var ovr_display   = json.GetValue("display")?.Value<int>();
            var ovr_width     = json.GetValue("width")?.Value<int>();
            var ovr_order     = json.GetValue("order")?.Value<int>();
            var ovr_videomode = json.GetValue("videomode")?.Value<int>();

            var htmltitle = json.GetValue("htmltitle")?.Value<string>();
            if (htmltitle != null) htmltitle = htmltitle.Replace("{version}", Program.Version);
            
            return new DataDirSpec(path, name, useFilename, recDepth, filter, order, htmltitle, ovr_display, ovr_width, ovr_order, ovr_videomode);
        }

        public static DataDirSpec FromPath(string dir)
        {
            return new DataDirSpec(dir, dir, false, 0, "*", null, null, null, null, null, null);
        }
    }
}