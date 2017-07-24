function createMessageBody(me){
    var num_unread                 = GmailApp.getInboxUnreadCount();
    var num_starred_unread = GmailApp.getStarredUnreadCount();
    var intro = "Welcome to your daily email from " + me + "!\n";
    intro += "You have " + num_unread + " unread messages.\n";
    intro += num_starred_unread + " of these messages are starred.\n";
    if (num_unread == 0) {
        return intro
    }

    message = "<ol>"
    var threads = GmailApp.getInboxThreads(0,50)
    var msgs = GmailApp.getMessagesForThreads(threads);
    for (var i = 0 ; i < msgs.length; i++) {
        for (var j = 0; j < msgs[i].length; j++) {
            if (msgs[i][j].isUnread()) {
                var subject = msgs[i][j].getSubject();
                var from        = msgs[i][j].getFrom();
                message += "<li><b>" + subject + "</b>, from " + from;
                if (msgs[i][j].isStarred()) {
                    message += "<ul><li>*** STARRED ***</li></ul>";
                }
                message += "</li>";
            }
        }
    }
    message += "</ol>"

    return intro + message
}

function sendMail() {
    var me = Session.getActiveUser().getEmail();
    MailApp.sendEmail({
         to: me,
         subject: "Your Daily Email Update",
         htmlBody: createMessageBody(me),
    });
}

sendMail();
