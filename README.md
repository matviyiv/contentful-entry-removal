# contentful-entry-removal
Remove entries in Contentful space.

This package removes Entries in Contentful Space without need to delete space itself. After all entries are removed you can sync content_types successfully and overwrite all your previous changes.

## Why?
Removal of space in Contentful is fast but after that you would need to create new API keys, add users, add webhooks and redistribute your new API keys. This tool might be slow if you hit request timeout, so please set your own --interval.

## Install
```
npm install contentful-entry-removal
```
## Use
```
contentful-entry-removal --config ./config.example.json
```

## Command line options:
```
  --managementToken  Mangment token to space API
  --space            Space id to work with
  --maxAmount        Contentul API limit [default: 10]
  --interval         Contentful API calls timeout [default: 5000]
  --title            Title field in Entries (optional)
  --config           Configuration json file path
  -h, --help         Show help
```

## Config example
[config.eaxample.json](https://github.com/matviyiv/contentful-entry-removal/blob/master/config.example.json)