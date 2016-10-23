var nodemailer = require("nodemailer");

module.exports = {
    sendEmail: function (Order,UserDetails,callback) {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'alterbliss.com@gmail.com', // Your email id
                pass: 'rajatisking2016' // Your password
            }
        });

        var html = "<b>User Details :"+JSON.stringify(UserDetails)+"</b><br/><br/><br/>"+
        "<b>Order Details: "+JSON.stringify(Order)+"</b>";
        var mailOptions = {
            from: 'alterbliss.com@gmail.com', // sender address
            to: '', // list of receivers separated by comma
            subject: 'Email Example', // Subject line
            //text: text //, // plaintext body
            html: html // You can choose to send an HTML body instead
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                callback(error,null)
            } else {
                console.log('Message sent: ' + info.response);
                callback(null,info.response );
            };
        });
    }
}
