// set up ======================================================================
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var path = require('path');
var _ = require('underscore.string');
// create our app w/ express

var port = process.env.PORT || 3000; // set the port

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


app.use('/resources/', express.static(path.join(__dirname + "/resources/"))); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get("/product/:ID", function (req, res) {
    res.render(req.params.ID)
});

app.post("/GetPrice/:ItemType/:SubItemType", function (req, res) {
    var ItemType = req.params.ItemType;
    var SubItemType = req.params.SubItemType;
    var extra = req.body.extra;
    var fs = require('fs');
    var obj;
    var ItemPrice = 0.00;
    var AddonPrice = 0.00;
    var TotalPrice = 0.00;
    var MiscMessage = "";

    if (_.include(SubItemType), 'as') {
        MiscMessage = "In case of your own design, Price will be confirmed during Pickup";
    }
    fs.readFile('./Prices.json', 'utf8', function (err, data) {
        if (err) {
            throw err;
        } else {
            obj = JSON.parse(data);

            obj.forEach(function (Item) {
                if (Item.Id.toString() === ItemType) {
                    Item.Items.forEach(function (subItem) {
                        if (subItem.Type === SubItemType) {
                            ItemPrice = subItem.Price
                        }
                    })
                }
            }, this);

            obj.forEach(function (Item) {
                if (Item.Id.toString() === ItemType) {
                    Item.Addons.forEach(function (subItem) {
                        if (extra !== undefined) {
                            extra.forEach(function (extrItem) {
                                if (subItem.Type === extrItem.SubItemValue) {
                                    extrItem.Price = subItem.Price
                                }
                            });
                        }

                    })
                }
            }, this);

            //total calculation
            if (extra !== undefined) {
                if (extra.length > 0) {
                    extra.forEach(function (extraItem) {
                        TotalPrice = TotalPrice + extraItem.Price;
                    })
                }
            }

            TotalPrice = TotalPrice + ItemPrice;

            //override Itemprice
            if (_.include((SubItemType), 'As per Measurement') == true || _.include((SubItemType), 'As per Dress Material') == true) {
                MiscMessage = "In case of your own design, Price will be confirmed during Pickup";
                ItemPrice = "N/A"
            }
            res.status(200).send({ ItemPrice: ItemPrice, extra: extra, TotalPrice: TotalPrice, MiscMessage: MiscMessage })
        }
    });
})
app.get("/views/:view", function (req, res) {
    res.sendfile('./views/partials/' + req.params.view + '.html');

});

app.post("/PlaceOrder", function (req, res) {
    var Order = req.body.Order;
    var UserDetails = req.body.UserDetails;
    var emailClient = require('./sendMail');

    emailClient.sendEmail(Order, UserDetails, function (err, output) {
        if (err) {
            res.status(500).send("Error placing order")
        } else {
            res.send("Order Placed")
        }

    });
})
app.get('*', function (req, res) {
    res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);