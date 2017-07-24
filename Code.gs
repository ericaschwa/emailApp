function sendMail(recipients) {
  for (i = 0; i < recipients.length; i++) {  
    MailApp.sendEmail({
     to: recipients[i],
     subject: "Your Daily Email Update",
     htmlBody: "Welcome to your daily email!",
   });
  }
}

var people = ["erica.schwartz.4@gmail.com"]
sendMail(people)
