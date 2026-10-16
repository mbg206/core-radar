import { MAP } from "../map/map";

const GEOCODE_SERVER = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

const SEARCH_INPUT = document.getElementById("search-input") as HTMLInputElement;
const SEARCH_RESULTS_CONTAINER = document.getElementById("search-results");

SEARCH_INPUT.addEventListener("focus", populateResults);
SEARCH_INPUT.addEventListener("input", populateResults);
SEARCH_INPUT.addEventListener("blur", (e) => {
    if ((e.relatedTarget as HTMLElement)?.parentElement != SEARCH_RESULTS_CONTAINER) {
        clearResults();
    }
});

async function populateResults() {
    if (SEARCH_INPUT.value.length == 0) {
        clearResults();
    }

    const res = await fetch(`${GEOCODE_SERVER}/suggest?f=json&countryCode=USA,PRI,VIR,GUM,ASM&category=Land+Features,Bay,Channel,Cove,Dam,Delta,Gulf,Lagoon,Lake,Ocean,Reef,Reservoir,Sea,Sound,Strait,Waterfall,Wharf,Amusement+Park,Historical+Monument,Landmark,Tourist+Attraction,Zoo,College,Beach,Campground,Golf+Course,Harbor,Nature+Reserve,Other+Parks+and+Outdoors,Park,Racetrack,Scenic+Overlook,Ski+Resort,Sports+Center,Sports+Field,Wildlife+Reserve,Airport,Ferry,Marina,Pier,Port,Resort,Postal,Populated+Place&maxSuggestions=5&returnCollections=false&text=${encodeURIComponent(SEARCH_INPUT.value)}`);
    const data = await res.json();
    clearResults();

    for (const result of data.suggestions) {
        const button = document.createElement("button");
        button.classList.add("result", "trans");
        button.textContent = result.text;

        button.addEventListener("click", async () => {
            const res = await fetch(`${GEOCODE_SERVER}/findAddressCandidates?f=json&maxLocations=1&singleLine=${encodeURIComponent(result.text)}&magicKey=${encodeURIComponent(result.magicKey)}`);
            const data = await res.json();
            const coords = data.candidates[0].location;
            MAP.flyTo({
                center: [coords.x, coords.y],
                zoom: 9
            })
            clearResults();
        });
        
        SEARCH_RESULTS_CONTAINER.append(button);
    }
}

function clearResults() {
    SEARCH_RESULTS_CONTAINER.innerHTML = "";
}

// https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&countryCode=USA,PRI,VIR,GUM,ASM&category=Land+Features,Bay,Channel,Cove,Dam,Delta,Gulf,Lagoon,Lake,Ocean,Reef,Reservoir,Sea,Sound,Strait,Waterfall,Wharf,Amusement+Park,Historical+Monument,Landmark,Tourist+Attraction,Zoo,College,Beach,Campground,Golf+Course,Harbor,Nature+Reserve,Other+Parks+and+Outdoors,Park,Racetrack,Scenic+Overlook,Ski+Resort,Sports+Center,Sports+Field,Wildlife+Reserve,Airport,Ferry,Marina,Pier,Port,Resort,Postal,Populated+Place&maxSuggestions=5&text=Ames&_=1502903455655
// https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&countryCode=USA,PRI,VIR,GUM,ASM&category=Land+Features,Bay,Channel,Cove,Dam,Delta,Gulf,Lagoon,Lake,Ocean,Reef,Reservoir,Sea,Sound,Strait,Waterfall,Wharf,Amusement+Park,Historical+Monument,Landmark,Tourist+Attraction,Zoo,College,Beach,Campground,Golf+Course,Harbor,Nature+Reserve,Other+Parks+and+Outdoors,Park,Racetrack,Scenic+Overlook,Ski+Resort,Sports+Center,Sports+Field,Wildlife+Reserve,Airport,Ferry,Marina,Pier,Port,Resort,Postal,Populated+Place&maxSuggestions=10&text=ames&_=1792014100687