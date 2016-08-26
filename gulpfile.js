const cleanCSS = require("gulp-clean-css");
const gulp = require("gulp");
const hash = require("gulp-hash");
const revReplace = require("gulp-rev-replace");
const rimraf = require("gulp-rimraf");
const runSequence = require("run-sequence");
const uglify = require("gulp-uglify");


const SRC_PATH = "./src";
const DEST_PATH = "./public";

gulp.task("default", [ "build" ]);

gulp.task("clean", () => {
    return gulp.src([`${DEST_PATH}/**/*.*`, "!./**/.svn/"])
               .pipe(rimraf());
});

gulp.task("build", [ "clean" ], (cb) => {
    runSequence(
        "build-css",
        "build-js",
        "build-html",
        cb
    );
});

gulp.task("build-css", () => {
    return gulp.src(`${SRC_PATH}/css/**/*.css`)
               .pipe(cleanCSS())
               .pipe(hash())
               .pipe(gulp.dest(`${DEST_PATH}/css/`))
               .pipe(hash.manifest(`css-manifest.json`,true))
               .pipe(gulp.dest(`${DEST_PATH}/css/`));
});

gulp.task("build-js", () => {
    return gulp.src(`${SRC_PATH}/js/**/*.js`)
               .pipe(uglify())
               .pipe(hash())
               .pipe(gulp.dest(`${DEST_PATH}/js/`))
               .pipe(hash.manifest(`js-manifest.json`,true))
               .pipe(gulp.dest(`${DEST_PATH}/js/`));
});


gulp.task("build-html", () => {
    const manifest = gulp.src([`${DEST_PATH}/css/css-manifest.json`, `${DEST_PATH}/js/js-manifest.json`]);
    return gulp.src(`${SRC_PATH}/page/**/*.html`)
               .pipe(revReplace({manifest: manifest}))
               .pipe(gulp.dest(`${DEST_PATH}/page/`));
});



gulp.task("replaceToDev", () => {
    const manifest = gulp.src(`${DEST_PATH}/manifest.json`);
    return gulp.src(`${SRC_PATH}/page/**/*.html`)
               .pipe(revReplace({manifest: manifest}))
               .pipe(gulp.dest(`${DEST_PATH}/page_dev/`));
});
