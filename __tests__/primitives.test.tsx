import { t, type Instance } from "mobx-state-tree"
import { useObservable } from "../src/useObservable.js"
import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, setSystemTime } from "bun:test"

setSystemTime(new Date("2025-03-04T00:00:00.000Z"))

const TestModel = t
    .model("TestModel", {
        string: t.string,
        number: t.number,
        integer: t.integer,
        float: t.float,
        finite: t.finite,
        boolean: t.boolean,
        date: t.Date
    })
    .actions(self => ({
        setString(value: string) {
            self.string = value
        },
        setNumber(value: number) {
            self.number = value
        },
        setInteger(value: number) {
            self.integer = value
        },
        setFloat(value: number) {
            self.float = value
        },
        setFinite(value: number) {
            self.finite = value
        },
        setBoolean(value: boolean) {
            self.boolean = value
        },
        setDate(value: Date) {
            self.date = value
        }
    }))

type TestModelInstance = Instance<typeof TestModel>

function TestComponent(props: { model: TestModelInstance }) {
    const { string, integer, number, float, finite, boolean, date } = useObservable(props.model)

    return (
        <div>
            <p>String: {string}</p>
            <p>Integer: {integer}</p>
            <p>Number: {number}</p>
            <p>Float: {float}</p>
            <p>Finite: {finite}</p>
            <p>Boolean: {boolean ? "true" : "false"}</p>
            <p>Date: {date.toISOString()}</p>
        </div>
    )
}

describe("Observing primitive values on a model", () => {
    it("should render the component", () => {
        const model = TestModel.create({
            string: "test",
            number: 1,
            integer: 1,
            float: 1.1,
            finite: 1,
            boolean: true,
            date: new Date()
        })
        render(<TestComponent model={model} />)
        expect(screen.getByText("String: test")).toBeInTheDocument()
        expect(screen.getByText("Integer: 1")).toBeInTheDocument()
        expect(screen.getByText("Number: 1")).toBeInTheDocument()
        expect(screen.getByText("Float: 1.1")).toBeInTheDocument()
        expect(screen.getByText("Finite: 1")).toBeInTheDocument()
        expect(screen.getByText("Boolean: true")).toBeInTheDocument()
        expect(screen.getByText("Date: 2025-03-04T00:00:00.000Z")).toBeInTheDocument()
    })

    describe("when the string is updated", () => {
        it("should render the new string", async () => {
            const model = TestModel.create({
                string: "test",
                number: 1,
                integer: 1,
                float: 1.1,
                finite: 1,
                boolean: true,
                date: new Date()
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("String: test")).toBeInTheDocument()
            model.setString("new string")
            await waitFor(() => {
                expect(screen.getByText("String: new string")).toBeInTheDocument()
            })
        })
    })

    describe("when the number is updated", () => {
        it("should render the new number", async () => {
            const model = TestModel.create({
                string: "test",
                number: 1,
                integer: 1,
                float: 1.1,
                finite: 1,
                boolean: true,
                date: new Date()
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Number: 1")).toBeInTheDocument()
            model.setNumber(2)
            await waitFor(() => {
                expect(screen.getByText("Number: 2")).toBeInTheDocument()
            })
        })
    })

    describe("when the integer is updated", () => {
        it("should render the new integer", async () => {
            const model = TestModel.create({
                string: "test",
                number: 1,
                integer: 1,
                float: 1.1,
                finite: 1,
                boolean: true,
                date: new Date()
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Integer: 1")).toBeInTheDocument()
            model.setInteger(2)
            await waitFor(() => {
                expect(screen.getByText("Integer: 2")).toBeInTheDocument()
            })
        })
    })

    describe("when the float is updated", () => {
        it("should render the new float", async () => {
            const model = TestModel.create({
                string: "test",
                number: 1,
                integer: 1,
                float: 1.1,
                finite: 1,
                boolean: true,
                date: new Date()
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Float: 1.1")).toBeInTheDocument()
            model.setFloat(2.2)
            await waitFor(() => {
                expect(screen.getByText("Float: 2.2")).toBeInTheDocument()
            })
        })
    })

    describe("when the finite is updated", () => {
        it("should render the new finite", async () => {
            const model = TestModel.create({
                string: "test",
                number: 1,
                integer: 1,
                float: 1.1,
                finite: 1,
                boolean: true,
                date: new Date()
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Finite: 1")).toBeInTheDocument()
            model.setFinite(2)
            await waitFor(() => {
                expect(screen.getByText("Finite: 2")).toBeInTheDocument()
            })
        })
    })

    describe("when the boolean is updated", () => {
        it("should render the new boolean", async () => {
            const model = TestModel.create({
                string: "test",
                number: 1,
                integer: 1,
                float: 1.1,
                finite: 1,
                boolean: true,
                date: new Date()
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Boolean: true")).toBeInTheDocument()
            model.setBoolean(false)
            await waitFor(() => {
                expect(screen.getByText("Boolean: false")).toBeInTheDocument()
            })
        })
    })

    describe("when the date is updated", () => {
        it("should render the new date", async () => {
            const model = TestModel.create({
                string: "test",
                number: 1,
                integer: 1,
                float: 1.1,
                finite: 1,
                boolean: true,
                date: new Date()
            })
            render(<TestComponent model={model} />)
            expect(screen.getByText("Date: 2025-03-04T00:00:00.000Z")).toBeInTheDocument()
            model.setDate(new Date("2025-03-05T00:00:00.000Z"))
            await waitFor(() => {
                expect(screen.getByText("Date: 2025-03-05T00:00:00.000Z")).toBeInTheDocument()
            })
        })
    })
})
