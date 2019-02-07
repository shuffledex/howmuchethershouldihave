
$(function() {
    let amount = 0;

    $('#check').on('click', function(){
        let address = $('#address').val();
        if (address != "") {
            updateText('calculated...');
            $.when(request(`http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=8KKX8B6QS2MC68DBTEVXUZJDJGAFXCJYAH`)).then(
                function(data) {
                    if (data.status != "0") {
                        let filter = _.filter(data.result, function(o) {
                            return o.to.toLowerCase() == address.toLowerCase() && parseInt(o.value) > 0;
                        });
                        _.forEach(filter, function(data) {
                            amount += parseInt(data.value);
                        });
                        let ethers = amount/1000000000000000000;
                        usdValue(ethers);
                    } else {
                        updateText('-ERROR-');
                    }
                },
                function(error) {
                    updateText('-ERROR-');
                }
            )
        }
    })
})

function usdValue(ethers) {
    $.when(request('https://api.coinmarketcap.com/v1/ticker/ethereum/')).then(
        function(data) {
            let usd = ethers * parseFloat(data[0].price_usd);
            updateText(`${ethers} ETH (~ $${Math.round(usd)})`);
        },
        function(error) {
            updateText('-ERROR-');
        }
    )
}

function request(url) {
    var dfd = $.Deferred();
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            dfd.resolve(data);
        },
        error: function() {
            dfd.reject("sorry");
        }
    });
    return dfd.promise();
}

function updateText(text) {
    $('.row h2').text(text);
}