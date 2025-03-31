var upgradeSixToggled = true;

var calcADMulti = function(num){
    return new Decimal(2).add(player.paradoxUpgrades[4].div(5))
    .pow(player.dimensions[num][0].div(10).floor())
    .mul(player.paradoxUpgrades[3].div(4).add(1))
    .mul(new Decimal(2.5).pow(player.dimensionShifts))
    .div(10000)
}
var calcAMMulti = function(){
    return new Decimal(2).pow(player.paradoxUpgrades[1])
    .mul(new Decimal(5).pow(player.paradoxUpgrades[7]))
    .div(10000)
}
var calculateGainedParadoxes = function(){
    return new Decimal(2).pow(player.paradoxUpgrades[2])
    .mul(player.totalAntimatter.mul(25000).max(1).log(8).pow(1.25).add(1))
    .mul(player.dimensionShifts.add(1))
}

var toggleUpgradeSix = function(){
    upgradeSixToggled = !upgradeSixToggled
}

function updatePrestigeDisplays(){
    document.getElementById("paradoxes").innerHTML = format(player.paradoxes)
    document.getElementById('dimensionalAmount').innerHTML = format(player.dimensionShifts)
    if(player.dimensionShifts.lt(8)) document.getElementById('dimensionalCost').innerHTML = "20x " + player.dimensionShifts.add(1) + "th dimensions"
    else document.getElementById('dimensionalCost').innerHTML = format(new Decimal(8).sub(6.5).mul(20)) + "x 8th dimensions"
}

function triggerPrestige(layer){
    if(layer > 1) triggerPrestige(layer-1)

    if(layer === 1){
        player.paradoxes = player.paradoxes.add(calculateGainedParadoxes())
        player.paradoxTime = 0
        player.antimatter = new Decimal(19)
        player.totalAntimatter = new Decimal(0)
        player.dimensions = {
            1: [new Decimal(0), new Decimal(0)],
            2: [new Decimal(0), new Decimal(0)],
            3: [new Decimal(0), new Decimal(0)],
            4: [new Decimal(0), new Decimal(0)],
            5: [new Decimal(0), new Decimal(0)],
            6: [new Decimal(0), new Decimal(0)],
            7: [new Decimal(0), new Decimal(0)],
            8: [new Decimal(0), new Decimal(0)],
        }
    } else if(layer === 2){
        player.paradoxes = new Decimal(0)
        player.paradoxUpgrades = [
            new Decimal(0), //buffer
            new Decimal(0), //r1 start
            new Decimal(0),
            new Decimal(0),
            new Decimal(0),
            new Decimal(0), //r2 start
            new Decimal(0),
            new Decimal(0),
            new Decimal(0),
        ]
        player.dimensionShifts = player.dimensionShifts.add(1)
    } else {
        console.error(layer + " does not exist: triggerReset()")
    }
    updatePrestigeDisplays()
}

function toggleAutomation(num){
    player.automation[num] = !player.automation[num]
}

function dimensionShift(reset){
    let buyable = false;

    if(player.dimensionShifts.equals(0)) if(player.dimensions[1][0].gte(20)) buyable = true;
    else if(player.dimensionShifts.equals(1)) if(player.dimensions[2][0].gte(20)) buyable = true;
    else if(player.dimensionShifts.equals(2)) if(player.dimensions[3][0].gte(20)) buyable = true;
    else if(player.dimensionShifts.equals(3)) if(player.dimensions[4][0].gte(20)) buyable = true;
    else if(player.dimensionShifts.equals(4)) if(player.dimensions[5][0].gte(20)) buyable = true;
    else if(player.dimensionShifts.equals(5)) if(player.dimensions[6][0].gte(20)) buyable = true;
    else if(player.dimensionShifts.equals(6)) if(player.dimensions[7][0].gte(20)) buyable = true;
    else if(player.dimensionShifts.equals(7)) if(player.dimensions[8][0].gte(20)) buyable = true;
    else if(player.dimensions[8][0].gte(new Decimal(8).sub(6.5).mul(20))) buyable = true;

    if(reset && buyable){triggerPrestige(2)}
}

var tickAntimatter = function(dt){
    document.getElementById("AMS").innerHTML = formatSmall(player.dimensions[1][1].mul(calcADMulti(1)).mul(calcAMMulti()))

    player.antimatter = player.antimatter.add(player.dimensions[1][1].mul(calcADMulti(1)).mul(calcAMMulti()).mul(dt))
    player.totalAntimatter = player.totalAntimatter.add(player.dimensions[1][1].mul(calcADMulti(1)).mul(calcAMMulti()).mul(dt))
    player.dimensions[1][1] = player.dimensions[1][1].add(player.dimensions[2][1].mul(calcADMulti(2)).mul(dt))
    player.dimensions[2][1] = player.dimensions[2][1].add(player.dimensions[3][1].mul(calcADMulti(3)).mul(dt))
    player.dimensions[3][1] = player.dimensions[3][1].add(player.dimensions[4][1].mul(calcADMulti(4)).mul(dt))
    player.dimensions[4][1] = player.dimensions[4][1].add(player.dimensions[5][1].mul(calcADMulti(5)).mul(dt))
    player.dimensions[5][1] = player.dimensions[5][1].add(player.dimensions[6][1].mul(calcADMulti(6)).mul(dt))
    player.dimensions[6][1] = player.dimensions[6][1].add(player.dimensions[7][1].mul(calcADMulti(7)).mul(dt))
    player.dimensions[7][1] = player.dimensions[7][1].add(player.dimensions[8][1].mul(calcADMulti(8)).mul(dt))
}

var calcMatter = function(mt){
    let x = new Decimal(mt).div(180).pow(2.5).add(1)

    x = x.div(2).tetrate(2).add(x.pow(2)).sub(1.4).max(0)

    let upgradeSixEffect = new Decimal(3).pow(player.paradoxUpgrades[6])

    if(upgradeSixToggled){x = x.div(upgradeSixEffect)}
    else{x = x.mul(upgradeSixEffect)}
    return x
}

var calculateADCost = function(num,bulk = 1){
    const cost = [10,100,1e4,1e6,1e9,1e13,1e18,1e24];
    const scaling = [1e3,1e4,1e5,1e6,1e8,1e10,1e12,1e15];

    const dims = player.dimensions[num][0].add(bulk).sub(1);

    return new Decimal(scaling[num-1]).pow(dims.div(10).floor()).mul(cost[num-1]).div(new Decimal(2).pow(player.paradoxUpgrades[5]))
}
var buyAD = function(num, bulk = new Decimal(1)){
    if(bulk.gte(1)){
        const cost = [10,100,1e4,1e6,1e9,1e13,1e18,1e24];
        const scaling = [1e3,1e4,1e5,1e6,1e8,1e10,1e12,1e15];
        const maxBuys = player.antimatter.div(cost[num-1]).mul((new Decimal(2).pow(player.paradoxUpgrades[5]))).div(10).ceil().log(scaling[num-1]).mul(10);
        if(!maxBuys) maxBuys = player.antimatter.div(cost[num-1]).mul((new Decimal(2).pow(player.paradoxUpgrades[5]))).floor()

        bulk = bulk.min(maxBuys.max(1))
        console.log(bulk)
    }

    let cost = calculateADCost(num,bulk)

    if(bulk.gte(1)) cost = cost.mul(new Decimal(10-player.dimensions[num][0]%10).min(bulk));

    if(player.antimatter.gte(cost)){
        player.antimatter = player.antimatter.sub(cost)
        player.dimensions[num][0] = player.dimensions[num][0].add(bulk)
        player.dimensions[num][1] = player.dimensions[num][1].add(bulk)

        document.getElementsByClassName("amAmount")[num-1].innerHTML = format(player.dimensions[num][1])
        document.getElementsByClassName("amBuys")[num-1].innerHTML = format(player.dimensions[num][0])
        document.getElementsByClassName("amCost")[num-1].innerHTML = format(calculateADCost(num))
    }
}

var calculateParadoxUpgradeCost = function(num){
    const cost =    [2, 1, 3,   5, 2,  125, 15, 1];
    const scaling = [2, 4, 1.5, 5, 50, 4,   7,  2.75];

    return new Decimal(scaling[num-1]).pow(player.paradoxUpgrades[num]).mul(cost[num-1]).ceil()
}

var buyParadoxUpgrade = function(num){
    if(player.paradoxes.gte(calculateParadoxUpgradeCost(num))){
        player.paradoxes = player.paradoxes.sub(calculateParadoxUpgradeCost(num));
        player.paradoxUpgrades[num] = player.paradoxUpgrades[num].add(1)
        
        document.getElementById("paradoxes").innerHTML = format(player.paradoxes)

        for (let num = 1; num <= 8; num++) {
            document.getElementsByClassName("cost")[num - 1].innerHTML = format(calculateParadoxUpgradeCost(num));
            document.getElementsByClassName("amount")[num - 1].innerHTML = format(player.paradoxUpgrades[num]);
        }
    }
}


createNewDimension(1, "1st dimension")
createNewDimension(2, "2nd dimension")
createNewDimension(3, "3rd dimension")
createNewDimension(4, "4th dimension")
createNewDimension(5, "5th dimension")
createNewDimension(6, "6th dimension")
createNewDimension(7, "7th dimension")
createNewDimension(8, "8th dimension")

updatePrestigeDisplays()


for (let num = 1; num <= 8; num++) {
    document.getElementsByClassName("cost")[num - 1].innerHTML = format(calculateParadoxUpgradeCost(num));
    document.getElementsByClassName("amount")[num - 1].innerHTML = format(player.paradoxUpgrades[num]);
}



var lastUpdate = Date.now();

var myInterval = setInterval(function(){
    var now = Date.now();
    var dt = (now - lastUpdate)/1000;
    lastUpdate = now;

    dt *= parseInt(player.paradoxUpgrades[8])/4+1

    player.paradoxTime += dt;

    tickAntimatter(dt)

    player.matter = calcMatter(player.paradoxTime)

    document.getElementById("antimatter").innerHTML = formatSmall(player.antimatter)
    document.getElementById("matter").innerHTML = format(player.matter)

    for (let num = 1; num <= 8; num++) {
        document.getElementsByClassName("amAmount")[num - 1].innerHTML = format(player.dimensions[num][1]);
        document.getElementsByClassName("amBuys")[num - 1].innerHTML = format(player.dimensions[num][0]);
        document.getElementsByClassName("amCost")[num - 1].innerHTML = format(calculateADCost(num));
        
        if(player.dimensionShifts.add(1).gte(num)) document.getElementById("ad" + num).style.visibility = 'visible'
        else document.getElementById("ad" + num).style.visibility = 'hidden'
    }


    document.getElementById("paradoxGain").innerHTML = format(calculateGainedParadoxes())
    if(player.matter.gte(player.antimatter)) triggerPrestige(1)

    if(player.automation[0]) buyAD(1)
}, 10);