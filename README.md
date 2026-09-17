# Core Radar

A serverless weather radar/alert/discussion browser

[See it here!](https://mbg206.github.io/core-radar/)

## For development:

- `npm ci` to install Node dependences
- `cargo install wasm-pack` to install Rust dependences
- [Spreet](https://github.com/flother/spreet) is also a dependency. Either download the latest release binary and place it in the root folder, or run `cargo install spreet` (slower)
- `npm run build` to build the project into the `public` directory
- `npm run watch` to start esbuild's watcher (auto-builds when changes are made)

## Roadmap

### In Progress

- [ ] Basic NEXRAD reflectivity radar

### Planned/Completed

- [ ] Custom map style
- [ ] Radar timeline
- [ ] Individual station view (Map tile images)
- [ ] Individual station view (Level 2/3 parsing in Rust)
- [ ] Point METAR/forecast fetching
- [ ] Live alert polygons
- [ ] Convective outlooks
- [ ] Mesoscale discussions
- [ ] Storm reports
- [ ] Climate outlooks
- [ ] Weather model data?