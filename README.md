# Getting Started 

run `npm i` to install depencies

then run `npm start` --> Open [http://localhost:3000](http://localhost:3000)

## Modify environnement

In the project, we need to modify environnement/global variables to work :

`/src/config.json`

```
{
    "BASE_URL": "http://localhost/path/to/folder"
}
```

`/api/index.php - row 10`

```
<?php

// ...

define('URL', 'http://localhost/path/to/folder');
```