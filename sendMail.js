var nodemailer = require("nodemailer");
var _ = require('lodash')
module.exports = {
    sendEmail: function (Order,UserDetails,callback) {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'alterbliss.com@gmail.com', // Your email id
                pass: process.env.EMAIL_PASSWORD // Your password
            }
        });

        var html = "<p style='color:orange'>Greetings "+UserDetails.Name+"</p><br/>"
                    +"Congratulation YOUR order has been placed"
                    +"<br/><div>"
                    +"<b>Order Details: </b>"
                    +"<table style='width: 100%;max-width: 100%;margin-bottom: 20px;background-color: transparent;  border-color: grey;>"
                    +"<tbody>"
                    +"<tr style='background-color:#f9f9f9;'>"
                    +"<th style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>#</th>"
                    +"<th style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>Item Type</th>"
                    +"<th style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>Item</th>"
                    // +"<th '>price</th>"
                    // +"<th '>Total</th>"
                    
                    var index = 1
                    _.forEach(Order,function (itemType,key) {
                        if (key === "extra") {
                            _.forEach(Order["extra"],function (extraType) {
                                html = html + "<tr><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + index + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + extraType.SubItemType + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" +extraType.SubItemValue + "</td></tr>"
                                index++;
                            });
                        } else {
                            html = html +"<tr><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + index + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + itemType.SubItemType + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + itemType.SubItemValue + "</td></tr>"
                        }

                        index++;
                    });

                    html =html +"</tbody></table></div><br/></br/><div>"
                                +"<b>User Details: </b>"
                                +"<p>Name :" + UserDetails.Name +"</p>"
                                +"<p>Email :"+ UserDetails.Email +"</p>"
                                +"<p>Phone :"+ UserDetails.Phone +"</p>"
                                +"<p>Address :"+ UserDetails.Address +"</p>"
                                +"<p>Pincode :"+ UserDetails.Pincode +"</p>"
                                +"<p>Pickup :"+ UserDetails.Pickup +"</p>"
                                +"<p>Message :"+ UserDetails.Message +"</p>"
                                +"</div><br/><br/><br/>";
        
        var mailOptions = {
            from: 'alterbliss.com@gmail.com', // sender address
            to: UserDetails.Email, // list of receivers separated by comma
            cc:'alterbliss.com@gmail.com',
            subject: 'Blis - Order Confirmation', // Subject line
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
