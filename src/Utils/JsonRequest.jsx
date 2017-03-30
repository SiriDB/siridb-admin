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
        xmlhttp.send((data === undefined || isStringified) ? data : JSON.stringify(data));

        xmlhttp.onload = (e) => {
            var data;
            if (e.target.status == 200) {
                data = JSON.parse(xmlhttp.responseText);
                this.doneCb(data);
            } else {
                data = xmlhttp.responseText;
                this.failCb(e.target, data);
            }
            this.alwaysCb(e.target, data);
        };
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