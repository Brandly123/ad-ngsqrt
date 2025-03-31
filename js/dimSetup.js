var div = document.getElementById('Dimensions');

var createNewDimension = function(num, name){
    var newElement = document.createElement('button');
    newElement.innerHTML = `${name}<br> You have <span class="amAmount">${player.dimensions[num][1]}</span> <br>(bought <span class="amBuys">${player.dimensions[num][0]}</span> times)<br> Cost: <span class="amCost">${format(calculateADCost(num))}</span> AM`;

    newElement.id = "ad" + num;

    if(player.dimensionShifts.add(1).gte(num)) newElement.style.visibility = 'visible';
    else newElement.style.visibility = 'hidden';

    div.appendChild(newElement);
    newElement.addEventListener("click", function() {
        buyAD(num,new Decimal(1))
    });
}