function getEmailInfo(){
    /*
    Returns info about the user's unread emails, as an HTML string
    Note: only looks at 50 newest emails in inbox, similarly to how
          they're displayed by Gmail
    */
    var num_unread         = GmailApp.getInboxUnreadCount();
    var num_starred_unread = GmailApp.getStarredUnreadCount();
    var intro = "You have " + num_unread + " unread message(s).\n";
    intro += num_starred_unread + " of these message(s) are starred.\n";
    if (num_unread == 0) {
        return intro;
    }

    var message_list = "<ol>"
    var threads = GmailApp.getInboxThreads(0,50)
    var msgs = GmailApp.getMessagesForThreads(threads);
    for (var i = 0; i < msgs.length; i++) {
        for (var j = 0; j < msgs[i].length; j++) {
            if (msgs[i][j].isUnread()) {
                 var subject = msgs[i][j].getSubject();
                 var from        = msgs[i][j].getFrom();
                 message_list += "<li><b>" + subject + "</b>, from " + from;
                 if (msgs[i][j].isStarred()) {
                     message_list += "<ul><li>*** STARRED ***</li></ul>";
                 }
                 message_list += "</li>";
             }
         }
    }
    message_list += "</ol>";
    return intro + message_list;
}

function getCalInfo() {
    /*
    Returns info about the user's calendar events for the day, as HTML string
    */
    var today  = new Date();
    var events = CalendarApp.getDefaultCalendar().getEventsForDay(today);
    intro = "You have " + events.length + " event(s) scheduled for today.\n";
    if (events.length == 0) {
        return intro;
    }

    var events_list = "<ol>";
    for (var i = 0; i < events.length; i++) {
        var title    = events[i].getTitle();
        var start    = events[i].getStartTime().toLocaleTimeString();
        var end      = events[i].getEndTime().toLocaleTimeString();
        var location = events[i].getLocation();
        events_list += "<li><b>" +title + "</b>, from " + start + " to " + end;
        if (location != "") {
            events_list += " at " + location;
        }
        events_list += "</li>";
    }
    events_list += "</ol>";

    return intro + events_list;
}

function getNewsInfo() {
    /*
    Returns Google News's top stories, as an HTML string unordered list
    */
    var site     = "https://newsapi.org/v1/articles?source=google-news";
    var keys     = PropertiesService.getScriptProperties();
    var news_key = keys.getProperty('news_api');
    var news_obj = UrlFetchApp.fetch(site + "&apiKey=" + news_key);
    var articles   = JSON.parse(news_obj)['articles'];
    var news_list = "<ul>";
    for (i = 0; i < articles.length; i++) {
        news_list += "<li>" + articles[i]['title'] + "</li>";
    }
    return news_list + "</ul>";
}

function kelvinToF(K) {
    /*
    Given the temperature in Kelvin, returns the temperature in Fahrenheight
    */
    return 1.8 * (K - 273) + 32;
}

function getWeatherInfo() {
    /*
    Returns the weather in Hanover, NH as a string
    */
    // get weather info
    var site        = "http://api.openweathermap.org/data/2.5/weather";
    var keys        = PropertiesService.getScriptProperties();
    var weather_key = keys.getProperty('weather_api');
    var weather_url = site + "?id=5087168&APPID=" + weather_key
    var weather_obj = JSON.parse(UrlFetchApp.fetch(weather_url));
    var description = weather_obj['weather'][0]['description'];

    // process weather info, rounding temps to nearest 2 digits
    var low     = kelvinToF(weather_obj['main']['temp_min']).toFixed(2);
    var high    = kelvinToF(weather_obj['main']['temp_max']).toFixed(2);
    var sunrise = new Date(1000 * weather_obj['sys']['sunrise']);
    var sunset  = new Date(1000 * weather_obj['sys']['sunset']);
    var result  = "The weather today will be " + description;
    result += " with a low of " + low + " and a high of " + high;
    result += ". Sunrise will be at " + sunrise.toLocaleTimeString();
    result += " and sunset will be at " + sunset.toLocaleTimeString() + ".";
    return result;
}

function createMessageBody(){
    /*
    Creates and returns the body of the daily email message
    */
    var email  = "<h1>Welcome to your daily email update!</h1>\n";
    var email_info = "<p>" + getEmailInfo() + "</p>";
    var cal_info   = "<p>" + getCalInfo() + "</p>";
    var news_info = "<p>" + getNewsInfo() + "</p>";
    var weather_info = "<p>" + getWeatherInfo() + "</p>";
    email += "<h2>Emails</h2>"  + email_info;
    email += "<h2>Events</h2>"  + cal_info;
    email += "<h2>News</h2>"    + news_info;
    email += "<h2>Weather</h2>" + weather_info;
}

function sendMail() {
    /*
    Creates and sends a daily email message
    */
    var me        = Session.getActiveUser().getEmail();
    MailApp.sendEmail({
        to: me,
        subject: "Your Daily Email Update",
        htmlBody: createMessageBody(),
    });
}
