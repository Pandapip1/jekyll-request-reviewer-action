import { Octokit } from "../../types";
import checkTerminalStatus from "../terminal";

let fakeOctokit = null as unknown as Octokit; // Ew, but it works

describe("checkTerminalStatus", () => {
    test("Should require half of all editors on terminal file", () => {
        expect(checkTerminalStatus(fakeOctokit, { all: ["a", "b", "c", "d"] }, [{ filename: "EIPS/eip-1.md", status: "modified",previous_contents: "---\nstatus: Final\n---\nHello!" }])).resolves.toMatchObject([{
            name: "terminal",
            reviewers: ["a", "b", "c", "d"],
            min: 2,
            annotation: {
                file: "EIPS/eip-1.md"
            }
        }]);
    });

    test("Should not require any reviewers on non-terminal file", () => {
        expect(checkTerminalStatus(fakeOctokit, { all: ["a", "b", "c"] }, [{ filename: "EIPS/eip-1.md", status: "modified", previous_contents: "---\nstatus: Draft\n---\nHello!" }])).resolves.toMatchObject([]);
    });

    test("Should not require any reviewers on non-EIP file", () => {
        expect(checkTerminalStatus(fakeOctokit, { all: ["a", "b", "c"] }, [{ filename: "foo.txt", status: "modified", contents: "Hello!" }])).resolves.toMatchObject([]);
    });
});
