import init, {add} from "../../data-parser/pkg/data_parser";


addEventListener("message", async () => {
    await init();
    const b = add(3, 4);
    postMessage(b);
});