---
layout: post
title: Using ES6 Generators with Callback-based Libraries
---

ES6 introduces generators (and `yield` expressions) to JavaScript. Kyle Simpson has written [a nice introduction to generators](http://davidwalsh.name/es6-generators), if you're looking for more about how they work.

They're a very welcome change from callbacks-of-infinite-sorrow situations, but generators aren't necessarily well supported by most NPM packages. Which raises the question:

### How do I use generators with callback-based libraries and older code?

I ran into this problem while trying out [Koa](http://koajs.com) (web framework, generators everywhere) and [node-sqlite3](https://github.com/mapbox/node-sqlite3) (database bindings, with a cool side of callbacks). Some packages do come with generator support, but that's harder to find – and realistally less stable – for a while yet.

Let's take some older code depending on callbacks and hide it behind a generator. Here's a basic fetch-the-gizmos-from-the-database example:

```javascript	
var db = new ArbitraryDB();

var gizmoService = {
	/**
	 * List all Gizmos.
	 */
	list: function () {
		this.db.list(function (error, result) {
			// [1] ???
		});
		// [2] ???
	}
};

// Application code. Let's protect this part from nasty callbacks.
var gizmos = gizmoService.list();
console.log(gizmos); // NULL
```

Well, that doesn't work. We need to return a value at `[2]` but it hasn't been returned from the callback. And once the callback is invoked at `[1]`, there's no way to return the value. Native Promises – and not polyfills, unfortunately – can solve this problem. 

> NOTE: As of this writing, using generators in NodeJS requires the `--harmony` flag. I'm using NPM v0.12.0.

An updated example:

```javascript
var db = new ArbitraryDB();

var gizmoService = {
	/**
	 * List all Gizmos.
	 */
	getAll: function *() {
		// Return a new Promise ...
		return new Promise(function(resolve, reject) {
			// ... make the async call ...
			this.db.getAll(function (error, result) {
				// ... and resolve or reject with callback result.
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		}.bind(this));
	}
};

// Application code.
var gizmos = yield gizmoService.getAll();
console.log(gizmos); // [ ... gizmos ... ]
```

Or, to catch possible DB-level errors:

```javascript
try {
	var gizmos = yield gizmoService.getAll();
	console.log(gizmos); // [ ... gizmos ... ]
} catch (error) {
	console.log('Oh, it broke.');
}
```

And that's it! The rest of your application can continue without worrying about callbacks tucked away in a dependency.
