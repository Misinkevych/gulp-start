// I створюємо папки dist-це папка, що передається замовнику
// #src-папка з вихідними файлами
let project_folder="dist";
let sourse_folder="#src";

// №35 підключаємо шрифти у стилі
let fs = require ('fs');
// II створюємо обєкти і прописуємо шлях до папок
let path={
    build:{
        html:project_folder + "/",
        css:project_folder + "/css/",
        js:project_folder + "/js/",
        img:project_folder + "/img/",
        fonts:project_folder + "/fonts/",
    },
    src:{
        // XIII для того, щоб у папці dist не зберігались файли типу header ми самі файли будемо наз. до прикладу _header.html і змінимо шлях в src
        html: [sourse_folder + "/*.html", "!" + sourse_folder + "/_*.html"],
        css:sourse_folder + "/scss/style.scss",
        js:sourse_folder + "/js/script.js",
        img:sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts:sourse_folder + "/fonts/*.ttf",
    },
    watch:{
        html:sourse_folder + "/**/*.html",
        css:sourse_folder + "/scss/**/*.scss",
        js:sourse_folder + "/js/**/*.js",
        img:sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
     
    },
    clean: "./" + project_folder + "/"
}
// III -встаномлюємо пакет npm browser-sync
// -прописуємо функцію require (відкриття сторінки в браузері)
// -про значення цієї функції читаємо тут https://gulpjs.com/docs/en/getting-started/creating-tasks/
let {src, dest}= require ('gulp'),
gulp= require ('gulp'),
browsersync= require ("browser-sync").create();

// IX додаємо переміну fileinclude 

fileinclude = require ("gulp-file-include");

// XIV -встановлюємо плагін del (не потрібно видаляти папку діст при видалені не потрібних файлів)
// -додаємо переміну del

del = require ("del");

// XIX після встановлення плагіна gulp-sass пишемо нову перемінну
scss = require ("gulp-sass") (require('sass'));
// XXII після встановлення плагіна gulp-autoprefixer робимо все по колу
//  -перемінна
//  -додамо його в ф-цію css, а саме pipe

autoprefixer = require ("gulp-autoprefixer");
// XXIII так само як і gulp-autoprefixer встановлюємо і налаштовуємо плагін 
// npm i --save-dev gulp-group-css-media-queries
group_media = require ("gulp-group-css-media-queries");
// XXIV так само як і gulp-autoprefixer встановлюємо і налаштовуємо плагін 
// npm i --save-dev gulp-clean-css
clean_css = require ("gulp-clean-css");
// XXV - npm i --save-dev gulp-rename
rename = require ("gulp-rename");
// №27 npm i --save-dev gulp-uglify-es
uglify = require ("gulp-uglify-es").default;
// №27 npm install --save-dev gulp-babel
babel = require('gulp-babel');
// №29 npm install --save-dev gulp-imagemin
imagemin = require('gulp-imagemin');
// №29 npm install --save-dev gulp-webp
webp = require('gulp-webp');
// №30 npm install --save-dev gulp-webp-html
webphtml = require('gulp-webp-html');
// №31 npm install --save-dev gulp-webpcss
webpcss = require("gulp-webpcss");
// №32 npm install --save-dev gulp-svg-sprite
svgSprite = require('gulp-svg-sprite');

// №33 npm install --save-dev gulp-ttf2woff gulp-ttf2woff'2
ttf2woff = require('gulp-ttf2woff');
ttf2woff2 = require('gulp-ttf2woff2');
// №34 npm install --save-dev gulp-fonter
fonter = require('gulp-fonter');

function browserSync(params) {
    browsersync.init(
        {
            server:{
                baseDir:"./" + project_folder + "/"
            },
            port:3000,
            notify:false
        }
    )
}

// V cтвоюємо нову ф-цію про її значення можна теж поситати у документації gulp
function html() {
    return src(path.src.html)

    // X прописуємо pipe для include
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html ))
    .pipe(browsersync.stream())
}
// XVII ф-ція для обробки файлів scss

function css() {
    return src(path.src.css)
// XX після створення переміної можемо задати настройки для css н-д
    .pipe(
        scss ({
            outputStyle: "expanded"
        }).on('error', scss.logError)
    )
// !!!! може бути помилка в 96 рядку
    .pipe(
        group_media()
    )
    .pipe(
        autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        })
    )
    .pipe(webpcss())
    .pipe(dest(path.build.css ))
    .pipe(
        clean_css()
    )
    .pipe(
        rename({
            extname: ".min.css"
        })
    )
    .pipe(dest(path.build.css ))
    .pipe(browsersync.stream())
}

// № 26 налаштовуємо js

function js() {
    return src(path.src.js)

    // X прописуємо pipe для include
    .pipe(fileinclude())
    .pipe(dest(path.build.js ))
    .pipe(uglify( ))
    .pipe(
        rename({
            extname: ".min.js"
        })
    )
    .pipe(babel())
    .pipe(dest(path.build.js ))
    .pipe(browsersync.stream())
}

// №28 налаштовуємо img
function images() {
    return src(path.src.img)
    .pipe(webp({
qualiti: 70
    }))

.pipe(dest(path.build.img ))
.pipe(src(path.src.img))

    .pipe(imagemin({
        progressive: true,
        svgoPlugins:[{removeViewBox: false}],
        interlaced:true,
        optimizationlevel: 3 
    }))
    .pipe(dest(path.build.img ))
    .pipe(browsersync.stream())
}

function fonts(params) {
    src(path.src.fonts)
    .pipe(ttf2woff( ))
    .pipe(dest(path.build.fonts ))

    return  src(path.src.fonts)
    .pipe(ttf2woff2( ))
    .pipe(dest(path.build.fonts ))

}
gulp.task('otf2ttf', function (){
    return src([sourse_folder + '/fonts/*.otf'])
    .pipe(fonter({
      formats:['ttf']  
    } ))
    .pipe(dest(sourse_folder + '/fonts/'))
})

gulp.task('svgSprite', function () {
    return gulp.src([sourse_folder + '/iconsprite/*.svg'])
    .pipe(svgSprite ({
        mode:{
            stack:{
                sprite: "../iconsprite/*.svg",
                example: true
            }
        },
    })

    )
    .pipe(dest(path.build.img ))
})

// XVIII встановлюмо новий плагін npm i gulp-sass --save-dev
// №36 пишемо ф-цію для підключення шрифтів у стилі

function fontsStyle(params) {


    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
    if (items) {
    let c_fontname;
    for (var i = 0; i < items.length; i++) {
    let fontname = items[i].split('.');
    fontname = fontname[0];
    if (c_fontname != fontname) {
    fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
    }
    c_fontname = fontname;
    }
    }
    })
    }



}


function cb() {






}







// XI пишемо нову функцію (для оновлення сторінки при внесені змін)
function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    // №28 додаємо js в відстежування
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

// XV створюємо ф-цію яка чиститиме (удалятиме) папку dist

function clean(params) {
    return del(path.clean);
}

// XVI після цього вписуємо clean в build 
// XXI вставляємо ф-цію в build і додаємо ще gulp.parallel і прописуємо exports.css=css;
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);

// VI вписуємо build в переміну  watch
// XII вписуємо watchFiles в переміну  watch
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle=fontsStyle;
exports.fonts=fonts;
exports.images=images;
// №27 js додаэмо в exports i build
exports.js=js;
// VII звязуэмо перемынні з gulp
exports.css=css;
exports.html=html;
exports.build=build;
// *****************


// VIII встановлюэмо npm пакет gulp-file-include 
exports.watch=watch;
exports.default=watch;
// IV-після вище виконаних дій в терміналі викликаємо просто дію "gulp"
// -результат:
// $ gulp
// [20:00:29] Using gulpfile D:\gulp-start\gulpfile.js
// [20:00:29] Starting 'default'...
// [20:00:29] Starting 'browserSync'...
// [Browsersync] Access URLs:
//  ---------------------------------------
//        Local: http://localhost:3000
//     External: http://192.168.31.126:3000
//  ---------------------------------------
//           UI: http://localhost:3001
//  UI External: http://localhost:3001
//  ---------------------------------------
// [Browsersync] Serving files from: ./dist/

// -після чого має відкритись сторінка у браузері буде з помилкою, але нічого страшного