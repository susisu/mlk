var gulp    = require("gulp"),
    webpack = require("gulp-webpack");

var packageInfo = require("./package.json");
var banner = "mlk\ncopyright (c) 2015 Susisu | MIT License\nhttps://github.com/susisu/mlk";


gulp.task("webpack", function () {
    return gulp.src("./lib/mlk.js")
        .pipe(webpack({
            "output": {
                "libraryTarget": "var",
                "library"      : "mlk",
                "sourcePrefix" : "    ",
                "filename"     : "mlk." + packageInfo.version + ".js"
            },
            "externals": {
                "loquat": true
            },
            "plugins": [
                new webpack.webpack.BannerPlugin(
                    banner,
                    { "entryOnly": true }
                )
            ]
        }))
        .pipe(gulp.dest("./build"));
});

gulp.task("webpack-min", function () {
    return gulp.src("./lib/mlk.js")
        .pipe(webpack({
            "output": {
                "libraryTarget": "var",
                "library"      : "mlk",
                "sourcePrefix" : "    ",
                "filename"     : "mlk." + packageInfo.version + ".min.js",
            },
            "externals": {
                "loquat": true
            },
            "plugins": [
                new webpack.webpack.optimize.UglifyJsPlugin(),
                new webpack.webpack.BannerPlugin(
                    banner,
                    { "entryOnly": true }
                )
            ]
        }))
        .pipe(gulp.dest("./build"));
});

gulp.task("build", ["webpack", "webpack-min"]);

gulp.task("default", ["build"]);
