const {src, dest, watch, parallel} = require('gulp');


//Rutas
const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenesV: 'src/img/**/*.{png,jpg,svg}',
    imagenes: 'src/img/**/*.{png,jpg}'
}

const dests = {
    css: './build/css',
    img: 'build/img',
    js: './build/js'
}

//css
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

/*===== JavaScript =====*/
const terser = require('gulp-terser-js');
const {defaults} = require("autoprefixer");
const rename = require('gulp-rename');
const concat = require('gulp-concat');

function css(done) {

    src(paths.scss) //identificar scss a compilar
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass()) //Compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(dests.css))  //Almacenarla
    done();
}

function imagenes(done) {

    const opciones = {
        optimizationLevel: 3
    }

    src(paths.imagenesV)
        .pipe(cache(imagemin(opciones)))
        .pipe(dest(dests.img))

    done();
}

function versionWebp(done) {

    const opciones = {
        quality: 50
    };

    src(paths.imagenes)
        .pipe(webp(opciones))
        .pipe(dest(dests.img))

    done();
}

function versionAvif(done) {

    const opciones = {
        quality: 50
    };

    src(paths.imagenes)
        .pipe(avif(opciones))
        .pipe(dest(dests.img))

    done();
}

function javascript(done) {

    src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js')) // final output file name
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(dests.js))

    done();
}

function watchArchivos() {
    watch( paths.scss, css );
    watch( paths.js, javascript );
    watch( paths.imagenesV, imagenes );
    watch( paths.imagenes, versionWebp );
}

exports.default = parallel(css,javascript,imagenes,versionAvif,versionWebp,watchArchivos);



// exports.css = css;
// exports.js = javascript;
// exports.imagenes = imagenes;
// exports.versionWebp = versionWebp;
// exports.versionAvif = versionAvif;
// exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
