import { render, fireEvent } from "@testing-library/react"
import HookPage from "./components/RenderComponent.js"
import { describe, it, expect } from "bun:test"

describe("HookPage", () => {
    it("renders the component and increments the counter", () => {
        const { getByText } = render(<HookPage />)
        expect(getByText("Count: 0")).toBeInTheDocument()
        fireEvent.click(getByText("+"))
        expect(getByText("Count: 1")).toBeInTheDocument()
    })
})
