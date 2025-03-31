// Function to set a cookie with Base64 encoding
function setCookie(name, value) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 10); // Set expiration to 10 years from now
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(btoa(value)) + ";" + expires + ";path=/";
}

// Function to get a cookie's value with Base64 decoding
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split("=");
        if (key === name) {
            try { return JSON.parse(atob(decodeURIComponent(value))); }
            catch (e) { return null; }
        }
    }
    return null;
}

// Serialize player object (including nested Decimal objects and arrays)
function serializePlayer(player) {
    const serializedPlayer = {
        antimatter: player.antimatter.toString(),
        totalAntimatter: player.totalAntimatter.toString(),
        matter: player.matter.toString(),
        paradoxes: player.paradoxes.toString(),
        dimensionShifts: player.dimensionShifts.toString(),
        paradoxTime: player.paradoxTime,
        dimensions: {},
        paradoxUpgrades: player.paradoxUpgrades.map(upgrade => upgrade.toString()),
        automatio0n: player.automation.map(upgrade => upgrade.toString()),
    };

    // Serialize dimensions (handle arrays of Decimals)
    for (const key in player.dimensions) {
        if (player.dimensions.hasOwnProperty(key)) {
            serializedPlayer.dimensions[key] = player.dimensions[key].map(dim => dim.toString());
        }
    }

    return serializedPlayer;
}

// Deserialize player object (including nested Decimal objects and arrays)
function deserializePlayer(data) {
    const deserializedPlayer = {
        antimatter: new Decimal(data.antimatter),
        totalAntimatter: new Decimal(data.totalAntimatter),
        matter: new Decimal(data.matter),
        paradoxes: new Decimal(data.paradoxes),
        paradoxTime: data.paradoxTime,
        dimensions: {},
        dimensionShifts: new Decimal(data.dimensionShifts),
        paradoxUpgrades: [],
        automation: [],
    };

    // Deserialize dimensions (handle arrays of Decimals)
    for (const key in data.dimensions) {
        if (data.dimensions.hasOwnProperty(key)) {
            deserializedPlayer.dimensions[key] = data.dimensions[key].map(dim => new Decimal(dim));
        }
    }

    // Deserialize paradoxUpgrades (ensure upgrades are restored as Decimal objects)
    if (data.paradoxUpgrades && Array.isArray(data.paradoxUpgrades)) {
        deserializedPlayer.paradoxUpgrades = data.paradoxUpgrades.map(upgrade => new Decimal(upgrade));
    }

    return deserializedPlayer;
}

// Function to load player data from cookies
function loadPlayerData() {
    const playerData = getCookie("player");

    // Deserialize data into proper format
    return playerData ? deserializePlayer(playerData) : null;
}

// Load or initialize player data
let player = loadPlayerData();
if (!player) {
    player = { // Initialize default player object
        antimatter: new Decimal(19),
        totalAntimatter: new Decimal(0), // Starts at 0 as requested
        matter: new Decimal(0),
        dimensions: {
            1: [new Decimal(0), new Decimal(0)],
            2: [new Decimal(0), new Decimal(0)],
            3: [new Decimal(0), new Decimal(0)],
            4: [new Decimal(0), new Decimal(0)],
            5: [new Decimal(0), new Decimal(0)],
            6: [new Decimal(0), new Decimal(0)],
            7: [new Decimal(0), new Decimal(0)],
            8: [new Decimal(0), new Decimal(0)],
        },
        paradoxes: new Decimal(0),
        paradoxTime: 0,
        paradoxUpgrades: [
            new Decimal(0), //buffer
            new Decimal(0), //r1 start
            new Decimal(0),
            new Decimal(0),
            new Decimal(0),
            new Decimal(0), //r2 start
            new Decimal(0),
            new Decimal(0),
            new Decimal(0),
        ],

        dimensionShifts: new Decimal(0),

        automation: [0,0,0,0,0,0,0,0],
    };
} else {
    if(!player.automation) player["automation"] = [0,0,0,0,0,0,0,0]
}

// Periodically save player data to cookies (every second)
var myInterval = setInterval(function () {
    const serializedPlayer = serializePlayer(player); // Serialize before saving
    setCookie("player", JSON.stringify(serializedPlayer));
}, 1000); // Save every second
