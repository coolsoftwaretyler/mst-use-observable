import { t, type Instance } from "mobx-state-tree"
import { useObservable } from "../src/useObservable.js"
import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, setSystemTime } from "bun:test"

setSystemTime(new Date("2025-03-04T00:00:00.000Z"))

const TestModel = t
    .model("TestModel", {
        union: t.union(t.string, t.undefined),
        optional: t.optional(t.string, "Default"),
        enumeration: t.enumeration("Enum", ["Option1", "Option2", "Option3"]),
        refinement: t.refinement(t.number, value => value > 0),
        maybe: t.maybe(t.string),
        frozen: t.frozen<{ a: string; b: number }>()
    })
    .actions(self => ({
        setUnion(value: string | undefined) {
            self.union = value
        },
        setOptional(value: string) {
            self.optional = value
        },
        setEnumeration(value: "Option1" | "Option2" | "Option3") {
            self.enumeration = value
        },
        setRefinement(value: number) {
            self.refinement = value
        },
        setMaybe(value?: string) {
            self.maybe = value
        },
        setFrozen(value: { a: string; b: number }) {
            self.frozen = value
        }
    }))

type TestModelInstance = Instance<typeof TestModel>

function TestComponent(props: { model: TestModelInstance }) {
    const { union, optional, enumeration, refinement, maybe, frozen } = useObservable(props.model)
    return (
        <div>
            <p>Union: {union ?? "undefined"}</p>
            <p>Optional: {optional}</p>
            <p>Enumeration: {enumeration}</p>
            <p>Refinement: {refinement}</p>
            <p>Maybe: {maybe}</p>
            <p>Frozen: {JSON.stringify(frozen)}</p>
        </div>
    )
}

describe("Observing utilities on a model", () => {
    it("should render the component", () => {
        const model = TestModel.create({
            union: undefined,
            optional: "test",
            enumeration: "Option1",
            refinement: 1,
            maybe: "test",
            frozen: { a: "test", b: 1 }
        })
        render(<TestComponent model={model} />)
        expect(screen.getByText("Union: undefined")).toBeInTheDocument()
        expect(screen.getByText("Optional: test")).toBeInTheDocument()
        expect(screen.getByText("Enumeration: Option1")).toBeInTheDocument()
        expect(screen.getByText("Refinement: 1")).toBeInTheDocument()
        expect(screen.getByText("Maybe: test")).toBeInTheDocument()
        expect(screen.getByText('Frozen: {"a":"test","b":1}')).toBeInTheDocument()
    })

    describe("when the union is updated", () => {
        it("should render the new union", async () => {
            const model = TestModel.create({
                union: undefined,
                optional: "test",
                enumeration: "Option1",
                refinement: 1,
                maybe: "test",
                frozen: { a: "test", b: 1 }
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Union: undefined")).toBeInTheDocument()
            model.setUnion("test")
            await waitFor(() => {
                expect(screen.getByText("Union: test")).toBeInTheDocument()
            })
        })
    })
    describe("when the optional is updated from default", () => {
        it("should render the new optional", async () => {
            const model = TestModel.create({
                union: undefined,
                enumeration: "Option1",
                refinement: 1,
                maybe: "test",
                frozen: { a: "test", b: 1 }
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Optional: Default")).toBeInTheDocument()
            model.setOptional("new test")
            await waitFor(() => {
                expect(screen.getByText("Optional: new test")).toBeInTheDocument()
            })
        })
    })
    describe("when the optional is updated from a value", () => {
        it("should render the new optional", async () => {
            const model = TestModel.create({
                union: undefined,
                optional: "test",
                enumeration: "Option1",
                refinement: 1,
                maybe: "test",
                frozen: { a: "test", b: 1 }
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Optional: test")).toBeInTheDocument()
            model.setOptional("new test")
            await waitFor(() => {
                expect(screen.getByText("Optional: new test")).toBeInTheDocument()
            })
        })
    })
    describe("when the enumeration is updated", () => {
        it("should render the new enumeration", async () => {
            const model = TestModel.create({
                union: undefined,
                optional: "test",
                enumeration: "Option1",
                refinement: 1,
                maybe: "test",
                frozen: { a: "test", b: 1 }
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Enumeration: Option1")).toBeInTheDocument()
            model.setEnumeration("Option2")
            await waitFor(() => {
                expect(screen.getByText("Enumeration: Option2")).toBeInTheDocument()
            })
        })
    })
    describe("when the refinement is updated", () => {
        it("should render the new refinement", async () => {
            const model = TestModel.create({
                union: undefined,
                optional: "test",
                enumeration: "Option1",
                refinement: 1,
                maybe: "test",
                frozen: { a: "test", b: 1 }
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Refinement: 1")).toBeInTheDocument()
            model.setRefinement(2)
            await waitFor(() => {
                expect(screen.getByText("Refinement: 2")).toBeInTheDocument()
            })
        })
    })
    describe("when the maybe is updated from undefined", () => {
        it("should render the new maybe", async () => {
            const model = TestModel.create({
                union: undefined,
                optional: "test",
                enumeration: "Option1",
                refinement: 1,
                frozen: { a: "test", b: 1 }
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Maybe:")).toBeInTheDocument()
            model.setMaybe("new test")
            await waitFor(() => {
                expect(screen.getByText("Maybe: new test")).toBeInTheDocument()
            })
        })
    })
    describe("when the maybe is updated from a value", () => {
        it("should render the new maybe", async () => {
            const model = TestModel.create({
                union: undefined,
                optional: "test",
                enumeration: "Option1",
                refinement: 1,
                maybe: "test",
                frozen: { a: "test", b: 1 }
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Maybe: test")).toBeInTheDocument()
            model.setMaybe("new test")
            await waitFor(() => {
                expect(screen.getByText("Maybe: new test")).toBeInTheDocument()
            })
        })
    })
    describe("when the frozen is updated", () => {
        it("should render the new frozen", async () => {
            const model = TestModel.create({
                union: undefined,
                optional: "test",
                enumeration: "Option1",
                refinement: 1,
                maybe: "test",
                frozen: { a: "test", b: 1 }
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText('Frozen: {"a":"test","b":1}')).toBeInTheDocument()
            model.setFrozen({ a: "new test", b: 2 })
            await waitFor(() => {
                expect(screen.getByText('Frozen: {"a":"new test","b":2}')).toBeInTheDocument()
            })
        })
    })
})
