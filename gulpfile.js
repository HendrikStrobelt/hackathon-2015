/*jshint node: true */

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    gutil = require("gulp-util"),
    jade = require("gulp-jade"),
    jscs = require("gulp-jscs"),
    stylishJscs = require("gulp-jscs-stylish"),
    job = require("gulp-job"),
    jshint = require("gulp-jshint"),
    plumber = require("gulp-plumber"),
    rename = require("gulp-rename"),
    rimraf = require("gulp-rimraf"),
    shell = require("gulp-shell"),
    stylus = require("gulp-stylus"),
    uglify = require("gulp-uglify"),
    stylishJshint = require("jshint-stylish"),
    _ = require("underscore");

(function () {
    "use strict";

    var gulpSrc = gulp.src;
    gulp.src = function () {
        return gulpSrc.apply(gulp, arguments)
            .pipe(plumber(function (error) {
                gutil.log(gutil.colors.red("Error (" + error.plugin + "): " + error.message));
                this.emit("end");
            }));
    };
}());

gulp.task("jade", function () {
    "use strict";

    return gulp.src("src/jade/*.jade")
        .pipe(jade())
        .pipe(gulp.dest("./build/site"));
});

gulp.task("jade-templates", function () {
    "use strict";

    return gulp.src("src/jade/template/**/*.jade")
        .pipe(jade({
            client: true
        }))
        .pipe(job({
            namespace: "clique.template"
        }))
        .pipe(concat("templates.js"))
        .pipe(gulp.dest("./build/jade"));
});

gulp.task("stylus", function () {
    "use strict";

    return gulp.src("src/styl/**/*.styl")
        .pipe(stylus({
            compress: true
        }))
        .pipe(gulp.dest("./build/site"));
});

gulp.task("uglify-index", function () {
    "use strict";

    var dest = _.bind(gulp.dest, gulp, "build/site");

    return gulp.src("src/js/index.js")
        .pipe(dest())
        .pipe(uglify())
        .pipe(rename("index.min.js"))
        .pipe(dest());
});

gulp.task("lint", function () {
    "use strict";

    return gulp.src([
        "src/js/**/*.js",
        "gulpfile.js"
    ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylishJshint))
        .pipe(jshint.reporter("fail"));
});

gulp.task("style", function () {
    "use strict";

    return gulp.src([
        "src/js/**/*.js",
        "gulpfile.js"
    ])
        .pipe(jscs())
        .pipe(stylishJscs());
});

gulp.task("assets", function () {
    "use strict";

    gulp.src("src/assets/**/*")
        .pipe(gulp.dest("./build/site/assets"));
});

gulp.task("clean", function () {
    "use strict";

    return gulp.src("./build/**", { read: false })
        .pipe(rimraf());
});

gulp.task("uglify", [
    "uglify-index"
]);

gulp.task("default", [
    "lint",
    "style",
    "stylus",
    "uglify",
    "jade",
    "assets"
]);

gulp.task("serve", function () {
    "use strict";

    var host = process.env.CLIQUE_HOST || "localhost",
        port = process.env.CLIQUE_PORT || 3000;

    return gulp.src("")
        .pipe(shell(["./hackathon " + host + " " + port]));
});