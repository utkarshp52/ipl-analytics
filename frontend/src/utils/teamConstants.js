export const TEAM_ASSETS = {
    // Active Teams
    "Chennai Super Kings": {
        logo: "/logos/csk.png",
        color: "#F9CD05",
    },
    "Mumbai Indians": {
        logo: "/logos/mi.png",
        color: "#004BA0",
    },
    "Royal Challengers Bangalore": {
        logo: "/logos/rcb.png",
        color: "#EC1C24",
    },
    "Kolkata Knight Riders": {
        logo: "/logos/kkr.png",
        color: "#3A225D",
    },
    "Sunrisers Hyderabad": {
        logo: "/logos/srh.png",
        color: "#FF822A",
    },
    "Delhi Capitals": {
        logo: "https://www.bing.com/th/id/OIP.QTNFmg90PgyLBDAiqTIKbAHaFk?w=212&h=211&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
        color: "#00008B",
    },
    "Rajasthan Royals": {
        logo: "https://www.bing.com/th/id/OIP.yEwahQztoQ3g5fACDnMOCgHaFP?w=215&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
        color: "#EA1A85",
    },
    "Punjab Kings": {
        logo: "/logos/pk.png",
        color: "#ED1B24",
    },
    "Gujarat Titans": {
        logo: "/logos/gt.png",
        color: "#1C1C1C",
    },
    "Lucknow Super Giants": {
        logo: "https://th.bing.com/th/id/OIP.hHSSZR27mzirtusLrPN_eQHaHa?w=168&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        color: "#21448B",
    },
      // Defunct Teams
    "Kochi Tuskers Kerala": {
        logo: "/logos/kochi.png",
        color: "#D94119",
    },
    "Rising Pune Supergiants": {
        logo: "/logos/rps.png",
        color: "#D02C82",
    },
};

// Normalize legacy/renamed team names to their canonical modern name
const TEAM_NAME_ALIASES = {
    "Royal Challengers Bengaluru": "Royal Challengers Bangalore",
    "Deccan Chargers": "Sunrisers Hyderabad",
    "Delhi Daredevils": "Delhi Capitals",
    "Kings XI Punjab": "Punjab Kings",
    "Pune Warriors": "Rising Pune Supergiants",
    "Rising Pune Supergiant": "Rising Pune Supergiants",
    "Gujarat Lions": "Gujarat Titans",
};

export const normalizeTeamName = (teamName) => {
    return TEAM_NAME_ALIASES[teamName] || teamName;
};

export const getTeamAsset = (teamName) => {
    const normalized = normalizeTeamName(teamName);
    return TEAM_ASSETS[normalized] || { logo: "", color: "#667eea" };
};
