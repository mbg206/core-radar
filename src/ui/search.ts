import { MAP } from "../map/map";

const GEOCODE_SERVER = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchResultsContainer = document.getElementById("search-results");

searchInput.addEventListener("focus", populateResults);
searchInput.addEventListener("input", populateResults);
searchInput.addEventListener("blur", (e) => {
    if ((e.relatedTarget as HTMLElement)?.parentElement != searchResultsContainer) {
        clearResults();
    }
});

async function populateResults() {
    if (searchInput.value.length == 0) {
        clearResults();
    }

    const res = await fetch(`${GEOCODE_SERVER}/suggest?f=json&countryCode=USA,PRI,VIR,GUM,ASM&category=Land+Features,Bay,Channel,Cove,Dam,Delta,Gulf,Lagoon,Lake,Ocean,Reef,Reservoir,Sea,Sound,Strait,Waterfall,Wharf,Amusement+Park,Historical+Monument,Landmark,Tourist+Attraction,Zoo,College,Beach,Campground,Golf+Course,Harbor,Nature+Reserve,Other+Parks+and+Outdoors,Park,Racetrack,Scenic+Overlook,Ski+Resort,Sports+Center,Sports+Field,Wildlife+Reserve,Airport,Ferry,Marina,Pier,Port,Resort,Postal,Populated+Place&maxSuggestions=5&returnCollections=false&text=${encodeURIComponent(searchInput.value)}`);
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
        
        searchResultsContainer.append(button);
    }
}

function clearResults() {
    searchResultsContainer.innerHTML = "";
}

// https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&countryCode=USA,PRI,VIR,GUM,ASM&category=Land+Features,Bay,Channel,Cove,Dam,Delta,Gulf,Lagoon,Lake,Ocean,Reef,Reservoir,Sea,Sound,Strait,Waterfall,Wharf,Amusement+Park,Historical+Monument,Landmark,Tourist+Attraction,Zoo,College,Beach,Campground,Golf+Course,Harbor,Nature+Reserve,Other+Parks+and+Outdoors,Park,Racetrack,Scenic+Overlook,Ski+Resort,Sports+Center,Sports+Field,Wildlife+Reserve,Airport,Ferry,Marina,Pier,Port,Resort,Postal,Populated+Place&maxSuggestions=5&text=Ames&_=1502903455655
// https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&countryCode=USA,PRI,VIR,GUM,ASM&category=Land+Features,Bay,Channel,Cove,Dam,Delta,Gulf,Lagoon,Lake,Ocean,Reef,Reservoir,Sea,Sound,Strait,Waterfall,Wharf,Amusement+Park,Historical+Monument,Landmark,Tourist+Attraction,Zoo,College,Beach,Campground,Golf+Course,Harbor,Nature+Reserve,Other+Parks+and+Outdoors,Park,Racetrack,Scenic+Overlook,Ski+Resort,Sports+Center,Sports+Field,Wildlife+Reserve,Airport,Ferry,Marina,Pier,Port,Resort,Postal,Populated+Place&maxSuggestions=10&text=ames&_=1792014100687