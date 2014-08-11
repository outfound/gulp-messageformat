# [gulp](http://gulpjs.com)-messageformat

> WIP!! I don't even know if this plugin works!  Still testing.


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

MIT © Outfound Pty Ltd (https://github.com/outfound)
