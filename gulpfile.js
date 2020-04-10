const gulp = require('gulp');
const spawn = require('child_process').spawn;
const sassLint = require('gulp-sass-lint');
const twig = require('gulp-twig');

gulp.task('gulp-autoreload', function() {
  // Store current process if any
  var p;
  
  gulp.watch('gulpfile.js', spawnChildren);
  // Comment the line below if you start your server by yourslef anywhere else
  spawnChildren();

  function spawnChildren(e) {
    if(p) {
        p.kill(); 
    }

    p = spawn('gulp', ['build'], {stdio: 'inherit'});
  }
});

function buildCss() {
     return gulp.src('./src/css/*.scss')
    
     .pipe(sassLint({
        options: {
        formatter: 'stylish',
        'merge-default-rules': false
      },
    
      rules: {
        'no-ids': 1,
        'no-mergeable-selectors': 0,
        'indentaion':0
      },
         
       
     }))
     .pipe(sassLint.format({
        formatter:'stylish'
     }
     ))
     .pipe(sassLint.failOnError())
    
}

function buildHTML(){
    return  gulp.src('./src/html/*.twig')
    
    .pipe(twig())
    .pipe(gulp.dest('./dist'))

}

gulp.task('build', function( cb ) {
    gulp.watch('./src/css/*.s[ac?]ss', buildCss);    
    gulp.watch('./src/html/**/*.twig', buildHTML);    
    cb()
})




 