$(document).ready(function () {
    $("#itemType").text("Order Details -" + ItemType.ItemTypeText);
    var index = 1
    $.each(ItemData, function (itemType) {
        if (itemType === "extra") {
            $.each(ItemData["extra"], function (extraType) {
                $("#orderDetails").append("<tr><td>" + index + "</td><td>" + ItemData[itemType][extraType].SubItemType + "</td><td>" + ItemData[itemType][extraType].SubItemValue + "</td><td></td><td></td></tr>")
                index++;
            });
        } else {
            $("#orderDetails").append("<tr><td>" + itemType + "</td><td>" + ItemData[itemType].SubItemType + "</td><td>" + ItemData[itemType].SubItemValue + "</td><td></td><td></td></tr>")
        }

        index++;
    });

    Getprice();
    function Getprice() {
        var subItem = ItemData[1].SubItemValue;
        var ItemId = ItemType.id
        $.post("/GetPrice/" + ItemId + "/" + subItem, { extra: ItemData["extra"] })
            .done(function (data) {
                $("#orderDetails tr:nth-child(2) td:nth-child(4)").append("<td class='Orderprice'>" + data.ItemPrice + "</td>")
                $("#orderDetails").append("<tr><td></td><td></td><td></td><td></td><td class='Orderprice'>" + data.TotalPrice + "</td></tr>")

                $.each(data.extra, function (extraItem) {
                    $("#orderDetails tr:contains('" + this.SubItemValue + "')").find("td:nth-child(4)").addClass('Orderprice').text(this.Price);
                });

                if (data.MiscMessage.length > 0) {
                    $("#orderDetails").append("<tr><td colspan='5' style='color:#FF7e82'>" + data.MiscMessage + "</td></tr>")
                }
            })
            .fail(function (error) {
                alert(error);
            })
    }

    $('#contactForm').submit(function (e) {
        alert( "Handler for .submit() called." );
        e.preventDefault();
        var UserDetails ={
            Name:$("#name").val(),
            Email:$("#email").val(),
            Phone:$("#phone").val(),
            Message:$("#message").val()
        }
        PlaceOrder(UserDetails)
    })

    function PlaceOrder(UserDetails) {
        $.post("/PlaceOrder", { Order: ItemData, UserDetails: UserDetails })
            .done(function (data) {
               alert(data);
               window.location.href ="/"
            })
            .fail(function (error) {
                alert(error);
            })
    }
})
//# sourceURL=PlaceOrder.js
