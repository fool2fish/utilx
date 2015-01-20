# utilx

Some tiny tool functions.

### home

{String} the home path

### isArray(o)

### isString(o)

### isNonEmptyString(o)

### isNumber(o)

### isInteger(o)

### split(str, delim = ',')

```
split([])  =>  []
split('1,2,3') => [1, 2, 3]
split('1,,2,,3', ',,')  => [1, 2, 3]
```

### camelcase(str)

```
camelcase('is-array')  =>  'isArray'
```

### unCamelcase(str)

```
unCamelcase('isArray')  => 'is-array'
```

### isExistedFile(p)

### isExistedDir(p)

### readFile(p, encoding)

### writeFile(p, data)

This function will create the dir first if necessary.

### remove(p)

Remove specified dir or file. If the path is not existing, this function will do nothing.

### readJSON(p)

This function will return an empty JSON object if any error occurs.

### writeJSON(p, data, space = 0)

### noCacheRequire(p)

### mix(target, src, overwrite = false)

Mix properties form src to target.

Multiple src is ok, e.g: `var target = mix(target, src1, src2, src3)`

### getExternalIpAddress()

### generateLine(len, symbol = '-')

```
generateLine(4)  =>  '----'
generateLine(2, '=*')  =>  '=*=*'
```

### cGetCfg(commander)

Get options from parsed commander.

```
var commander = require('commander')
commander.parse(process.argv)
var cfg = cGetCfg(commander)
```

### cGetHelp(pkg)

Return a function to generate help info for commander.

```
var commander = require('commander')
var pkg = require('../package')
commander.helpInfomation = cGetHelp(pkg)
```

### isUrl(p)

### isKeyword(p)