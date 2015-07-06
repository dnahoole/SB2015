function UHMC() {
        this.dataset = {
            "summary": {},
            "points": [],
            "graph": {
                "values": [],
                "properties": {}
            },
            "bounds": null
        };
        var self = this;

        this.initialize = function(csvfile) {
            self.dataset = {
                "summary": {},
                "points": [],
                "graph": {
                    "values": [],
                    "properties": {}
                },
                "bounds": null
            };
            // Source:  KHOKL Computer Science students 2015  
            // URL:     data/day2data.csv
            // Descr:   UH Maui College Points of Interest
            // Fields:  Id,waypointId,routeId,name,description,datetime,latitude,longitude,imageURL,videoURL
            // Filter:  None
            // Format:  CSV
            self.dataset.summary.url = csvfile;

            d3.csv(self.dataset.summary.url, function(data) {
                self.dataPoints(data);
                self.dataSummary(data);
                self.dataGraph(data);
                self.fitBounds();
            });
        };

        this.fitBounds = function() {
            var lat_extents = d3.extent(self.dataset.points, function(d) {
                return d.latitude;
            });

            var lon_extents = d3.extent(self.dataset.points, function(d) {
                return d.longitude;
            });

            var NE = new google.maps.LatLng(lat_extents[1], lon_extents[1]);
            var SW = new google.maps.LatLng(lat_extents[0], lon_extents[0]);
            self.dataset.bounds = new google.maps.LatLngBounds(SW, NE);
        };

         this.dataPoints = function(data) {
             
            var parse = d3.time.format.utc("%m/%d/%Y %H:%M").parse;
            
            data.forEach(function(s) {
                s.time = parse(s.time);
                s.latitude = +s.latitude;
                s.longitude = +s.longitude;
                s.altitude = +s.altitude;

                if (s.latitude == 0 && s.longitude == 0) return;
                var location = new google.maps.LatLng(s.latitude, s.longitude);

                var marker = new google.maps.Marker({
                    objectid: s.id,
                    descr: s.description,
                    latitude: s.latitude,
                    longitude: s.longitude,
                    icon: self.getIcon(s.icon),
                    infowin: self.pointInfo(s),
                    position: location,
                    map: null,
                });
                
                self.dataset.points.push(marker);
            });
         };

         this.getIcon = function(s) {
            var symbol = s.trim().toLowerCase().replace(/ /g,"").split(",");
            return "icons/" + symbol[0] + "_" + symbol[1] + ".png";
         };

         this.pointInfo = function(s) {
            var infowin;

            infowin  = "<table><tr><th colspan='4'>Waypoint " + s.id + ": " + s.description + "</th></tr>";
            infowin += "<tr><th colspan='4'>" + s.time.toLocaleString() + " (HST)</th></tr>";
            infowin += "<tr><th>Lat.</th><td>" + s.latitude + "</td>";
            infowin += "<th>Lng.</th><td>" + s.longitude + "</td></tr>";
            infowin += "<tr><th>Altitude</th><td>" + s.altitude + " " + s.units + "</td></tr>";
            infowin += "<tr><td colspan='4'><iframe width='100%' height='auto' src='" + s.synthURL + "' frameborder='0' allowfullscreen></iframe></td></tr>";
            infowin += "<tr><td colspan='4'><iframe width='100%' height='auto' src='" + s.panoURL + "' frameborder='0' allowfullscreen></iframe></td></tr>";
            return infowin;
         };

         this.dataSummary = function(data) {
            self.dataset.summary = {
                "source": data[0].source,
                "location": data[0].location,
                "time": data[0].time,
                "format": "CSV",
                "items": data.length,
                "infowin": ""
            };

            self.dataset.summary.infowin  = "<table class='summary_info'>";
            self.dataset.summary.infowin += "<tr><th>Source</th><td colspan='3'>" + self.dataset.summary.source + "</td></tr>";
            self.dataset.summary.infowin += "<tr><th>Time</th><td colspan='3'>" + self.dataset.summary.time.toLocaleString() + " (HST)</td></tr>";
            self.dataset.summary.infowin += "<tr><th>Location</th><td colspan='3'>" + self.dataset.summary.location + "</td></tr>";
            self.dataset.summary.infowin += "<tr><th>Format</th><td>" + self.dataset.summary.format + "</td>";
            self.dataset.summary.infowin += "<th>Datapoints</th><td>" + self.dataset.summary.items + "</td></tr>";
            self.dataset.summary.infowin += "</table>";
        };

        this.dataGraph = function(data) {
            data.forEach(function(s) {
                self.dataset.graph.values.push([
                    // Fields: type,time,name,descr,latitude,
                    // longitude,imageURL,videoURL,altUnits
                    s.time,
                    s.altitude
                ]);
            });

            self.dataset.graph.properties = {
                labels: ["Time", "Altitude"],
                rollPeriod: 1,
                labelsSeparateLines: true,
                includeZero: true,
                title: self.dataset.summary.descr,
                ylabel: 'Altitude',
            };
        };

    } //--- end of custom GIS object