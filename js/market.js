const apiBaseURL = "https://api.agilefi.org/api";

$(document).ready(function () {
    let markets = null;
    let aglPrice = 0;
    let farmTVL = 0;

    const request = $.ajax({
        url: `${apiBaseURL}/v1/governance/agile`,
        header: "Access-Control-Allow-Origin: *"
    });

    request.done(function (response) {
        console.log(response)
        markets = response?.data?.markets;
        farmTVL = response?.data?.farmTVL;
        aglPrice = response?.data?.aglPrice;

        let tvl = 0
        let totalSupply = 0;
        let totalBorrow = 0;
        let totalSupplyApy = 0;
        let totalBorrowApy = 0;
        if (markets.length > 0) {
            totalSupply = markets.reduce((prev, current) => {
                return prev + Number(current.totalSupplyUsd)
            }, 0);
        }
        tvl = totalSupply + Number(farmTVL);
        $('#tvl').text(`${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(tvl)}`);

        if (markets.length > 0) {
            totalSupply = markets.reduce((prev, current) => {
                return prev + Number(current.totalSupplyUsd)
            }, 0);
            totalSupplyApy = (markets.reduce((prev, current) => {
                            return prev + Number(current.supplyApy) + Number(current.supplyAgileApy)
                        }, 0)).toFixed(2);
        }
        $('#total-supply').text(`${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(totalSupply)}`);
        $('#total-supply-apy').text(`${totalSupplyApy}%`);

        if (markets.length > 0) {
            totalBorrow = markets.reduce((prev, current) => {
                return prev + Number(current.totalBorrowsUsd)
            }, 0);
            totalBorrowApy = markets.reduce((prev, current) => {
                return prev + (Number(current.borrowAgileApy) - Number(current.borrowApy))
            }, 0);
        }
        $('#total-borrow').text(`${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(totalBorrow)}`);
        $('#total-borrow-apy').text(`${totalBorrowApy}%`);

        const currencyFormatter = (labelValue) => {
            let suffix = '';
            let unit = 1;
            const abs = Math.abs(Number(labelValue));
            if (abs >= 1.0e9) {
                // Nine Zeroes for Billions
                suffix = 'B';
                unit = 1.0e9;
            } else if (abs >= 1.0e6) {
                // Six Zeroes for Millions
                suffix = 'M';
                unit = 1.0e6;
            } else if (abs >= 1.0e3) {
                // Three Zeroes for Thousands
                suffix = 'K';
                unit = 1.0e3;
            }

            return `$${Math.round(((abs / unit) + Number.EPSILON) * 100) / 100}${suffix}`
        }

        if (markets.length > 0) {
            let top3SupplyMarkets = markets.sort((a, b) => Number(b.totalSupplyUsd) - Number(a.totalSupplyUsd))
                .slice(0, 3)
                .map(market => {
                    const percent = totalSupply > 0 ? Number((market.totalSupplyUsd / totalSupply) * 100).toFixed(2) : 0;
                    return (
                        `<div class="market-flex d-flex justify-content-between">
                            <p>${market.underlyingSymbol}</p>
                            <p>${percent}%</p>
                        </div>
                        <div class="market-bar">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: ${percent}%"
                                    aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>`
                    )
                });
            $('#top-supply-markets').html(top3SupplyMarkets)

            let top3BorrowMarkets = markets.sort((a, b) => Number(b.totalBorrowsUsd) - Number(a.totalBorrowsUsd))
                .slice(0, 3)
                .map(market => {
                    const percent = totalBorrow > 0 ? Number((market.totalBorrowsUsd / totalBorrow) * 100).toFixed(2) : 0;
                    return (
                        `<div class="market-flex d-flex justify-content-between">
                            <p>${market.underlyingSymbol}</p>
                            <p>${percent}%</p>
                        </div>
                        <div class="market-bar">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: ${percent}%"
                                    aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>`
                    )
                });
            $('#top-borrow-markets').html(top3BorrowMarkets)

            let marketsHtml = markets.map((row, index) => {
                return (
                    `<tr class="tr-element">
                        <td class="td-element-1" style="text-align:left;padding-left:35px;">
                            <a href="#" class="table-click">
                                <div class="icon-market">
                                    <img src="images/${row.underlyingSymbol}.png" class="img-fluid" alt="">
                                </div>
                                <p>${row.underlyingSymbol}</p>
                            </a>
                        </td>
                        <td class="td-element-1">
                            <h2>${currencyFormatter(row.totalSupplyUsd)}</h2>
                        </td>
                        <td class="td-element-1">
                            <h2><span>${Math.round((parseFloat(row.supplyApy) + Number.EPSILON) * 100) / 100}%</span><span class="positive-values"> + ${Math.round((parseFloat(row.supplyAgileApy) + Number.EPSILON) * 100) / 100}%</span></h2>
                            <h3>Max reward ${Math.round((parseFloat(row.supplyApy) + parseFloat(row.supplyAgileApy) + Number.EPSILON) * 100) / 100}%</h3>
                        </td>
                        <td class="td-element-1">
                            <h2>${currencyFormatter(row.totalBorrowsUsd)}</h2>
                        </td>
                        <td class="td-element-1">
                            <h2><span>${Math.round((parseFloat(row.borrowAgileApy) + Number.EPSILON) * 100) / 100}%</span><span class="negative-values"> - ${Math.round((parseFloat(row.borrowApy) + Number.EPSILON) * 100) / 100}%</span></h2>
                            <h3>Max reward ${Math.round((parseFloat(row.borrowAgileApy) - parseFloat(row.borrowApy) + Number.EPSILON) * 100) / 100}%</h3>
                        </td>
                    </tr>`
                )
            })
            $('#table-body').html(marketsHtml)
        }
    });
});
