# MBTileify

Add an x/y/z tile url template and set min and max zoom levels, and create an MBTiles set.

**Note:** - Please use responsibly. Some map tile providers may have terms and conditions that prohibit caching tiles from their servers.

## Development

* Copy `.env.sample`, add your AWS credentials, and add source.

```
cp .env.sample .env
vim .env
source .env
```

* Install node dependencies

```
npm install
```

* Install Redis

http://redis.io/download

* Run

`npm run dev`
