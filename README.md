#Laravel Ajax Lazy Load

This package is a simple integration with Laravel Paginator with Angular Ajax Request.


Example:

```javascript
angular
.module('app', ['wm.laravel-lazy-load'])
.controller('AppController', function ($scope, WMLaravelLazyLoad) {
    $scope.users = new WMLaravelLazyLoad('/json/users');

    // load all data 

    $scope.users.untilCompleted();

    // load the next page if exists

    $scope.users.next();
});
```

Laravel:

```php
Route::get('/json/users', function () {
   return User::paginate(); 
});
```