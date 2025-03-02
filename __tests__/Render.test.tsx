// packages/mst-react/src/__tests__/MyComponent.test.tsx
import * as React from "react"
import { render, fireEvent } from "@testing-library/react"
import HookPage from "./components/RenderComponent.js" // adjust the path as needed

describe("HookPage", () => {
    // Create a minimal MST model for testing
    it("renders the component and increments the counter", () => {
        const { getByText } = render(<HookPage />)
        // try use million js to getby to validate 
        // or this: https://github.com/testing-library/react-hooks-testing-library/pull/136#issuecomment-517996838
        // ^ example code
        expect(getByText("Count: 0")).toBeInTheDocument()
        fireEvent.click(getByText("+"))
        expect(getByText("Count: 1")).toBeInTheDocument()
    })
})
