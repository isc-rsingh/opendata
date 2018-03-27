var fs = require('fs')
const metadata = require('./meta.json')

const baseurl = 'http://s3-api.us-geo.objectstorage.softlayer.net/bucketname'

htmlfile = '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
htmlfile += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
htmlfile += '<title>'+metadata.title+'</title>\n'
htmlfile += '</head>\n'
htmlfile += '<body>\n'
htmlfile += '<h1>' + metadata.title + '</h1>\n'

jsonld = ''
htmlbody = ''
metadata.datasets.forEach(dataset => {
    jsonld += '<script type="application/ld+json">\n'
    jsonld += '{\n"@context": "http://schema.org",\n'
    jsonld += '"@type": "Dataset",\n'
    jsonld += '"identifier": "' + dataset.identifier + '",\n'
    jsonld += '"name": "' + dataset.title + '",\n'
    htmlbody += '<h2>' + dataset.title + '</h2>\n'
    htmlbody += '<i>(' + dataset.identifier + ')</i>\n'
    jsonld += '"description": "' + dataset.description + '",\n'
    htmlbody += '<div class="description">' + dataset.description + '</div>\n'
    jsonld += '"keywords": ["' + dataset.keyword.join('","') + '"],\n'
    htmlbody += '<div class="keywords">Keywords: ' + dataset.keyword.toString() + '</div>\n'
    jsonld += '"distribution": ['
    dataset.distribution.forEach(distro => {
        jsonld += '{\n"fileFormat": "' + distro.format + '",\n'
        jsonld += '"contentUrl": "' + distro.downloadURL + '"\n},\n'
        htmlbody += '<div class="download-link">Download ' + distro.format + ': <a href="' + distro.downloadURL + '">' + distro.downloadURL + '</a></div>\n'
    })
    jsonld = jsonld.substring(0, jsonld.length-2)
    jsonld += ']'
    jsonld += '}\n</script>\n'
})
htmlfile += jsonld
htmlfile += htmlbody


htmlfile += '</body></html>'

fs.writeFile('index.html', htmlfile, err => {
    if (err) console.log(err)
})
