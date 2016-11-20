var nodemailer = require("nodemailer");
var _ = require('lodash');
var _String = require('underscore.string');
var fs = require('fs');
module.exports = {
    sendEmail: function (Order, UserDetails, PriceDetails, callback) {
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'alterbliss.com@gmail.com', // Your email id
                pass: process.env.EMAIL_PASSWORD // Your password
            }
        });

        var html = "<p style='color:orange'>Greetings " + UserDetails.Name + "</p><br/>"
            + "Congratulation YOUR order has been placed"
            + "<br/><div>"
            + "<b>Order Details: </b>"
            + "<table style='width: 100%;max-width: 100%;margin-bottom: 20px;background-color: transparent;  border-color: grey;>"
            + "<tbody>"
            + "<tr style='background-color:#f9f9f9;'>"
            + "<th style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>#</th>"
            + "<th style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>Item Type</th>"
            + "<th style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>Item</th>"
            + "<th style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>Price</th>"
            + "<th style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>Total</th>"


        var index = 1
        fs.readFile('./Prices.json', 'utf8', function (err, data) {
            if (err) {
                throw err;
            } else {
                obj = JSON.parse(data);
                _.forEach(Order, function (itemType, key) {
                    if (key === "extra") {
                        _.forEach(Order["extra"], function (extraType, extraKey) {
                            html = html + "<tr><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + index + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + extraType.SubItemType + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + extraType.SubItemValue + "</td>"
                                + "<td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + PriceDetails["extra"][extraKey].Price + "</td>"
                                + "<td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'></td>"
                                + "</tr>"
                            index++;
                        });
                    } else {
                        var image = ""
                        if (key == "1") {
                               obj.forEach(function (Item) {
                                if (_String.include(itemType.SubItemType, Item.Type.toString()) == true) {
                                    Item.Items.forEach(function (subItem) {
                                        if (subItem.Type === itemType.SubItemValue) {
                                            image = subItem.Image
                                        }
                                    })
                                }
                            }, this);
                            html = html + "<tr><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + index + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + itemType.SubItemType + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + itemType.SubItemValue + "</td>"
                                + "<td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + PriceDetails.ItemPrice + "</td>"
                                + "<td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'></td>"
                                +"<td>"+image+"</td>"
                                + "</tr>"
                        } else {
                            html = html + "<tr><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + index + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + itemType.SubItemType + "</td><td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'>" + itemType.SubItemValue + "</td>"
                                + "<td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'></td>"
                                + "<td style='padding: 8px;line-height: 1.42857143;vertical-align: top; border-top: 1px solid #ddd;'></td>"
                                + "</tr>"
                        }

                    }

                    index++;
                });
            }
        });
        html = html + "<tr><td></td><td></td><td></td><td></td><td>" + PriceDetails.TotalPrice + "</td></tr>";
        html = html + "</tbody></table></div><br/></br/><div>"
            + "<b>User Details: </b>"
            + "<p>Name :" + UserDetails.Name + "</p>"
            + "<p>Email :" + UserDetails.Email + "</p>"
            + "<p>Phone :" + UserDetails.Phone + "</p>"
            + "<p>Address :" + UserDetails.Address + "</p>"
            + "<p>Pincode :" + UserDetails.Pincode + "</p>"
            + "<p>Pickup :" + UserDetails.Pickup + "</p>"
            + "<p>Message :" + UserDetails.Message + "</p>"
            + "</div><br/><br/><br/>";

        var mailOptions = {
            from: 'alterbliss.com@gmail.com', // sender address
            to: UserDetails.Email, // list of receivers separated by comma
            cc: 'alterbliss.com@gmail.com',
            subject: 'Blis - Order Confirmation', // Subject line
            //text: text //, // plaintext body
            html: html // You can choose to send an HTML body instead
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                callback(error, null)
            } else {
                console.log('Message sent: ' + info.response);
                callback(null, info.response);
            };
        });
    }
}
