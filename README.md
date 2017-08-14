[![Build Status](https://travis-ci.org/freddiefujiwara/chromeless-cli.svg?branch=master)](https://travis-ci.org/freddiefujiwara/chromeless-cli)
[![Build status](https://ci.appveyor.com/api/projects/status/f6wch68buqp93hc7/branch/master?svg=true)](https://ci.appveyor.com/project/freddiefujiwara/chromeless-cli/branch/master)
[![CircleCI](https://circleci.com/gh/freddiefujiwara/chromeless-cli.svg?style=svg)](https://circleci.com/gh/freddiefujiwara/chromeless-cli)
[![npm version](https://badge.fury.io/js/chromeless-cli.svg)](https://badge.fury.io/js/chromeless-cli)
[![codecov](https://codecov.io/gh/freddiefujiwara/chromeless-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/freddiefujiwara/chromeless-cli)
[![dependencies Status](https://david-dm.org/freddiefujiwara/chromeless-cli/status.svg)](https://david-dm.org/freddiefujiwara/chromeless-cli)

# chromeless-cli
Parsing HTML at the command line

## Requirements

 - Node 7.6 or later

## Installation

```bash
npm i -g chromeless-cli
```

## Usage
```bash
                                                                                                          
                                                                                                                               
  Usage: chromeless-cli [options] <query> [file.html]                                                                                    
                                                                                                                               
  Parsing HTML at the command line                                                                                             
                                                                                                                               
                                                                                                                               
  Options:                                                                                                                     
                                                                                                                               
    -V, --version     output the version number                                                                                
    -t --type <type>  Output type: (inner|outer|text|value)                                                                    
    -h, --help        output usage information  
```

## Example
```bash
$  wget -q -O - http://www.google.co.jp/ | chromeless-cli 'input[name="biw"]'                                               
<input name="biw" type="hidden">    
```

## FAQ

[FAQ](https://github.com/freddiefujiwara/chromeless-cli/wiki/FAQ)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/freddiefujiwara/chromeless-cli
