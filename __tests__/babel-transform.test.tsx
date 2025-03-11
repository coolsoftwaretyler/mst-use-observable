import { describe, it, expect } from "bun:test"
import * as babel from "@babel/core"
import fs from "node:fs"
import path from "node:path"

interface LoggerEvent {
    kind: string
}

describe("Babel transform tests", () => {
    it("should compile the component successfully", () => {
        let successfulCompileCount = 0
        const componentPath = path.join(process.cwd(), "__tests__/components/RenderComponent.tsx")
        const source = fs.readFileSync(componentPath, "utf-8")

        // Configure Babel transform
        babel.transformSync(source, {
            presets: ["@babel/preset-typescript", "@babel/preset-react"],
            plugins: [
                [
                    "babel-plugin-react-compiler",
                    {
                        logger: {
                            logEvent(_filename: string | null, event: LoggerEvent) {
                                if (event.kind === "CompileSuccess") {
                                    successfulCompileCount++
                                }
                            }
                        }
                    }
                ]
            ],
            parserOpts: {
                plugins: ["jsx", "typescript"]
            },
            filename: componentPath
        })

        expect(successfulCompileCount).toBe(1)
    })
})
