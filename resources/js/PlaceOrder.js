$(document).ready(function () {
    $("#itemType").text("Order Details -" + ItemType.ItemTypeText);
    var index = 1;

    if (ItemType.id && ItemType.id.length>0) {
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
    }

    if (ItemType.id && ItemType.id.length>0) {
        Getprice();
    }

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
        // alert("Handler for .submit() called.");
        e.preventDefault();
        var UserDetails = {
            Name: $("#name").val(),
            Email: $("#email").val(),
            Phone: $("#phone").val(),
            Address: $("#address").val(),
            Pincode: $("#pincode").val(),
            Pickup: $("#pickup").val(),
            Message: $("#message").val()
        }
        PlaceOrder(UserDetails)
    })

    $("#termsCheck").change(function(){
        if(document.getElementById("termsCheck").checked === true){
            document.getElementById("submitForm").disabled = false;
        }else{
            document.getElementById("submitForm").disabled = true;
        }
    })
    function PlaceOrder(UserDetails) {
        $.post("/PlaceOrder", { Order: ItemData, UserDetails: UserDetails })
            .done(function (data) {
            //    alert(data);
            //    window.location.href ="/"
            ShowConfirmationModal()
            })
            .fail(function (error) {
                alert(error);
            });
        
    }

    function ShowConfirmationModal() {

        var x = '<div class="modal fade" data-backdrop="static"  data-keyboard="false"  id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'
            + '<div class="modal-dialog" role="document">'
            + ' <div class="modal-content">'
            + '  <div class="modal-header">'
            + '   <button type="button" class="close"  onClick="redirectToHomePage()"><span aria-hidden="true">&times;</span></button>'
            + '</div>'
            + '<div class="modal-body">'
            + '<h4 class="modal-title" id="exampleModalLabel">Congratulations! your order is Placed.</h4>'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button type="button" class="btn btn-primary" onClick="redirectToHomePage()">Okay</button>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';

        $(x).modal();
    }
});
 function redirectToHomePage(){
        location.href="/";
    }
//# sourceURL=PlaceOrder.js
