let gulp = require("gulp"), // Подключаем Gulp
  less = require("gulp-less"), //Подключаем less пакет,
  browserSync = require("browser-sync"), // Подключаем Browser Sync
  concat = require("gulp-concat"), // Подключаем gulp-concat (для конкатенации файлов)
  uglify = require("gulp-uglifyjs"), // Подключаем gulp-uglifyjs (для сжатия JS)
  cssnano = require("gulp-cssnano"), // Подключаем пакет для минификации CSS
  rename = require("gulp-rename"), // Подключаем библиотеку для переименования файлов
  del = require("del"), // Подключаем библиотеку для удаления файлов и папок
  imagemin = require("gulp-imagemin"), // Подключаем библиотеку для работы с изображениями
  pngquant = require("imagemin-pngquant"), // Подключаем библиотеку для работы с png
  cache = require("gulp-cache"), // Подключаем библиотеку кеширования
  autoprefixer = require("gulp-autoprefixer"); // Подключаем библиотеку для автоматического добавления префиксов


gulp.task("less", function () { // Создаем таск less
  return gulp.src("source/less/style.less") // Берем источник
    .pipe(less()) // Преобразуем less в CSS посредством gulp-less
    .pipe(autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {cascade: true})) // Создаем префиксы
    .pipe(gulp.dest("source/css")) // Выгружаем результата в папку source/css
    .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});

gulp.task("browser-sync", function () { // Создаем таск browser-sync
  browserSync({ // Выполняем browserSync
    server: { // Определяем параметры сервера
      baseDir: "source" // Директория для сервера - source
    },
    notify: false // Отключаем уведомления
  });
});

gulp.task("scripts", function () {
  return gulp.src([ // Берем все необходимые библиотеки
    "source/libs/jquery/dist/jquery.min.js", // Берем jQuery
    "source/libs/magnific-popup/dist/jquery.magnific-popup.min.js" // Берем Magnific Popup
  ])
    .pipe(concat("libs.min.js")) // Собираем их в кучу в новом файле libs.min.js
    .pipe(uglify()) // Сжимаем JS файл
    .pipe(gulp.dest("source/js")); // Выгружаем в папку source/js
});

gulp.task("css-libs", ["less"], function () {
  return gulp.src("source/css/libs.css") // Выбираем файл для минификации
    .pipe(cssnano()) // Сжимаем
    .pipe(rename({suffix: ".min"})) // Добавляем суффикс .min
    .pipe(gulp.dest("source/css")); // Выгружаем в папку source/css
});

gulp.task("watch", ["browser-sync", "css-libs", "scripts"], function () {
  gulp.watch("source/less/**/*.less", ["less"]); // Наблюдение за less файлами в папке less
  gulp.watch("source/*.html", browserSync.reload); // Наблюдение за HTML файлами в корне проекта
  gulp.watch("source/js/**/*.js", browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task("clean", function () {
  return del.sync("dist"); // Удаляем папку dist перед сборкой
});

gulp.task("img", function () {
  return gulp.src("source/img/**/*") // Берем все изображения из source
    .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest("dist/img")); // Выгружаем на продакшен
});

gulp.task("build", ["clean", "img", "less", "scripts"], function () {

  let buildCss = gulp.src([ // Переносим библиотеки в продакшен
    "source/css/main.css",
    "source/css/libs.min.css"
  ])
    .pipe(gulp.dest("dist/css"));

  let buildFonts = gulp.src("source/fonts/**/*") // Переносим шрифты в продакшен
    .pipe(gulp.dest("dist/fonts"));

  let buildJs = gulp.src("source/js/**/*") // Переносим скрипты в продакшен
    .pipe(gulp.dest("dist/js"));

  let buildHtml = gulp.src("source/*.html") // Переносим HTML в продакшен
    .pipe(gulp.dest("dist"));

});

gulp.task("clear", function () {
  return cache.clearAll();
});

gulp.task("default", ["watch"]);
