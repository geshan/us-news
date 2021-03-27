@app
react-hello

@static
folder build

# json api
@http
get /api/news
get /api/fetch-news

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
