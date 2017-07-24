function getEmailInfo(){
    var num_unread         = GmailApp.getInboxUnreadCount();
    var num_starred_unread = GmailApp.getStarredUnreadCount();
    var intro = "You have " + num_unread + " unread message(s).\n";
    intro += num_starred_unread + " of these message(s) are starred.\n";
    if (num_unread == 0) {
        return intro
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
    message_list += "</ol>"

    return intro + message_list;
}

function getCalInfo() {
    var today  = new Date();
    var events = CalendarApp.getDefaultCalendar().getEventsForDay(today);
    intro = "You have " + events.length + " event(s) scheduled for today.\n";
    if (events.length == 0) {
        return intro;
    }

    var events_list = "<ol>";
    for (var i = 0; i < events.length; i++) {
        var title    = events[i].getTitle();
        var start    = events[i].getStartTime();
        var end      = events[i].getEndTime();
        var location = events[i].getLocation();
        events_list += "<li><b>" + title + "</b>, from " + start + " to " + end;
        if (location != "") {
            events_list += " at " + location;
        }
        events_list += "</li>";
    }
    events_list += "</ol>";

    return intro + events_list;
}

function getNewsInfo() {
    var news       = "https://newsapi.org/v1/articles?source=google-news&apiKey=";
    var properties = PropertiesService.getScriptProperties();
    var news_api   = properties.getProperty('news_api');
    var news_obj   = UrlFetchApp.fetch(news + news_api);
    var articles   = JSON.parse(news_obj)['articles'];
    var news_list = "<ul>";
    for (i = 0; i < articles.length; i++) {
        news_list += "<li>" + articles[i]['title'] + "</li>";
    }
    return news_list + "</ul>";
}

function getWeatherInfo() {
    var weather     = "http://api.openweathermap.org/data/2.5/weather?id=5087168&APPID=";
    var properties  = PropertiesService.getScriptProperties();
    var weather_api = properties.getProperty('weather_api');
    var weather_obj = UrlFetchApp.fetch(weather + weather_api);
    // TODO: format weather information in a way that's easy to understand
    return weather_obj
}

function createMessageBody(){
    var intro  = "<h1>Welcome to your daily email update!</h1>\n";
    var email_info = "<p>" + getEmailInfo() + "</p>";
    var cal_info   = "<p>" + getCalInfo() + "</p>";
    var news_info = "<p>" + getNewsInfo() + "</p>";
    var weather_info = "<p>" + getWeatherInfo() + "</p>";
    return intro + "<h2>Emails</h2>" + email_info + "<h2>Events</h2>" + cal_info + "<h2>News</h2>" + news_info + "<h2>Weather</h2>" + weather_info;
}

function sendMail() {
    var me        = Session.getActiveUser().getEmail();
    MailApp.sendEmail({
        to: me,
        subject: "Your Daily Email Update",
        htmlBody: createMessageBody(),
    });
}

