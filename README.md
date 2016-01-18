rerequire for NodeJS
============================

```
npm install -g git+https://git@github.com/thurt/rerequire.git
```

*start global module from the command line*
```
$ rerequire
```

*this opens a Node REPL that has a rerequire method*
```
>
```

*enter a module to rerequire*
```
> rerequire('camelcase', 'cc')
```

*access the rerequired module with the name you gave for second argument*
```
> cc('look-it-works')
'lookItWorks'
>
```

*modify the module you have rerequired and then save it--*
*you do not have to restart the REPL, nor re-require the module, nor clear require.cache*
```
> cc('look-it-works')
'I added this to the source!'
'lookItWorks'
>
```

*Simple*
