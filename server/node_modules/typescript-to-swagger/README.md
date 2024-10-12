## Generate swagger file automaticaly from typescript for express node.js.
### No need any js-doc comments for swagger documentation! Only typescript interfaces!
![image](https://user-images.githubusercontent.com/10614750/230362209-c70a62e4-02aa-4d02-a405-2c665d71b3ff.png)

## Very simple usage
```
generateSpecAsync({ dir: ['./src/controller', './src/enum', './src/model'] }).then((spec) => {
    fs.writeFileSync(path.resolve('../spec.json'), JSON.stringify(spec));
});
```


