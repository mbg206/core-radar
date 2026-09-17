import * as esbuild from "esbuild";
import * as readline from "node:readline";
import { spawn } from "node:child_process";
import { rmSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

if (process.argv.length !== 3) {
    console.error("bad arguments!");
    process.exit(1);
}

const COMPILE_DIR = "public/compiled";

const DUPLICATE_SPRITES = [
    ["US:US_1", "US:US_2"],
    ["US:I_1", "US:I_2"],
    ["US:US:Business_1", "US:US:Business_2"],
    ["US:I:Business:Loop_1", "US:I:Business:Loop_2"],

    ["US:I:Business:Spur_3", "US:I:Business:Loop_3"],
    ["US:I:Business:Spur_2", "US:I:Business:Loop_2"],
    ["US:I:Business:Spur_1", "US:I:Business:Loop_1"]
];

const buildMode = process.argv[2];

if (buildMode == "cleanup") {
    console.log("Cleaning up build files...");
    rmSync("data-parser/target", {force: true, recursive: true});
    rmSync("data-parser/pkg", {force: true, recursive: true});
    rmSync(COMPILE_DIR, {force: true, recursive: true});

    console.log("Done!");
    process.exit(0);
}

if (!existsSync(COMPILE_DIR))
    mkdirSync(COMPILE_DIR);

if (!(await spriteBuild(1))) process.exit(2);
if (!(await spriteBuild(2))) process.exit(3);
if (!(await rustBuild())) process.exit(1);

const ctx = await esbuild.context({
    entryPoints: [
        {in: "src/index.ts", out: "app"},
        {in: "src/worker/worker.ts", out: "data-worker"},
        {in: "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", out: "worker"}
    ],
    bundle: true,
    outdir: COMPILE_DIR,
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

function run(command, args) {
    const packer = spawn(command, args, {stdio: "inherit"});

    return new Promise((res, rej) => {
        packer.on("exit", (code) => res(code == 0));
        packer.on("error", (err) => {
            console.error(err);
            res(false);
        });
    });
}

async function rustBuild() {
    const success = await run("wasm-pack", [
        "build",
        "data-parser",
        "--target", "web",
        "--no-pack"
    ]);

    if (success) {
        copyFileSync("data-parser/pkg/data_parser_bg.wasm", COMPILE_DIR + "/data_parser_bg.wasm");
    }
    else {
        console.error("Rust build failed!");
    }
    return success;
}


async function spriteBuild(ratio) {
    const path = COMPILE_DIR + (ratio == 1 ? "/sprites" : "/sprites@2x");
    const success = await run("spreet", [
        "--minify-index-file",
        "--unique",
        "--ratio", ratio.toString(),
        "sprites",
        path
    ]);
    const jsonFile = path + ".json";

    if (success) {
        const corrected = readFileSync(jsonFile, "utf-8")
            .replaceAll('+', ':');
        
        const data = JSON.parse(corrected);
        for (const duplicate of DUPLICATE_SPRITES) {
            data[duplicate[0]] = data[duplicate[1]];
        }

        writeFileSync(jsonFile, JSON.stringify(data), "utf-8");
    }
    else {
        console.error("Sprites build failed!");
    }
    return success;
}