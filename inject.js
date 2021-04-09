setTimeout(function(){
    if (app) {
        var events = []; 
        var agendaGroups = $('.agenda-group');
        agendaGroups.each(function (agenda) {
            var key = $($('.agenda-group')[agenda]).find('.dashboard-agenda-item').data('key');
            events.push(key);
        });
        var experienceDictionary = [];
        var index = 0;
        var fetchIndex = 0;
        events.forEach(function (keyId) {
            var event = app.findCollection('events').findByKey(keyId);
            var now = new Date();
            var nextWeek = new Date(new Date(now).setDate(now.getDate() + 7));
            if (new Date(event.get('actualStart')) <= nextWeek ) {
                var experienceId = event.get('experience').id;
                var experience = app.findCollection('experiences').findById(experienceId);
                experienceDictionary.push(experience.get('geo')); 
                index++;   
            }
        });
        
        var weatherArray = [];
        var objectFetch = [];
        experienceDictionary.forEach(function(location) {
            var data = {"location": {"lat": location.get('lat'),"lng": location.get('lng')}};
            if (!objectFetch[data]) {
                objectFetch[data] = true;
                $.ajax({
                    type: 'POST',
                    url: "https://6427d19c5a20.ngrok.io/api/weather",
                    dataType: 'json',
                    crossDomain : true,
                    data: JSON.stringify(data),
                    success: function(data) {
                        var dateDictionary = [];
                        data.forEach(function(weather) {
                            var date = new Date(weather.dt*1000).format("d");
                            date += new Date(weather.dt*1000).format("M");
                            dateDictionary[date] = weather;
                        });
                        $('.agenda-date').each(function(agendaDate) {
                            var date = $($('.agenda-date')[agendaDate]).text().replace(/\s/g, '');
                            if ($($('.agenda-date')[agendaDate]).parent().find('.weather-container').length === 0) {
                                $($('.agenda-date')[agendaDate]).parent().append('<div class="weather-container"></div>');
                            }
                            if (dateDictionary[date]) {
                                var html = '<div><div class="image-container"><img src="http://openweathermap.org/img/wn/';
                                html += dateDictionary[date].weather[0].icon + '.png" class="image" alt=""></div>';
                                html += '<div class="weather-data"> MAX : ' + dateDictionary[date].temp.max + '&#8451';
                                html += ' MIN : ' + dateDictionary[date].temp.min + '&#8451 </br>';
                                html += 'TODAY_WEATHER : ' + dateDictionary[date].weather[0].description + ' &nbsp&nbsp </div></div>';
                                $($('.agenda-date')[agendaDate]).parent().find('.weather-container').empty().append(html);
                            }
                        });
                    },
                    error: function(error) {
                        console.log(error);
                    },
                });
            }
        })

    }    
}, 6000)
