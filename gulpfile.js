var gulp = require("gulp");
var htmlreplace = require("gulp-html-replace");
var cssminify = require("gulp-more-css");
var jsminify = require("gulp-minify");
var imagemin = require("gulp-imagemin");

/**
 * Copy files in nls folder 
 */
gulp.task("copynls", function () {
    gulp.src(["js/nls/**/*"])
        .pipe(gulp.dest("build/js/nls"));
});

/** 
 * minify nls  
 */
gulp.task("compressnls", function () {
    gulp.src("js/nls/**/*.js").pipe(jsminify({
        ext: {
            src: "js/nls/**/*.js",
            min: ".js"
        },
        noSource: true
    })).pipe(gulp.dest("build/js/nls/"));
});

/**
 * Optimize images 
 */
gulp.task("optimize", function () {
    gulp.src("images/*").pipe(imagemin()).pipe(gulp.dest("build/images"));
});


/** 
 * minify javascript 
 */
gulp.task("compress", function () {
    gulp.src("js/*.js").pipe(jsminify({
        ext: {
            src: "js/*.js",
            min: ".js"
        },
        noSource: true
    })).pipe(gulp.dest("build/js/"));
});
/**
 * Minify json config files 
 */
gulp.task("compressjson", function () {
    gulp.src("config/*.js").pipe(jsminify({
        ext: {
            src: "config/*.js",
            min: ".js"
        },
        noSource: true
    })).pipe(gulp.dest("build/config/"));
});


/**
 * minify css (Using concatenate + minify above instead )
 */
gulp.task("minifycss", function () {
    return gulp.src("css/main.css").pipe(cssminify()).pipe(gulp.dest("build/css"));
});


/**
 * Replace css stylesheets in index.html with 
 * concatenated css file. Looks for comments
 * in index.html with build:css and endbuild
 */
gulp.task("replace", function () {
    gulp.src("index.html").pipe(htmlreplace({
        "css": "css/main.css"
    })).pipe(gulp.dest("build/"));
});

//"optimize", 
gulp.task("default", ["compress", "compressjson", "compressnls", "minifycss", "replace"]);