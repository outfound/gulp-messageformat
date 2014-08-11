# [gulp](http://gulpjs.com)-messageformat

> WIP


## Usage

```js
var gulp = require('gulp');
var messageFormat = require('gulp-messageformat');

gulp.task('default', function () {
	return gulp.src('src/en/**/*.json')
		.pipe(messageFormat({
		    locale: 'en'
		}))
		.pipe(gulp.dest('dist'));
});
```


## License

MIT © [<%= Outfound %>](https://github.com/outfound)
