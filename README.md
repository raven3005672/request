# request

```js
request.ajax({
    url: "./queryname",
    type: "POST",
    dataType: "JSON",
    data: {name: "name", age: 12},
    success: function(response, xml) {
        // ...
    },
    error: function(status) {
        // ...
    }
});
```