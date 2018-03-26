var baseurl = "http://s3-api.us-geo.objectstorage.softlayer.net/bucketname"

function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText))
            } else {
                if (error) error(xhr)
            }
        }
    };
    xhr.open("GET", path, true)
    xhr.send()
}

function insertMetadata() {
    baseurl = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split("/")[1]
    loadJSON('./meta.json', metadataLoaded, metadataError)
}

function metadataLoaded(metadata) {
    body = document.getElementsByTagName("body")[0]
    title = document.getElementById("datacatalogtitle")
    title.innerText = metadata.title

    // make the Datacatalog microdata div
    dcdiv = document.getElementById("datacatalog")
    // loop through each dataset in the JSON file
    metadata.datasets.forEach(dataset => {
        // make the Dataset microdata div
        dsdiv = document.createElement("div")
        dsdiv.setAttribute("itemscope", "itemscope")
        dsdiv.setAttribute("itemtype", "http://schema.org/Dataset")
        dsdiv.setAttribute("itemid", baseurl + "/" + dataset.name)

        // add the meta tag
        metael = document.createElement("meta")
        metael.setAttribute("itemprop", "url")
        metael.setAttribute("content", baseurl + "/" + dataset.name)
        dsdiv.appendChild(metael)

        // add the name as a nice title
        titleel = document.createElement("h2")
        titleel.setAttribute("itemprop", "name")
        let dslink = document.createElement("a")
        dslink.setAttribute("href", baseurl + "/" + dataset.distribution[0].downloadURL)
        dslink.appendChild(document.createTextNode(dataset.title))
        titleel.appendChild(dslink)
        dsdiv.appendChild(titleel)

        // add author

        // now add the description and publisher
        if (dataset.description) {
            theel = document.createElement("div")
            theel.setAttribute("itemprop", "description")
            theel.appendChild(document.createTextNode(dataset.description))
            dsdiv.appendChild(theel)
        }
        if (dataset.publisher) {
            theel = document.createElement("div")
            theel.setAttribute("itemprop", "publisher")
            theel.setAttribute("itemscope", "itemscope")
            theel.setAttribute("itemtype", "http://schema.org/Organization")
            theel.appendChild(document.createTextNode("Publisher: "))
            pubel = document.createElement("span")
            pubel.setAttribute("itemprop", "name")
            pubel.appendChild(document.createTextNode(dataset.publisher.name))
            theel.appendChild(pubel)
            dsdiv.appendChild(theel)
        }

        // now add size, last modified date, and format inside a distribution microdata object
        distroel = document.createElement("div")
        distroel.setAttribute("itemprop", "distribution")
        distroel.setAttribute("itemscope", "itemscope")
        distroel.setAttribute("itemtype", "http://schema.org/DataDownload")
        distroel.appendChild(document.createTextNode("Download: "))
        distroel.appendChild(dslink.cloneNode(true))

        if (dataset.distribution[0].sizeInBytes) {
            mbsize = dataset.distribution[0].sizeInBytes / 1000000
            theel = document.createElement("div")
            theel.setAttribute("itemprop", "contentSize")
            theel.setAttribute("content", mbsize.toString())
            theel.appendChild(document.createTextNode("Size: "))
            theel.appendChild(document.createTextNode(mbsize.toString()+" MB"))
            distroel.appendChild(theel)
        }
        if (dataset.modified) {
            theel = document.createElement("div")
            theel.setAttribute("itemprop", "datePublished")
            theel.setAttribute("content", dataset.modified)
            theel.appendChild(document.createTextNode("Last Modified: "))
            theel.appendChild(document.createTextNode(dataset.modified))
            distroel.appendChild(theel)
        }
        if (dataset.distribution[0].mediaType) {
            theel = document.createElement("div")
            theel.setAttribute("itemprop", "encodingFormat")
            theel.setAttribute("content", dataset.distribution[0].mediaType)
            theel.appendChild(document.createTextNode("Format: "))
            if (dataset.distribution[0].format)
                theel.appendChild(document.createTextNode(dataset.distribution[0].format))
            else 
                theel.appendChild(document.createTextNode(dataset.distribution[0].mediaType))
            distroel.appendChild(theel)
        }

        dsdiv.appendChild(distroel)

        dcdiv.appendChild(dsdiv)
    })
    body.appendChild(dcdiv)
}

function metadataError(metaerror) {
    console.log(metaerror)
}
