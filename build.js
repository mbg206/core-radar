import * as esbuild from "esbuild";
import * as readline from "node:readline";
import { spawn } from "node:child_process";
import { rmSync, copyFileSync } from "node:fs";

if (process.argv.length !== 3) {
    console.error("bad arguments!");
    process.exit(1);
}

const buildMode = process.argv[2];

if (buildMode == "cleanup") {
    console.log("Cleaning up build files...");
    rmSync("data-parser/target", {recursive: true});
    rmSync("data-parser/pkg", {recursive: true});
    console.log("Done!");
}

await rustBuild();

const ctx = await esbuild.context({
    entryPoints: [
        {in: "src/index.ts", out: "app"},
        {in: "src/worker/worker.ts", out: "data-worker"},
        {in: "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", out: "worker"}
    ],
    bundle: true,
    outdir: "public",
    splitting: true,
    chunkNames: "chunk-[hash]",
    minify: true,
    format: "esm",
    sourcemap: "linked"
    
});

if (buildMode == "dev") {
    await ctx.watch();
    const server = await ctx.serve({
        servedir: "public",
        host: "127.0.0.1",
        port: 8000
    });

    console.log(`Hosting on port ${server.port}\n`);
    console.log(server.hosts.map(host => `http://${host}:${server.port}/`).join('\n'));
    console.log("\nPress 'r' to rebuild rust component, or 'c' to exit")

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', async (str, key) => {
        if (key.name == 'c') {
            console.info("quitting...");
            await ctx.dispose();
            process.exit(0);
        }
        if (key.name == 'r') {
            await rustBuild();
            console.error("Rust component rebuilt");
        }
    });
}

else {
    await ctx.rebuild();
    await ctx.dispose();
    console.info("Build complete!");
}

function rustBuild() {
    const packer = spawn("wasm-pack", [
        "build",
        "data-parser",
        "--target", "web",
        "--no-pack"
    ], {stdio: "inherit"});

    return new Promise((res, rej) => {
        packer.on("exit", (code) => {
            if (code == 0) {
                copyFileSync("data-parser/pkg/data_parser_bg.wasm", "public/data_parser_bg.wasm");
            }
            else {
                console.error("Rust build failed!");
            }
            res();
        });
        packer.on("error", (err) => {
            console.error("Rust build failed!");
            res();
        });
    });
}