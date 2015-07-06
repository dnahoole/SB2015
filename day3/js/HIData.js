function HiData() {
    this.map = null;
    var self = this;

    // The panorama that will be used as the entry point to the custom panorama set.
    this.last_point = null;

    this.initialize = function(basemap) {
        if (basemap) {
            self.map = basemap;
        }
        // Web service:  EDB EPA.
        document.getElementById('epasrc').addEventListener('change', self.setSrc, false);
    }

    this.toggleBounce = function() {
        if (self.last_point) {
            self.last_point.setAnimation(null);
        }
        
        if (self.last_point != this) {
            document.getElementById('datapoint').innerHTML = this.infowin;
            document.getElementById('datapoint').setAttribute("style", "display: block");
            this.setAnimation(google.maps.Animation.BOUNCE);
            self.last_point = this;
        } else {
            document.getElementById('datapoint').setAttribute("style", "display: none");
            self.last_point = null;
        }
    };

    this.setSrc = function(e) {
        self.deleteMarkers();

        if (document.getElementById('epa2').checked) {
            document.getElementById('dataset').setAttribute("style", "display: block");
            self.dataSummary(uhmc.dataset);
            self.showMarkers(uhmc.dataset);
        } else if (document.getElementById('epa4').checked) {
            document.getElementById('dataset').setAttribute("style", "display: block");
            self.dataSummary(paeloko.dataset);
            self.showMarkers(paeloko.dataset);
        }
    };

    this.fitBounds = function(data) {
        self.map.fitBounds(data.bounds);
    };

    // Shows any markers currently in the array.
    this.showMarkers = function(data) {
        for (var i = 0; i < data.points.length; i++) {
            google.maps.event.addListener(data.points[i], 'click', self.toggleBounce);
            data.points[i].setMap(self.map);
        }
    };

    // Removes the markers from the map, but keeps them in the array.
    this.clearMarkers = function(data) {
        for (var i = 0; i < data.points.length; i++) {
            data.points[i].setMap(null);
        }
    };

    // Deletes all markers in the array by removing references to them.
    this.deleteMarkers = function() {
        document.getElementById('dataset').setAttribute("style", "display: none");
        document.getElementById('summary').setAttribute("style", "display: none");
        document.getElementById('graph').setAttribute("style", "display: none");
        document.getElementById('graphlabel').setAttribute("style", "display: none");
        document.getElementById('datapoint').setAttribute("style", "display: none");
        document.getElementById('summary').innerHTML = null;
        document.getElementById('datapoint').innerHTML = null;
        document.getElementById('graph').innerHTML = null;
        document.getElementById('graphlabel').innerHTML = null;
        document.getElementById('datapoint').innerHTML = null;
        
        self.clearMarkers(uhmc.dataset);
        self.clearMarkers(paeloko.dataset);
    };

    this.dataSummary = function(data) {
        self.fitBounds(data);
        document.getElementById('summary').innerHTML = data.summary.infowin;
        document.getElementById('summary').setAttribute("style", "display: block");
    };

    this.dataGraph = function(data) {
        document.getElementById('graph').setAttribute("style", "display: block");
        document.getElementById('graphlabel').setAttribute("style", "display: block");
        var graph = new Dygraph(document.getElementById("graph"),
            data.graph.values, data.graph.properties);
    };

} //--- end of custom GIS object