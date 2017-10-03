const mix = require('laravel-mix');

mix.js('src/vue2-forms.js', 'dist')
    .setPublicPath('dist');