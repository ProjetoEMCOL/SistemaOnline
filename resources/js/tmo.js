(function() {
	window.Main = {};
	Main.Page = (function() {
		var mosq = null;
		var topic = $('#sub-topic-text').val();
		function Page() {
			var _this = this;
			mosq = new Mosquitto();

			$('#connect-button').click(function() {
				return _this.connect();
			});
			$('#disconnect-button').click(function() {
				return _this.disconnect();
			});
			$('#subscribe-button').click(function() {
				return _this.subscribe();
			});
			$('#unsubscribe-button').click(function() {
				return _this.unsubscribe();
			});
			mosq.onconnect = function(rc){
				var p = document.createElement("p");
				var topic = localStorage.getItem("topic");
				p.innerHTML = "CONNACK " + rc;
				$("#debug").append(p);
				mosq.subscribe(topic, 0);
			};
			mosq.ondisconnect = function(rc){
				var p = document.createElement("p");
				var url = "ws://test.mosquitto.org:8080/mqtt";
				p.innerHTML = "Lost connection";
				$("#debug").append(p);
				$("#status_io").html("");
			};
			mosq.onmessage = function(topic, payload, qos){
				var p = document.createElement("p");
				var payload_parseado = payload.split(",");
				var lat_parse = payload_parseado[0];
				var long_parse = payload_parseado[1];
				var temp = payload_parseado[2];
				if(lat_parse === localStorage.getItem("lat") && long_parse === localStorage.getItem("long")){
					localStorage.setItem("temp", temp);
					var div = "<div class='row'>";
					div += "<div class='col s12 m4 l4'>";
					div += "<b>Temperatura: " + temp + "</b>";
					div += "<br><img src='resources/img/temperatura.jpg'>";
					div += "</div>";
					div += "<div class='col s12 m4 l4'>";
					div += "<b>Latitude: " + lat_parse + "</b>";
					div += "<br><img src='resources/img/localizacao.jpg'>";
					div += "</div>";
					div += "<div class='col s12 m4 l4'>";
					div += "<b>Longitude: " + long_parse + "</b>";
					div += "<br><img src='resources/img/localizacao.jpg'>";
					div += "</div>";
					div += "</div>"
					p.innerHTML = div;
					// p.innerHTML = "<table width='100%' border=0><tr><th><table width='100%' border=0><tr><th  width='20%'>Temperatura:<br>"+payload_parseado[2]+"ºC<br><img src='resources/img/temperatura.jpg'></th><th  width='20%'>Latitude: "+payload_parseado[0]+" <br><img src='resources/img/localizacao.jpg'><th  width='20%'>Longitude: "+payload_parseado[1]+" <br><img src='resources/img/localizacao.jpg'></th></tr></table>";
					$("#status_io").html(p);
				}
			};
		}
		Page.prototype.connect = function(){
			var url = "ws://test.mosquitto.org:8080/mqtt";
			mosq.connect(url);
		};
		Page.prototype.disconnect = function(){
			mosq.disconnect();
		};
		Page.prototype.subscribe = function(){
			mosq.subscribe(topic, 0);
		};
		Page.prototype.unsubscribe = function(){
			mosq.unsubscribe(topic);
		};

		return Page;
	})();
	$(function(){
		return Main.controller = new Main.Page;
	});
}).call(this);
