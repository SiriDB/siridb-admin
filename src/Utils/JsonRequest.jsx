class JsonRequest {

    constructor(type, url, data, isStringified) {

        this.doneCb = function (data) { };
        this.failCb = function (error, data) {
            console.error(error, data);
        };
        this.alwaysCb = function (xhr, data) { };

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open(type, url);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');

        data = (data === undefined || isStringified) ? data : JSON.stringify(data)

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4) {
                let resp;
                if (xmlhttp.status == 200) {
                    resp = JSON.parse(xmlhttp.responseText);
                    this.doneCb(resp);
                } else {
                    resp = xmlhttp.responseText || 'failed to send request, please check if the webserver is still running';
                    this.failCb(xmlhttp, resp);
                }
                this.alwaysCb(xmlhttp, resp);
            }
        };

        xmlhttp.send(data);
    }

    _onResponse(xhr) {
        let data = JSON.parse(xhr.responseText);
        this.alwaysCb(xhr, data);
        return data;
    }

    done(doneCb) {
        this.doneCb = doneCb;
        return this;
    }

    fail(failCb) {
        this.failCb = failCb;
        return this;
    }

    always(alwaysCb) {
        this.alwaysCb = alwaysCb;
        return this;
    }
}

export default JsonRequest;