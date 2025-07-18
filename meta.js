/**
 * Reads a JSON file in the format conforming to the open data metadata guidelines 
 * promulgated by the US Federal CIO office (https://project-open-data.cio.gov/v1.1/schema/)
 * and writes an HTML file conforming to Google and schema.org
 * https://developers.google.com/search/docs/data-types/dataset
 * http://schema.org/Dataset
 */

var fs = require('fs')
const metadata = require('./meta.json')

htmlfile = '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
htmlfile += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
htmlfile += '<link rel="stylesheet" href="styles.css">\n'
htmlfile += '<title>'+metadata.title+'</title>\n'
htmlfile += '</head>\n'
htmlfile += '<body>\n'
htmlfile += '<h1>' + metadata.title + '</h1>\n'
htmlfile += '<div id="data-sets">\n'

jsonld = ''
htmlbody = ''
metadata.datasets.forEach(dataset => {
    htmlbody += '<div class="data-set" itemscope itemtype="http://schema.org/Dataset" itemid="' + dataset.identifier + '">\n'
    htmlbody += '<meta itemprop="url" content="' + dataset.distribution[0].downloadURL + '"/>\n'
    jsonld += '<script type="application/ld+json">\n'
    jsonld += '{\n"@context": "http://schema.org",\n'
    jsonld += '"@type": "Dataset",\n'
    jsonld += '"identifier": "' + dataset.identifier + '",\n'
    jsonld += '"name": "' + dataset.title + '",\n'
    htmlbody += '<h2>' + dataset.title + '</h2>\n'
    htmlbody += '<i>(' + dataset.identifier + ')</i>\n'
    jsonld += '"description": "' + dataset.description + '",\n'
    htmlbody += '<div class="description">' + dataset.description + '</div>\n'
    if (dataset.publisher) {
        htmlbody += '<div itemprop="publisher" itemscope itemtype="http://schema.org/Organization">\n'
        htmlbody += 'Publisher: <span itemprop="name">' + dataset.publisher.name + '</span>\n'
        htmlbody += '</div>\n'
    }
    jsonld += '"version": "' + dataset.modified + '",\n'
    jsonld += '"keywords": ["' + dataset.keyword.join('","') + '"],\n'
    htmlbody += '<div class="keywords">Keywords: ' + dataset.keyword.toString() + '</div>\n'
    jsonld += '"distribution": ['
    dataset.distribution.forEach(distro => {
        jsonld += '{\n"fileFormat": "' + distro.format + '",\n'
        jsonld += '"contentUrl": "' + distro.downloadURL + '"\n},\n'
        if (distro.sizeInBytes) {
            mbsize = distro.sizeInBytes / 1000000
            htmlbody += '<div itemprop="contentSize" content="' + mbsize.toString() + '">Size: ' + mbsize.toString() + ' MB</div>\n'
        }
        if (dataset.modified) {
            htmlbody += '<div itemprop="version" content="' + dataset.modified + '">Last Modified: ' + dataset.modified + '</div>\n'
        }
        htmlbody += '<div itemprop="encodingFormat" content="' + distro.mediaType + '" class="download-link">Download ' + distro.format + ': <a href="' + distro.downloadURL + '">' + distro.downloadURL + '</a></div>\n'
    })
    jsonld = jsonld.substring(0, jsonld.length-2)
    jsonld += ']'
    jsonld += '}\n</script>\n'
    htmlbody += "</div>\n"
})
htmlfile += jsonld
htmlfile += htmlbody


htmlfile += '</div>\n'
htmlfile += '</body></html>'

fs.writeFile('index.html', htmlfile, err => {
    if (err) console.log(err)
})
