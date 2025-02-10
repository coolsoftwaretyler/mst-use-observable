import { t } from "mobx-state-tree"

const SubModel = t
    .model("SubModel", {
        title: "Hello World"
    })
    .actions(sub => ({
        randomize() {
            const randomString = Array.from({ length: 8 }, () =>
                "Hello World".charAt(Math.random() * 10)
            ).join("")
            sub.title = randomString
        }
    }))
    .views(self => ({
        get allCaps() {
            return self.title.toUpperCase()
        },
        lowercase() {
            return self.title.toLowerCase()
        }
    }))
    .volatile(self => ({
        volatileProperty: { propName: "hi" + self.title + "hi" }
    }))

const SomeModel = t
    .model("SomeModel", {
        count: 0,
        shouldNotBeObserved: "Do not render here",
        submodel: t.optional(SubModel, { title: "Hello World" })
    })
    .actions(self => ({
        increment() {
            self.count += 1
        },
        decrement() {
            self.count -= 1
        },
        changeNonObservedProperty() {
            self.shouldNotBeObserved = Math.random().toString()
        }
    }))

export const store = SomeModel.create()
