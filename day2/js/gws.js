function GIS() {

        //--- GIS Properties
        this.geocoder = new google.maps.Geocoder();
        this.gmMain = null;
        this.gmStreet = null;
        this.embed = "https://www.google.com/maps/embed/v1/";
        this.apikey = "?key=AIzaSyCckMCTYOqMly5Ye8HAa74ijG69vOzBz8Q";

        this.layer1 = document.getElementById('layer1');
        this.layer2 = document.getElementById('layer2');
        this.layer3 = document.getElementById('layer3');

        this.boxRoute = document.getElementById('boxRoute');
        this.boxPlace = document.getElementById('boxPlace');
        this.boxSearch = document.getElementById('boxSearch');

        var self = this;

        //--- GIS Methods
        this.init = function() {
            // Bus route view
            self.gmMain = document.getElementById('gmMain');
            self.gmStreet = document.getElementById('gmStreet');
            document.getElementById('radio-menu').addEventListener("change", self.showLayer, false);

            self.showLayer();
            self.showDirections("Kahului,Wailuku");
        };

        this.showLayer = function() {
            self.boxRoute.setAttribute("style", "height: 0%");
            self.boxPlace.setAttribute("style", "height: 0%");
            self.boxSearch.setAttribute("style", "height: 0%");

            if (self.layer1.checked) {
                self.boxRoute.setAttribute("style", "height: 100%");
            }
            else if (self.layer2.checked) {
                self.boxPlace.setAttribute("style", "height: 100%");
            }
            else if (self.layer3.checked) {
                self.boxSearch.setAttribute("style", "height: 100%");
            }
        };

        this.showDirections = function(e) {
            var res = e.split(",");
            var url = this.embed + "directions";
            url += this.apikey;
            url += "&mode=transit";
            url += "&origin=" + res[0];
            url += "&destination=" + res[1];

            self.gmMain.setAttribute("src", url);
            self.codeAddress(res[1]);
        };

        this.showPlace = function() {
            if (self.layer2.checked) {
                var address = document.getElementById("idPlace").value;
                var url = self.embed + "place";
                url += self.apikey;
                url += "&q=" + address;

                url = url.replace(",", "+");
                url = url.replace(" ", "");

                self.gmMain.setAttribute("src", url);
                self.codeAddress(address);
            }
        };

        this.showSearch = function() {
            if (self.layer3.checked) {
                var address = document.getElementById("idSearch").value;
                var url = self.embed + "search";
                url += self.apikey;
                url += "&q=" + address.replace(",", "+");

                if (document.getElementById("cbxBus").checked) {
                    url += "+bus+stop";
                }
                else if (document.getElementById("cbxRest").checked) {
                    url += "+restaurant";
                }
                else {
                    url += "+hospital";
                }
                self.gmMain.setAttribute("src", url);
                self.codeAddress(address);
            }
        };

        this.codeAddress = function(address) {
            self.geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var loc = results[0].geometry.location.toString();
                    var url = self.embed + "streetview";
                    url += self.apikey;
                    url += "&fov=60";
                    url += "&location=" + loc.substring(1, loc.length - 1);
                    self.gmStreet.setAttribute("src", url);
                }
                else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        };

    } //--- End of GIS Prototype